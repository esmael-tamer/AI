import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { withAdminAuth } from "@/lib/auth";
import { updateUserRoleSchema, formatZodError } from "@/lib/validations/admin";

export async function GET(request: NextRequest) {
  return withAdminAuth(async () => {
    try {
      const { searchParams } = new URL(request.url);
      const role = searchParams.get("role");

      let users;
      if (role) {
        users = await sql`
          SELECT id, name_ar, name_en, email, phone, role, lang_pref, created_at, updated_at
          FROM users
          WHERE role = ${role}
          ORDER BY created_at DESC
        `;
      } else {
        users = await sql`
          SELECT id, name_ar, name_en, email, phone, role, lang_pref, created_at, updated_at
          FROM users
          ORDER BY created_at DESC
        `;
      }
      return NextResponse.json(users);
    } catch {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAdminAuth(async (admin) => {
    try {
      const body = await request.json();
      const parsed = updateUserRoleSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
      }
      const { id, role } = parsed.data;

      const result = await sql`
        UPDATE users SET
          role = ${role},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING id, name_ar, name_en, email, phone, role, lang_pref, created_at, updated_at
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 400 });
      }

      await sql`
        INSERT INTO audit_logs (admin_id, action, entity_type, entity_id, details_json)
        VALUES (${admin.id}, 'update_role', 'user', ${id}, ${JSON.stringify({ role })})
      `;

      return NextResponse.json(result[0]);
    } catch {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
  });
}
