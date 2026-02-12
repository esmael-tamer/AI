import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const loginLimiter = rateLimit({ interval: 15 * 60 * 1000, maxRequests: 10 });

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!loginLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const users = await sql`
      SELECT id, email, password_hash, name_ar, name_en, role, phone
      FROM users WHERE email = ${email}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    const isValid = await verifyPassword(password, user.password_hash as string);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Re-hash with new salt format if stored in legacy format
    const storedHash = user.password_hash as string;
    if (storedHash && !storedHash.includes(":")) {
      const newHash = await hashPassword(password);
      await sql`UPDATE users SET password_hash = ${newHash}, updated_at = NOW() WHERE id = ${user.id}`;
    }

    // Create session token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    const token = Array.from(tokenBytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await sql`UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`;

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name_ar: user.name_ar,
        name_en: user.name_en,
        role: user.role,
        phone: user.phone,
      },
    });

    response.cookies.set("mt-session", `${user.id}:${token}`, {
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

    response.cookies.set("user_role", user.role as string, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
