import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
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

    await sql`UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const tokenArray = new Uint8Array(32)
    crypto.getRandomValues(tokenArray)
    const token = Array.from(tokenArray, (b) => b.toString(16).padStart(2, "0")).join("")

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name_ar: user.name_ar,
        name_en: user.name_en,
        role: user.role,
        phone: user.phone,
      },
      token,
    })

    response.cookies.set("mt-session", `${user.id}:${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
