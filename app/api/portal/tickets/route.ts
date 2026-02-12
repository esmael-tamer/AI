import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const tickets = await sql`
      SELECT id, subject, status, priority, created_at
      FROM support_tickets
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Portal tickets error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
