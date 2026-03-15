import { logger } from "@/lib/logger"
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [profile] = await sql`
      SELECT id, email, name_ar, name_en, phone, role, lang_pref, created_at
      FROM users WHERE id = ${user.id}
    `;

    if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(profile);
  } catch (error) {
    logger.error("api", "Portal profile GET error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name_ar, name_en, phone } = await request.json();

    const result = await sql`
      UPDATE users SET
        name_ar = COALESCE(${name_ar ?? null}, name_ar),
        name_en = COALESCE(${name_en ?? null}, name_en),
        phone = COALESCE(${phone ?? null}, phone),
        updated_at = NOW()
      WHERE id = ${user.id}
      RETURNING id, email, name_ar, name_en, phone, role, lang_pref
    `;

    if (result.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(result[0]);
  } catch (error) {
    logger.error("api", "Portal profile PATCH error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
