import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const members = await sql`SELECT * FROM team_members ORDER BY sort_order ASC`;
    return NextResponse.json(members);
  } catch (error) {
    console.error("Admin team GET error:", error);
    return NextResponse.json({ error: "Failed to fetch team members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name_ar, name_en, role_ar, role_en, photo_url, department, sort_order } = body;

    if (!name_en && !name_ar) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO team_members (name_ar, name_en, role_ar, role_en, photo_url, department, sort_order)
      VALUES (
        ${name_ar || null},
        ${name_en || null},
        ${role_ar || null},
        ${role_en || null},
        ${photo_url || null},
        ${department || null},
        ${sort_order ?? 0}
      )
      RETURNING *
    `;

    await sql`
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('create', 'team_member', ${result[0].id}, ${JSON.stringify({ name_en, name_ar })})
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Admin team POST error:", error);
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name_ar, name_en, role_ar, role_en, photo_url, department, sort_order } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

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
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('update', 'team_member', ${id}, ${JSON.stringify({ name_en, name_ar })})
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Admin team PATCH error:", error);
    return NextResponse.json({ error: "Failed to update team member" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await sql`DELETE FROM team_members WHERE id = ${id} RETURNING id`;

    if (result.length === 0) {
      return NextResponse.json({ error: "Team member not found" }, { status: 400 });
    }

    await sql`
      INSERT INTO audit_logs (action, entity_type, entity_id, details_json)
      VALUES ('delete', 'team_member', ${id}, '{}')
    `;

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Admin team DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 });
  }
}
