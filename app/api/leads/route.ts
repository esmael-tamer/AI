import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, service } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    await sql`
      INSERT INTO leads (name, email, phone, notes, selected_activations)
      VALUES (${name}, ${email}, ${phone || null}, ${message}, ${JSON.stringify(service ? [service] : [])})
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to create lead:", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }
}
