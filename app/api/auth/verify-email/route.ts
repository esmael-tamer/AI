import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createSessionValue, SESSION_MAX_AGE, setClientIdentityCookies } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const sid = searchParams.get("sid") || ""

    if (!token) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url))
    }

    const users = await sql`
      SELECT * FROM users WHERE email_verification_token = ${token}
    `

    if (users.length === 0) {
      return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url))
    }

    const user = users[0]

    // Check expiry
    const expires = new Date(user.email_verification_expires)
    if (expires < new Date()) {
      return NextResponse.redirect(new URL("/verify-email?error=expired", request.url))
    }

    // Already verified — send to login
    if (user.email_verified) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Mark as verified, clear token
    await sql`
      UPDATE users
      SET email_verified = true,
          email_verification_token = NULL,
          email_verification_expires = NULL,
          updated_at = NOW()
      WHERE id = ${user.id}
    `

    // Link guest store if sid provided — use the CORRECT column name from the schema
    if (sid) {
      await sql`
        UPDATE stores
        SET owner_id = ${user.id}
        WHERE session_id = ${sid} AND owner_id IS NULL
      `
    }

    // Create session — set BOTH cookies on the redirect response before returning
    const sessionValue = await createSessionValue(user.id)
    const redirectResponse = NextResponse.redirect(new URL("/portal?welcome=1", request.url))

    redirectResponse.cookies.set("mt-session", sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    })

    setClientIdentityCookies(redirectResponse, user.id, "customer")

    return redirectResponse
  } catch (error) {
    logger.error("api", "Email verification error:", error)
    return NextResponse.redirect(new URL("/verify-email?error=invalid", request.url))
  }
}
