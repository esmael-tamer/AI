import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword, createSessionValue, SESSION_MAX_AGE, isValidEmail, setClientIdentityCookies } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = checkRateLimit(ip, 10, 15 * 60 * 1000) // 10 attempts per 15 min
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = users[0]

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Block unverified customer accounts
    if (!user.email_verified && user.role === "customer") {
      return NextResponse.json({ error: "email_not_verified" }, { status: 403 })
    }

    await sql`UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`

    const sessionValue = await createSessionValue(user.id)
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name_ar: user.name_ar,
        name_en: user.name_en,
        role: user.role,
        phone: user.phone,
      },
    })

    response.cookies.set("mt-session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })

    // Non-httpOnly cookies — allow middleware + client JS to read identity
    setClientIdentityCookies(response, user.id, user.role)

    return response
  } catch (error) {
    logger.error("api", "Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
