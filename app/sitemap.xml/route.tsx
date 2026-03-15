import { sql } from "@/lib/db"

const STATIC_URLS = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/builder", priority: "0.9", changefreq: "weekly" },
  { url: "/work", priority: "0.8", changefreq: "weekly" },
  { url: "/team", priority: "0.7", changefreq: "monthly" },
  { url: "/blog", priority: "0.8", changefreq: "weekly" },
  { url: "/contact", priority: "0.7", changefreq: "monthly" },
  { url: "/services", priority: "0.8", changefreq: "monthly" },
]

export async function GET(request: Request) {
  const { origin } = new URL(request.url)

  let blogPosts: { slug: string; updated_at: string }[] = []
  try {
    blogPosts = await sql`
      SELECT slug, updated_at FROM blog_posts
      WHERE status = 'published'
      ORDER BY updated_at DESC
    ` as { slug: string; updated_at: string }[]
  } catch {
    // If DB is unavailable, serve static sitemap only
  }

  const staticEntries = STATIC_URLS.map(({ url, priority, changefreq }) => `  <url>
    <loc>${origin}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)

  const blogEntries = blogPosts.map(({ slug, updated_at }) => `  <url>
    <loc>${origin}/blog/${slug}</loc>
    <lastmod>${new Date(updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...blogEntries].join("\n")}
</urlset>`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
