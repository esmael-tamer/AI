import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const logs = await sql`SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`;
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Admin audit error:", error);
    return NextResponse.json([]);
  }
}
