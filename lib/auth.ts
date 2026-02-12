import { cookies } from "next/headers"
import { sql } from "./db"
import type { User } from "./db"

const SESSION_COOKIE = "mt-session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Simple session token generation
function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("")
}

// Simple password hashing using Web Crypto API (no bcrypt dependency needed)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "mediatrend-salt-2024")
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = await hashPassword(password)
  return inputHash === hash
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: "admin" | "customer" = "customer",
  phone?: string,
  companyName?: string
): Promise<User | null> {
  const passwordHash = await hashPassword(password)
  const result = await sql`
    INSERT INTO users (name, email, password_hash, role, phone, company_name)
    VALUES (${name}, ${email}, ${passwordHash}, ${role}, ${phone || null}, ${companyName || null})
    ON CONFLICT (email) DO NOTHING
    RETURNING *
  `
  return (result[0] as User) || null
}

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = true`
  const user = result[0] as User | undefined
  if (!user) return null

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return null

  const token = generateToken()

  // Store session in cookie
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, `${user.id}:${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return { user, token }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session) return null

  const [userId] = session.value.split(":")
  if (!userId) return null

  const result = await sql`SELECT * FROM users WHERE id = ${parseInt(userId)} AND is_active = true`
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

export { hashPassword, verifyPassword }
