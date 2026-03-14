import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password, name_ar, name_en, phone, session_id } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create user
    const newUser = await sql`
      INSERT INTO users (email, password_hash, name_ar, name_en, phone, role)
      VALUES (${email}, ${password}, ${name_ar || ""}, ${name_en || ""}, ${phone || ""}, 'customer')
      RETURNING id, email, name_ar, name_en, role, phone
    `;

    const user = newUser[0];

    // Link any demo store created in this session to the new user
    if (session_id) {
      await sql`
        UPDATE stores SET user_id = ${user.id}
        WHERE session_id = ${session_id} AND user_id IS NULL
      `;
    }

    // Create session
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const response = NextResponse.json({ user, token }, { status: 201 });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    response.cookies.set("user_id", String(user.id), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    response.cookies.set("user_role", user.role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
