import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Admin leads error:", error);
    return NextResponse.json([]);
  }
}
