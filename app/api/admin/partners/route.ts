import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";

export async function GET() {
  return withAdminAuth(async () => {
    try {
      const partners = await sql`SELECT * FROM partners ORDER BY sort_order ASC`;
      return NextResponse.json(partners);
    } catch {
      return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const { name, logo_url, website, sort_order } = body;

      if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }

      const result = await sql`
        INSERT INTO partners (name, logo_url, website, sort_order)
        VALUES (
          ${name},
          ${logo_url || null},
          ${website || null},
          ${sort_order ?? 0}
        )
        RETURNING *
      `;

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'create', 'partner', ${result[0].id}, ${JSON.stringify({ name })})
      `;

      return NextResponse.json(result[0], { status: 201 });
    } catch {
      return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const { id, name, logo_url, website, sort_order } = body;

      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      const result = await sql`
        UPDATE partners SET
          name = COALESCE(${name ?? null}, name),
          logo_url = COALESCE(${logo_url ?? null}, logo_url),
          website = COALESCE(${website ?? null}, website),
          sort_order = COALESCE(${sort_order ?? null}, sort_order)
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: "Partner not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update', 'partner', ${id}, ${JSON.stringify({ name })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update partner" }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const { id } = body;

      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }

      const result = await sql`DELETE FROM partners WHERE id = ${id} RETURNING id`;

      if (result.length === 0) {
        return NextResponse.json({ error: "Partner not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'delete', 'partner', ${id}, '{}')
      `;

      return NextResponse.json({ success: true, id });
    } catch {
      return NextResponse.json({ error: "Failed to delete partner" }, { status: 500 });
    }
  });
}
