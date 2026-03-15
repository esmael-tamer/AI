import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

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

export async function POST(request: Request) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message, priority } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    const validPriorities = ["low", "medium", "high"];
    const ticketPriority = validPriorities.includes(priority) ? priority : "medium";

    const [ticket] = await sql`
      INSERT INTO support_tickets (user_id, subject, message, priority, status)
      VALUES (${user.id}, ${subject}, ${message}, ${ticketPriority}, 'open')
      RETURNING *
    `;

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Portal tickets POST error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
