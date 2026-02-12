import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const cases = await sql`SELECT * FROM case_studies ORDER BY created_at DESC`;
    return NextResponse.json(cases);
  } catch (error) {
    console.error("Admin cases error:", error);
    return NextResponse.json([]);
  }
}
