import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let stores;
    if (status) {
      stores = await sql`
        SELECT s.*, u.name_en AS owner_name_en, u.name_ar AS owner_name_ar, u.email AS owner_email
        FROM stores s
        LEFT JOIN users u ON s.owner_id = u.id
        WHERE s.status = ${status}
        ORDER BY s.created_at DESC
      `;
    } else {
      stores = await sql`
        SELECT s.*, u.name_en AS owner_name_en, u.name_ar AS owner_name_ar, u.email AS owner_email
        FROM stores s
        LEFT JOIN users u ON s.owner_id = u.id
        ORDER BY s.created_at DESC
      `;
    }
    return NextResponse.json(stores);
  } catch (error) {
    console.error("Admin stores GET error:", error);
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, plan, commission_rate_percent, payments_status, shipping_status, warehousing_status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE stores SET
        status = COALESCE(${status ?? null}, status),
        plan = COALESCE(${plan ?? null}, plan),
        commission_rate_percent = COALESCE(${commission_rate_percent ?? null}, commission_rate_percent),
        payments_status = COALESCE(${payments_status ?? null}, payments_status),
        shipping_status = COALESCE(${shipping_status ?? null}, shipping_status),
        warehousing_status = COALESCE(${warehousing_status ?? null}, warehousing_status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Store not found" }, { status: 400 });
    }

    await sql`
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('update', 'store', ${id}, ${JSON.stringify({ status, plan, payments_status, shipping_status, warehousing_status })})
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Admin stores PATCH error:", error);
    return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
  }
}
