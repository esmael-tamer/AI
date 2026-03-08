import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { createTeamMemberSchema, updateTeamMemberSchema, deleteTeamMemberSchema, formatZodError } from "@/lib/validations/admin";

export async function GET() {
  return withAdminAuth(async () => {
    try {
      const members = await sql`SELECT * FROM team_members ORDER BY sort_order ASC`;
      return NextResponse.json(members);
    } catch {
      return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
    }
  });
}

export async function POST(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = createTeamMemberSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { name_ar, name_en, role_ar, role_en, photo_url, department, sort_order } = parsed.data;

      const result = await sql`
        INSERT INTO team_members (name_ar, name_en, role_ar, role_en, photo_url, department, sort_order)
        VALUES (
          ${name_ar || null},
          ${name_en || null},
          ${role_ar || null},
          ${role_en || null},
          ${photo_url || null},
          ${department || null},
          ${sort_order}
        )
        RETURNING *
      `;

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'create', 'team_member', ${result[0].id}, ${JSON.stringify({ name_en, name_ar })})
      `;

      return NextResponse.json(result[0], { status: 201 });
    } catch {
      return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = updateTeamMemberSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id, name_ar, name_en, role_ar, role_en, photo_url, department, sort_order } = parsed.data;

      const result = await sql`
        UPDATE team_members SET
          name_ar = COALESCE(${name_ar ?? null}, name_ar),
          name_en = COALESCE(${name_en ?? null}, name_en),
          role_ar = COALESCE(${role_ar ?? null}, role_ar),
          role_en = COALESCE(${role_en ?? null}, role_en),
          photo_url = COALESCE(${photo_url ?? null}, photo_url),
          department = COALESCE(${department ?? null}, department),
          sort_order = COALESCE(${sort_order ?? null}, sort_order)
        WHERE id = ${id}
        RETURNING *
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: "Team member not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update', 'team_member', ${id}, ${JSON.stringify({ name_en, name_ar })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = deleteTeamMemberSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id } = parsed.data;

      const result = await sql`DELETE FROM team_members WHERE id = ${id} RETURNING id`;

      if (result.length === 0) {
        return NextResponse.json({ error: "Team member not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'delete', 'team_member', ${id}, '{}')
      `;

      return NextResponse.json({ success: true, id });
    } catch {
      return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
    }
  });
}
