import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { adminLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!adminLimiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  return withAdminAuth(async () => {
    try {
      const [stores, users, leads, tickets, blog] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM stores`,
        sql`SELECT COUNT(*) as count FROM users`,
        sql`SELECT COUNT(*) as count FROM leads`,
        sql`SELECT COUNT(*) as count FROM support_tickets WHERE status = 'open'`,
        sql`SELECT COUNT(*) as count FROM blog_posts`,
      ]);

      return NextResponse.json({
        stores: Number(stores[0]?.count || 0),
        users: Number(users[0]?.count || 0),
        leads: Number(leads[0]?.count || 0),
        tickets: Number(tickets[0]?.count || 0),
        blog: Number(blog[0]?.count || 0),
        revenue: "SAR 0",
      });
    } catch {
      return NextResponse.json({
        stores: 0,
        users: 0,
        leads: 0,
        tickets: 0,
        blog: 0,
        revenue: "SAR 0",
      });
    }
  });
}
