import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { createBlogPostSchema, updateBlogPostSchema, deleteBlogPostSchema, formatZodError } from "@/lib/validations/admin";

export async function GET() {
  return withAdminAuth(async () => {
    try {
      const posts = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
      return NextResponse.json(posts);
    } catch {
      return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = createBlogPostSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, cover_image, author_id, status } = parsed.data;

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
          ${status},
          ${status === "published" ? new Date().toISOString() : null}
        )
        RETURNING *
      `;

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'create', 'blog_post', ${result[0].id}, ${JSON.stringify({ slug, title_en })})
      `;

      return NextResponse.json(result[0], { status: 201 });
    } catch {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = updateBlogPostSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id, slug, title_ar, title_en, excerpt_ar, excerpt_en, content_ar, content_en, cover_image, author_id, status } = parsed.data;

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

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update', 'blog_post', ${id}, ${JSON.stringify({ slug, title_en, status })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = deleteBlogPostSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id } = parsed.data;

      const result = await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING id`;

      if (result.length === 0) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'delete', 'blog_post', ${id}, '{}')
      `;

      return NextResponse.json({ success: true, id });
    } catch {
      return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
    }
  });
}
