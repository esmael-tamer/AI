import { logger } from "@/lib/logger"
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await sql`
      SELECT id, name_ar, name_en, slug, status, plan, payments_status, shipping_status, warehousing_status, created_at
      FROM stores
      WHERE owner_id = ${user.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(stores);
  } catch (error) {
    logger.error("api", "Portal stores error:", error);
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}
