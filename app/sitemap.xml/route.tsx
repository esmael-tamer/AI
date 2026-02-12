const URLS = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/builder", priority: "0.9", changefreq: "weekly" },
  { url: "/work", priority: "0.8", changefreq: "weekly" },
  { url: "/team", priority: "0.7", changefreq: "monthly" },
  { url: "/blog", priority: "0.8", changefreq: "weekly" },
  { url: "/contact", priority: "0.7", changefreq: "monthly" },
  { url: "/services", priority: "0.8", changefreq: "monthly" },
  { url: "/login", priority: "0.5", changefreq: "monthly" },
  { url: "/signup", priority: "0.5", changefreq: "monthly" },
];

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const lastmod = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${URLS.map(
  ({ url, priority, changefreq }) => `  <url>
    <loc>${origin}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
