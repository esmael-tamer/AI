import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const pages = await sql`SELECT * FROM pages ORDER BY created_at DESC`;
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Admin pages GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title_ar, title_en, meta_title_ar, meta_title_en, meta_desc_ar, meta_desc_en, content_json, status } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO pages (slug, title_ar, title_en, meta_title_ar, meta_title_en, meta_desc_ar, meta_desc_en, content_json, status)
      VALUES (
        ${slug},
        ${title_ar || null},
        ${title_en || null},
        ${meta_title_ar || null},
        ${meta_title_en || null},
        ${meta_desc_ar || null},
        ${meta_desc_en || null},
        ${content_json ? JSON.stringify(content_json) : "{}"},
        ${status || "draft"}
      )
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('create', 'page', ${result[0].id}, ${JSON.stringify({ slug, title_en })})
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Admin pages POST error:", error);
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, slug, title_ar, title_en, meta_title_ar, meta_title_en, meta_desc_ar, meta_desc_en, content_json, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE pages SET
        slug = COALESCE(${slug ?? null}, slug),
        title_ar = COALESCE(${title_ar ?? null}, title_ar),
        title_en = COALESCE(${title_en ?? null}, title_en),
        meta_title_ar = COALESCE(${meta_title_ar ?? null}, meta_title_ar),
        meta_title_en = COALESCE(${meta_title_en ?? null}, meta_title_en),
        meta_desc_ar = COALESCE(${meta_desc_ar ?? null}, meta_desc_ar),
        meta_desc_en = COALESCE(${meta_desc_en ?? null}, meta_desc_en),
        content_json = COALESCE(${content_json ? JSON.stringify(content_json) : null}, content_json),
        status = COALESCE(${status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 400 });
    }

    await sql`
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('update', 'page', ${id}, ${JSON.stringify({ slug, title_en, status })})
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Admin pages PATCH error:", error);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`DELETE FROM pages WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 400 });
    }

    await sql`
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('delete', 'page', ${id}, '{}')
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Admin pages DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
  }
}
