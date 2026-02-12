import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const members = await sql`SELECT * FROM team_members ORDER BY display_order ASC`;
    return NextResponse.json(members);
  } catch (error) {
    console.error("Admin team error:", error);
    return NextResponse.json([]);
  }
}
