import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const pages = await sql`SELECT * FROM pages ORDER BY created_at DESC`;
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Admin pages error:", error);
    return NextResponse.json([]);
  }
}
