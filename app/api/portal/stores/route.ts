import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const stores = await sql`
      SELECT id, name_ar, name_en, slug, status, plan, payments_status, shipping_status, warehousing_status, created_at
      FROM stores
      WHERE owner_id = ${user.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Portal stores error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
