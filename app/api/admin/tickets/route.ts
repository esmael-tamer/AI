import { logger } from "@/lib/logger"
import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkAdminAuth, getAdminId } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let tickets;
    if (status) {
      tickets = await sql`
        SELECT t.*, s.name_en AS store_name_en, s.name_ar AS store_name_ar
        FROM tickets t
        LEFT JOIN stores s ON t.store_id = s.id
        WHERE t.status = ${status}
        ORDER BY t.created_at DESC
      `;
    } else {
      tickets = await sql`
        SELECT t.*, s.name_en AS store_name_en, s.name_ar AS store_name_ar
        FROM tickets t
        LEFT JOIN stores s ON t.store_id = s.id
        ORDER BY t.created_at DESC
      `;
    }
    return NextResponse.json(tickets);
  } catch (error) {
    logger.error("api", "Admin tickets GET error:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { store_id, user_id, lead_id, type, notes } = body;

    if (!type) {
      return NextResponse.json({ error: "Type is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO tickets (store_id, user_id, lead_id, type, notes)
      VALUES (
        ${store_id || null},
        ${user_id || null},
        ${lead_id || null},
        ${type},
        ${notes || null}
      )
      RETURNING *
    `;

    const adminId = await getAdminId()
    await sql`
      INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
      VALUES (${adminId}, 'create', 'ticket', ${result[0].id}, ${JSON.stringify({ store_id, type })})
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    logger.error("api", "Admin tickets POST error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE tickets SET
        status = COALESCE(${status ?? null}, status),
        notes = COALESCE(${notes ?? null}, notes),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 400 });
    }

    const adminId = await getAdminId()
    await sql`
      INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
      VALUES (${adminId}, 'update', 'ticket', ${id}, ${JSON.stringify({ status, notes })})
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    logger.error("api", "Admin tickets PATCH error:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const result = await sql`DELETE FROM tickets WHERE id = ${id} RETURNING id`;
    if (result.length === 0) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    const adminId = await getAdminId()
    await sql`
      INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
      VALUES (${adminId}, 'delete', 'ticket', ${id}, '{}')
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    logger.error("api", "Admin tickets DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
