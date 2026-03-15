import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { checkRateLimit } from "@/lib/rate-limit"

const VALID_TYPES = ["store_activation", "ads_launch", "account_mgmt"] as const

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
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
