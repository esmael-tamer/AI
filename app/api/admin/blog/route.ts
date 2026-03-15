import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkAdminAuth, getAdminId } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const posts = status
      ? await sql`SELECT * FROM blog_posts WHERE status = ${status} ORDER BY created_at DESC`
      : await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Admin blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, cover_image, author_id, status } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO blog_posts (slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, cover_image, author_id, status, published_at)
      VALUES (
        ${slug},
        ${title_ar || null},
        ${title_en || null},
        ${excerpt_ar || null},
        ${excerpt_en || null},
        ${content_ar || null},
        ${content_en || null},
        ${cover_image || null},
        ${author_id || null},
        ${status || "draft"},
        ${status === "published" ? new Date().toISOString() : null}
      )
      RETURNING *
    `;

    const adminId = await getAdminId()
    await sql`
      INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
      VALUES (${adminId}, 'create', 'blog_post', ${result[0].id}, ${JSON.stringify({ slug, title_en })})
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Admin blog POST error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, cover_image, author_id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`
      UPDATE blog_posts SET
        slug = COALESCE(${slug ?? null}, slug),
        title_ar = COALESCE(${title_ar ?? null}, title_ar),
        title_en = COALESCE(${title_en ?? null}, title_en),
        excerpt_ar = COALESCE(${excerpt_ar ?? null}, excerpt_ar),
        excerpt_en = COALESCE(${excerpt_en ?? null}, excerpt_en),
        content_ar = COALESCE(${content_ar ?? null}, content_ar),
        content_en = COALESCE(${content_en ?? null}, content_en),
        cover_image = COALESCE(${cover_image ?? null}, cover_image),
        author_id = COALESCE(${author_id ?? null}, author_id),
        status = COALESCE(${status ?? null}, status),
        published_at = CASE WHEN ${status ?? null} = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 400 });
    }

    const adminId = await getAdminId()
    await sql`
      INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
      VALUES (${adminId}, 'update', 'blog_post', ${id}, ${JSON.stringify({ slug, title_en, status })})
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Admin blog PATCH error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 400 });
    }

    const adminId = await getAdminId()
    await sql`
      INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
      VALUES (${adminId}, 'delete', 'blog_post', ${id}, '{}')
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Admin blog DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
