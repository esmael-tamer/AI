import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const users = await sql`SELECT id, email, name_ar, name_en, role, phone, created_at FROM users ORDER BY created_at DESC`;
    return NextResponse.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json([]);
  }
}
