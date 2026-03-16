import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { isValidEmail } from "@/lib/auth"
import { checkAdminAuth } from "@/lib/admin-auth"

const VALID_TYPES = ["store_activation", "ads_launch", "account_mgmt"] as const

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = checkRateLimit(`leads:${ip}`, 10, 60 * 60 * 1000) // 10 leads per hour per IP
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    )
  }

  try {
    const body = await request.json()
    const { name, phone, email, type, payload_json, notes } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    if (name.length > 100) {
      return NextResponse.json({ error: "Name must be at most 100 characters" }, { status: 400 })
    }

    if (notes && notes.length > 2000) {
      return NextResponse.json({ error: "Notes must be at most 2000 characters" }, { status: 400 })
    }

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid lead type" }, { status: 400 })
    }

    const leadType = type || "store_activation"
    const payload = payload_json ? JSON.stringify(payload_json) : "{}"

    const result = await sql`
      INSERT INTO leads (name, email, phone, type, payload_json, notes, status)
      VALUES (${name}, ${email}, ${phone || null}, ${leadType}, ${payload}::jsonb, ${notes || null}, 'new')
      RETURNING id, name, email, type, status, created_at
    `

    return NextResponse.json({ success: true, lead: result[0] })
  } catch (error) {
    logger.error("api", "Failed to create lead:", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}

export async function GET() {
  const authError = await checkAdminAuth()
  if (authError) return authError

  try {
    const leads = await sql`
      SELECT id, name, email, phone, type, status, notes, created_at
      FROM leads
      ORDER BY created_at DESC
    `
    return NextResponse.json({ leads })
  } catch (error) {
    logger.error("api", "Failed to fetch leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}
