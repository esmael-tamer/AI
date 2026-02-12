import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const stores = await sql`
      SELECT id, name_ar, name_en, slug, status, plan, created_at
      FROM stores
      WHERE owner_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Portal stores error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
