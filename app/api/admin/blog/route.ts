import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const posts = await sql`SELECT * FROM blog_posts ORDER BY created_at DESC`;
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Admin blog error:", error);
    return NextResponse.json([]);
  }
}
