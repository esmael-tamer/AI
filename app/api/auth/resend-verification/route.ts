import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { isValidEmail } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const body = await request.json()
    const { email } = body

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: true }) // Silent — no enumeration
    }

    // Rate limit per IP + email combination
    const rlKey = `resend:${ip}:${email}`
    const rl = checkRateLimit(rlKey, 3, 10 * 60 * 1000) // 3 per 10 minutes
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "انتظر قليلاً قبل إعادة الإرسال" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const users = await sql`SELECT * FROM users WHERE email = ${email}`
    if (users.length === 0) {
      return NextResponse.json({ ok: true }) // Silent — no enumeration
    }

    const user = users[0]

    if (user.email_verified) {
      return NextResponse.json({ ok: true }) // Already verified — silent
    }

    // Regenerate token + expiry
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const newToken = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("")

    await sql`
      UPDATE users
      SET email_verification_token = ${newToken},
          email_verification_expires = NOW() + INTERVAL '24 hours',
          updated_at = NOW()
      WHERE id = ${user.id}
    `

    // Read session_id from cookie
    const cookieHeader = request.headers.get("cookie") || ""
    const sidMatch = cookieHeader.match(/mt_session_id=([^;]+)/)
    const sid = sidMatch ? sidMatch[1] : null

    const acceptLang = request.headers.get("accept-language") || ""
    const lang: "ar" | "en" = acceptLang.includes("ar") ? "ar" : "en"

    try {
      await sendVerificationEmail(email, newToken, sid, lang)
    } catch (emailErr) {
      logger.error("api", "Failed to resend verification email", emailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error("api", "Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
