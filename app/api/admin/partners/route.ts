import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const partners = await sql`SELECT * FROM partners ORDER BY display_order ASC`;
    return NextResponse.json(partners);
  } catch (error) {
    console.error("Admin partners error:", error);
    return NextResponse.json([]);
  }
}
