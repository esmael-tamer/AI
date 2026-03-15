import { NextResponse } from "next/server"
import { requireAdmin, getSession } from "@/lib/auth"

export async function checkAdminAuth(): Promise<NextResponse | null> {
  try {
    await requireAdmin()
    return null
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (err instanceof Error && err.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}

export async function getAdminId(): Promise<number | null> {
  try {
    const user = await getSession()
    return user?.id ?? null
  } catch {
    return null
  }
}
