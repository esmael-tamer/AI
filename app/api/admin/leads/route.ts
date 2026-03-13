import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { createLeadSchema, updateLeadSchema, formatZodError } from "@/lib/validations/admin";
import { adminLimiter } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!adminLimiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const type = searchParams.get("type");

      let leads;
      if (status && type) {
        leads = await sql`SELECT * FROM leads WHERE status = ${status} AND type = ${type} ORDER BY created_at DESC`;
      } else if (status) {
        leads = await sql`SELECT * FROM leads WHERE status = ${status} ORDER BY created_at DESC`;
      } else if (type) {
        leads = await sql`SELECT * FROM leads WHERE type = ${type} ORDER BY created_at DESC`;
      } else {
        leads = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      }
      return NextResponse.json(leads);
    } catch {
      return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!adminLimiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = createLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { name, phone, email, country, type, selected_activations, payload_json, notes, status } = parsed.data;

      const result = await sql`
        INSERT INTO leads (name, phone, email, country, type, selected_activations, payload_json, notes, status)
        VALUES (
          ${name},
          ${phone || null},
          ${email || null},
          ${country || null},
          ${type},
          ${selected_activations ? JSON.stringify(selected_activations) : "[]"},
          ${payload_json ? JSON.stringify(payload_json) : "{}"},
          ${notes || null},
          ${status}
        )
        RETURNING *
      `;

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'create', 'lead', ${result[0].id}, ${JSON.stringify({ name, email, type })})
      `;

      return NextResponse.json(result[0], { status: 201 });
    } catch {
      return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!adminLimiter.check(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = updateLeadSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id, status, assigned_to, notes } = parsed.data;

      const result = await sql`
        UPDATE leads SET
          status = COALESCE(${status ?? null}, status),
          assigned_to = COALESCE(${assigned_to ?? null}, assigned_to),
          notes = COALESCE(${notes ?? null}, notes)
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: "Lead not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update', 'lead', ${id}, ${JSON.stringify({ status, assigned_to, notes })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }
  });
}
