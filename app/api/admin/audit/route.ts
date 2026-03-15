import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const logs = await sql`
      SELECT * FROM audit_logs
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Admin audit GET error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
