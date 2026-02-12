import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { store_id, services, business_name, business_type, contact_phone, notes } = body;

    if (!store_id || !services || !Array.isArray(services) || services.length === 0) {
      return NextResponse.json({ error: "store_id and at least one service are required" }, { status: 400 });
    }

    const validServices = ["payments", "shipping", "warehousing"];
    const filteredServices = services.filter((s: string) => validServices.includes(s));

    if (filteredServices.length === 0) {
      return NextResponse.json({ error: "At least one valid service is required" }, { status: 400 });
    }

    if (!business_name || !contact_phone) {
      return NextResponse.json({ error: "business_name and contact_phone are required" }, { status: 400 });
    }

    const store = await sql`
      SELECT id, owner_id FROM stores WHERE id = ${store_id} AND owner_id = ${userId}
    `;

    if (store.length === 0) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const [lead] = await sql`
      INSERT INTO leads (user_id, store_id, name, phone, type, selected_activations, notes, status, payload_json)
      VALUES (
        ${userId},
        ${store_id},
        ${business_name},
        ${contact_phone},
        'store_activation',
        ${sql.array(filteredServices)},
        ${notes || null},
        'new',
        ${JSON.stringify({ business_type: business_type || null })}
      )
      RETURNING *
    `;

    const tickets = [];
    for (const service of filteredServices) {
      const [ticket] = await sql`
        INSERT INTO tickets (store_id, user_id, lead_id, type, status, notes)
        VALUES (
          ${store_id},
          ${userId},
          ${lead.id},
          ${service},
          'pending',
          ${`Activation request for ${service} - ${business_name}`}
        )
        RETURNING *
      `;
      tickets.push(ticket);
    }

    const updateFields: Record<string, string> = {};
    if (filteredServices.includes("payments")) updateFields.payments_status = "pending";
    if (filteredServices.includes("shipping")) updateFields.shipping_status = "pending";
    if (filteredServices.includes("warehousing")) updateFields.warehousing_status = "pending";

    await sql`
      UPDATE stores
      SET status = 'pending',
          payments_status = CASE WHEN 'payments' = ANY(${sql.array(filteredServices)}) THEN 'pending' ELSE payments_status END,
          shipping_status = CASE WHEN 'shipping' = ANY(${sql.array(filteredServices)}) THEN 'pending' ELSE shipping_status END,
          warehousing_status = CASE WHEN 'warehousing' = ANY(${sql.array(filteredServices)}) THEN 'pending' ELSE warehousing_status END,
          updated_at = NOW()
      WHERE id = ${store_id}
    `;

    return NextResponse.json({ lead, tickets });
  } catch (error) {
    console.error("Activation error:", error);
    return NextResponse.json({ error: "Failed to process activation" }, { status: 500 });
  }
}
