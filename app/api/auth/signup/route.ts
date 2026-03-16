import { logger } from "@/lib/logger"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, isValidEmail, isValidPhone } from "@/lib/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const rl = checkRateLimit(ip, 5, 60 * 60 * 1000) // 5 signups per hour per IP
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      )
    }

    const body = await request.json()
    const { email, password, name_ar, phone } = body

    // name_ar required
    if (!name_ar || !name_ar.trim()) {
      return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 })
    }
    if (name_ar.length > 100) {
      return NextResponse.json({ error: "Name must be at most 100 characters" }, { status: 400 })
    }

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

    // phone required
    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: "رقم الهاتف مطلوب" }, { status: 400 })
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Phone number must be in E.164 format (e.g. +96512345678)" },
        { status: 400 }
      )
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    // Generate 64-char hex verification token (32 random bytes)
    const tokenBytes = new Uint8Array(32)
    crypto.getRandomValues(tokenBytes)
    const verificationToken = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("")

    const newUser = await sql`
      INSERT INTO users (
        email, password_hash, name_ar, name_en, phone, role,
        email_verified, email_verification_token, email_verification_expires
      )
      VALUES (
        ${email}, ${passwordHash}, ${name_ar.trim()}, ${null}, ${phone.trim()}, 'customer',
        false, ${verificationToken}, NOW() + INTERVAL '24 hours'
      )
      RETURNING id, email, name_ar, role
    `

    const user = newUser[0]

    // Read session_id from cookie (set by builder) — passed in email link as sid param
    const cookieHeader = request.headers.get("cookie") || ""
    const sidMatch = cookieHeader.match(/mt_session_id=([^;]+)/)
    const sid = sidMatch ? sidMatch[1] : null

    // Detect language preference from Accept-Language header
    const acceptLang = request.headers.get("accept-language") || ""
    const lang: "ar" | "en" = acceptLang.includes("ar") ? "ar" : "en"

    try {
      await sendVerificationEmail(email, verificationToken, sid, lang)
    } catch (emailErr) {
      logger.error("api", "Failed to send verification email", emailErr)
      // Still return pending — user can resend
    }

    // Do NOT create session — pending email verification
    return NextResponse.json({ pending: true }, { status: 200 })
  } catch (error) {
    logger.error("api", "Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
