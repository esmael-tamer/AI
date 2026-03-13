import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const signupLimiter = rateLimit({ interval: 60 * 60 * 1000, maxRequests: 5 });

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name_ar: z.string().optional(),
  name_en: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!signupLimiter.check(ip)) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, name_ar, name_en, phone } = parsed.data;

    // Check if user already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password before storing
    const passwordHash = await hashPassword(password);

    // Create user
    const newUser = await sql`
      INSERT INTO users (email, password_hash, name_ar, name_en, phone, role)
      VALUES (${email}, ${passwordHash}, ${name_ar || null}, ${name_en || null}, ${phone || null}, 'customer')
      RETURNING id, email, name_ar, name_en, role, phone
    `;

    const user = newUser[0];

    // Create session (stored in DB for validation)
    const { token, expiresAt } = await createSession(user.id as number);

    const response = NextResponse.json({ user }, { status: 201 });

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
