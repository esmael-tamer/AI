import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAuth } from "@/lib/auth";

export async function GET() {
  return withAuth(async (user) => {
    try {
      const stores = await sql`
        SELECT id, name_ar, name_en, slug, status, plan, payments_status, shipping_status, warehousing_status, created_at
        FROM stores
        WHERE owner_id = ${user.id}
        ORDER BY created_at DESC
      `;

      return NextResponse.json(stores);
    } catch {
      return NextResponse.json([], { status: 200 });
    }
  });
}
