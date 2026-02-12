import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const stores = await sql`SELECT * FROM stores ORDER BY created_at DESC`;
    return NextResponse.json(stores);
  } catch (error) {
    console.error("Admin stores error:", error);
    return NextResponse.json([]);
  }
}
