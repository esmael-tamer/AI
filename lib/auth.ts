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

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function createSession(userId: number): Promise<{ token: string; expiresAt: Date }> {
  const token = generateToken()
  const tokenHash = await hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  await sql`DELETE FROM sessions WHERE user_id = ${userId} AND expires_at < NOW()`

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt})
  `
  return { token, expiresAt }
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
    return hashHex === storedHash
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

  const [userId, token] = session.value.split(":")
  if (!userId || !token) return null

  const id = parseInt(userId)
  if (isNaN(id)) return null

  const tokenHash = await hashToken(token)

  const result = await sql`
    SELECT u.id, u.name_ar, u.name_en, u.email, u.phone, u.role, u.lang_pref, u.created_at, u.updated_at
    FROM users u
    INNER JOIN sessions s ON s.user_id = u.id
    WHERE u.id = ${id} AND s.token_hash = ${tokenHash} AND s.expires_at > NOW()
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
  const session = cookieStore.get(SESSION_COOKIE)

  if (session) {
    const [userId, token] = session.value.split(":")
    if (userId && token) {
      const tokenHash = await hashToken(token)
      await sql`DELETE FROM sessions WHERE user_id = ${parseInt(userId)} AND token_hash = ${tokenHash}`
    }
  }

  cookieStore.delete(SESSION_COOKIE)
  cookieStore.delete("user_id")
  cookieStore.delete("user_role")
}
