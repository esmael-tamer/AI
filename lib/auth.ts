import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sql } from "./db"
import type { User } from "@/types"

const SESSION_COOKIE = "mt-session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/** Sets non-httpOnly identity cookies (user_role + user_id) readable by client JS and middleware. */
export function setClientIdentityCookies(response: NextResponse, userId: number, role: string): void {
  const opts = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  }
  response.cookies.set("user_role", role, opts)
  response.cookies.set("user_id", String(userId), opts)
}
const PBKDF2_ITERATIONS = 100_000

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  console.warn(
    "[auth] SESSION_SECRET env var is not set. Sessions are signed with DATABASE_URL. " +
    "Set SESSION_SECRET to a random 32+ char string for proper security."
  )
}

/** Validates email format (RFC-compatible, rejects whitespace and missing TLD). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254
}

function getSecretMaterial(): string {
  return process.env.SESSION_SECRET || process.env.DATABASE_URL || "mediatrend-session-secret-2024"
}

async function getHmacKey(): Promise<CryptoKey> {
  const keyData = new TextEncoder().encode(getSecretMaterial())
  return crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"])
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  )
  return `pbkdf2:${bytesToHex(salt)}:${bytesToHex(new Uint8Array(hashBuffer))}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  // Support legacy SHA-256 hashes for backwards compatibility
  if (!stored.startsWith("pbkdf2:")) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "mediatrend-salt-2024")
    const hash = await crypto.subtle.digest("SHA-256", data)
    const legacyHash = bytesToHex(new Uint8Array(hash))
    return legacyHash === stored
  }

  const parts = stored.split(":")
  if (parts.length !== 3) return false
  const [, saltHex, hashHex] = parts

  const salt = hexToBytes(saltHex)
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  )
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  )
  const inputHashHex = bytesToHex(new Uint8Array(hashBuffer))
  return inputHashHex === hashHex
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

/**
 * Creates a signed session cookie value for the given user ID.
 * Format: `{userId}:{issuedAt}:{hmac}` — HMAC-SHA256 over `{userId}:{issuedAt}`.
 */
export async function createSessionValue(userId: number): Promise<string> {
  const issuedAt = Date.now()
  const key = await getHmacKey()
  const data = new TextEncoder().encode(`${userId}:${issuedAt}`)
  const sig = await crypto.subtle.sign("HMAC", key, data)
  const sigHex = bytesToHex(new Uint8Array(sig))
  return `${userId}:${issuedAt}:${sigHex}`
}

export async function login(email: string, password: string): Promise<{ user: User } | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email}`
  const user = result[0] as User | undefined
  if (!user) return null

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return null

  const sessionValue = await createSessionValue(user.id)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return { user }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  cookieStore.delete("user_role")
  cookieStore.delete("user_id")
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  if (!session) return null

  const parts = session.value.split(":")
  // Support signed format `{userId}:{issuedAt}:{hmac}` (new) and legacy `{userId}:{token}` (old)
  if (parts.length < 2) return null

  const userId = parseInt(parts[0], 10)
  if (isNaN(userId)) return null

  // Verify HMAC signature for new-format tokens
  if (parts.length === 3) {
    const [, issuedAt, sigHex] = parts
    const issuedAtMs = parseInt(issuedAt, 10)
    if (isNaN(issuedAtMs)) return null
    // Reject expired tokens
    if (Date.now() - issuedAtMs > SESSION_MAX_AGE * 1000) return null

    try {
      const key = await getHmacKey()
      const data = new TextEncoder().encode(`${userId}:${issuedAt}`)
      const sigBytes = hexToBytes(sigHex)
      const valid = await crypto.subtle.verify("HMAC", key, sigBytes, data)
      if (!valid) return null
    } catch {
      return null
    }
  }

  const result = await sql`SELECT * FROM users WHERE id = ${userId}`
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
