import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login)
  if (
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login"))
  ) {
    const session = request.cookies.get("mt-session")
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Protect customer portal routes
  if (pathname.startsWith("/portal")) {
    const session = request.cookies.get("mt-session")
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
}
