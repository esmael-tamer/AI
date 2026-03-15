import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
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

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const newUser = await sql`
      INSERT INTO users (email, password_hash, name_ar, name_en, phone, role)
      VALUES (${email}, ${passwordHash}, ${name_ar || ""}, ${name_en || ""}, ${phone || ""}, 'customer')
      RETURNING id, email, name_ar, name_en, role, phone
    `

    const user = newUser[0]

    if (session_id) {
      await sql`
        UPDATE stores SET owner_id = ${user.id}
        WHERE session_id = ${session_id} AND owner_id IS NULL
      `
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const tokenArray = new Uint8Array(32)
    crypto.getRandomValues(tokenArray)
    const token = Array.from(tokenArray, (b) => b.toString(16).padStart(2, "0")).join("")

    const response = NextResponse.json({ user, token }, { status: 201 })

    response.cookies.set("mt-session", `${user.id}:${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
