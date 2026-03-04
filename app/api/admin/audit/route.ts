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
      const { searchParams } = new URL(request.url);
      const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
      const offset = parseInt(searchParams.get("offset") || "0", 10);
      const adminIdParam = searchParams.get("admin_id");

      let logs;
      if (adminIdParam !== null) {
        const adminId = parseInt(adminIdParam, 10);
        if (isNaN(adminId) || adminId <= 0) {
          return NextResponse.json({ error: "Invalid admin_id" }, { status: 400 });
        }
        logs = await sql`
          SELECT * FROM audit_logs
          WHERE admin_id = ${adminId}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      } else {
        logs = await sql`
          SELECT * FROM audit_logs
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      }

      return NextResponse.json(logs);
    } catch {
      return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
    }
  });
}
