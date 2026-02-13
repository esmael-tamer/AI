import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { updateStoreSchema, formatZodError } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  return withAdminAuth(async () => {
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
    } catch {
      return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = updateStoreSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id, status, plan, commission_rate_percent, payments_status, shipping_status, warehousing_status } = parsed.data;

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
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update', 'store', ${id}, ${JSON.stringify({ status, plan, payments_status, shipping_status, warehousing_status })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update store" }, { status: 500 });
    }
  });
}
