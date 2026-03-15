import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, createSessionValue, SESSION_MAX_AGE, isValidEmail, setClientIdentityCookies } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = checkRateLimit(ip, 5, 60 * 60 * 1000) // 5 signups per hour
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const { email, password, name_ar, name_en, phone, session_id } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    if (password.length > 128) {
      return NextResponse.json({ error: "Password must be at most 128 characters" }, { status: 400 })
    }

    if (name_ar && name_ar.length > 100) {
      return NextResponse.json({ error: "Name must be at most 100 characters" }, { status: 400 })
    }

    if (phone && phone.length > 20) {
      return NextResponse.json({ error: "Phone number must be at most 20 characters" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const newUser = await sql`
      INSERT INTO users (email, password_hash, name_ar, name_en, phone, role)
      VALUES (${email}, ${passwordHash}, ${name_ar || null}, ${name_en || null}, ${phone || null}, 'customer')
      RETURNING id, email, name_ar, name_en, role, phone
    `

    const user = newUser[0]

    if (session_id) {
      await sql`
        UPDATE stores SET owner_id = ${user.id}
        WHERE session_id = ${session_id} AND owner_id IS NULL
      `
    }

    const sessionValue = await createSessionValue(user.id)
    const response = NextResponse.json({ user }, { status: 201 })

    response.cookies.set("mt-session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })

    setClientIdentityCookies(response, user.id, "customer")

    return response
  } catch (error) {
    logger.error("api", "Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
