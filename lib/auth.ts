import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sql } from "./db"
import type { User } from "./db"

const SESSION_COOKIE = "mt-session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function hashPassword(password: string): Promise<string> {
  const salt = generateToken().slice(0, 32)
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hash = await crypto.subtle.digest("SHA-256", data)
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `${salt}:${hashHex}`
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash) return false

  if (!storedHash.includes(":")) {
    // Legacy format (old SHA-256 with static salt)
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "mediatrend-salt-2024")
    const hash = await crypto.subtle.digest("SHA-256", data)
    const hashHex = Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    if (hashHex === storedHash) return true
    // Also check if stored as plain text (from broken signup)
    return password === storedHash
  }

  const [salt, hash] = storedHash.split(":")
  if (!salt || !hash) return false
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const computed = await crypto.subtle.digest("SHA-256", data)
  const computedHex = Array.from(new Uint8Array(computed))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return computedHex === hash
}

export async function createUser(
  email: string,
  password: string,
  role: "admin" | "customer" = "customer",
  nameAr?: string,
  nameEn?: string,
  phone?: string,
): Promise<User | null> {
  const passwordHash = await hashPassword(password)
  const result = await sql`
    INSERT INTO users (email, password_hash, role, name_ar, name_en, phone)
    VALUES (${email}, ${passwordHash}, ${role}, ${nameAr || null}, ${nameEn || null}, ${phone || null})
    ON CONFLICT (email) DO NOTHING
    RETURNING *
  `
  return (result[0] as User) || null
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session) return null

  const [userId] = session.value.split(":")
  if (!userId) return null

  const id = parseInt(userId)
  if (isNaN(id)) return null

  const result = await sql`
    SELECT id, name_ar, name_en, email, phone, role, lang_pref, created_at, updated_at
    FROM users WHERE id = ${id}
  `
  return (result[0] as User) || null
}

export async function requireAuth(): Promise<User> {
  const user = await getSession()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.role !== "admin") {
    throw new Error("Forbidden")
  }
  return user
}

/**
 * Helper for API routes: wraps handler with admin authentication check.
 * Returns 401/403 JSON responses on failure.
 */
export async function withAdminAuth(
  handler: (admin: User) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin()
    return handler(admin)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized"
    const status = message === "Forbidden" ? 403 : 401
    return NextResponse.json({ error: message }, { status })
  }
}

/**
 * Helper for API routes: wraps handler with user authentication check.
 * Returns 401 JSON response on failure.
 */
export async function withAuth(
  handler: (user: User) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    const user = await requireAuth()
    return handler(user)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  cookieStore.delete("user_id")
  cookieStore.delete("user_role")
}
