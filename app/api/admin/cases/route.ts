import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { createCaseSchema, updateCaseSchema, deleteCaseSchema, formatZodError } from "@/lib/validations/admin";

export async function GET() {
  return withAdminAuth(async () => {
    try {
      const cases = await sql`SELECT * FROM case_studies ORDER BY sort_order ASC`;
      return NextResponse.json(cases);
    } catch {
      return NextResponse.json({ error: "Failed to fetch case studies" }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = createCaseSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { title_ar, title_en, desc_ar, desc_en, cover_image, gallery, client_name, category, sort_order } = parsed.data;

      const result = await sql`
        INSERT INTO case_studies (title_ar, title_en, desc_ar, desc_en, cover_image, gallery, client_name, category, sort_order)
        VALUES (
          ${title_ar || null},
          ${title_en || null},
          ${desc_ar || null},
          ${desc_en || null},
          ${cover_image || null},
          ${gallery ? JSON.stringify(gallery) : "[]"},
          ${client_name || null},
          ${category || null},
          ${sort_order}
        )
        RETURNING *
      `;

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'create', 'case_study', ${result[0].id}, ${JSON.stringify({ title_en, title_ar, client_name })})
      `;

      return NextResponse.json(result[0], { status: 201 });
    } catch {
      return NextResponse.json({ error: "Failed to create case study" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = updateCaseSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id, title_ar, title_en, desc_ar, desc_en, cover_image, gallery, client_name, category, sort_order } = parsed.data;

      const result = await sql`
        UPDATE case_studies SET
          title_ar = COALESCE(${title_ar ?? null}, title_ar),
          title_en = COALESCE(${title_en ?? null}, title_en),
          desc_ar = COALESCE(${desc_ar ?? null}, desc_ar),
          desc_en = COALESCE(${desc_en ?? null}, desc_en),
          cover_image = COALESCE(${cover_image ?? null}, cover_image),
          gallery = COALESCE(${gallery ? JSON.stringify(gallery) : null}, gallery),
          client_name = COALESCE(${client_name ?? null}, client_name),
          category = COALESCE(${category ?? null}, category),
          sort_order = COALESCE(${sort_order ?? null}, sort_order)
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: "Case study not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update', 'case_study', ${id}, ${JSON.stringify({ title_en, title_ar })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update case study" }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = deleteCaseSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id } = parsed.data;

      const result = await sql`DELETE FROM case_studies WHERE id = ${id} RETURNING id`;

      if (result.length === 0) {
        return NextResponse.json({ error: "Case study not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'delete', 'case_study', ${id}, '{}')
      `;

      return NextResponse.json({ success: true, id });
    } catch {
      return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 });
    }
  });
}
