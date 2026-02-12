import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const tickets = await sql`SELECT * FROM support_tickets ORDER BY created_at DESC`;
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Admin tickets error:", error);
    return NextResponse.json([]);
  }
}
