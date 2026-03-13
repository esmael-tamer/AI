import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  let user;
  try {
    user = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const supportTickets = await sql`
      SELECT id, subject, status, priority, created_at, 'support' as ticket_type
      FROM support_tickets
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    const activationTickets = await sql`
      SELECT t.id, t.type as subject, t.status, 'medium' as priority, t.created_at, 'activation' as ticket_type,
             s.name_en as store_name_en, s.name_ar as store_name_ar
      FROM tickets t
      LEFT JOIN stores s ON t.store_id = s.id
      WHERE t.user_id = ${user.id}
      ORDER BY t.created_at DESC
    `;

    const allTickets = [...supportTickets, ...activationTickets].sort(
      (a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
    );

    return NextResponse.json(allTickets);
  } catch (error) {
    console.error("Portal tickets error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
