import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
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
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({
      stores: 0,
      users: 0,
      leads: 0,
      tickets: 0,
      blog: 0,
      revenue: "SAR 0",
    });
  }
}
