import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { checkAdminAuth } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
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
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await checkAdminAuth();
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: "ID and role are required" }, { status: 400 });
    }

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
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('update_role', 'user', ${id}, ${JSON.stringify({ role })})
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Admin users PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
