import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const SESSION_COOKIE = "mt-session"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute =
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login"))

  const isPortalRoute = pathname.startsWith("/portal")

  if (isAdminRoute || isPortalRoute) {
    const session = request.cookies.get(SESSION_COOKIE)
    const redirectTo = isAdminRoute ? "/admin/login" : "/login"

    if (!session?.value) {
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    // Basic format validation: signed tokens have 3 parts, legacy tokens have 2
    const parts = session.value.split(":")
    if (parts.length < 2 || isNaN(parseInt(parts[0], 10))) {
      const response = NextResponse.redirect(new URL(redirectTo, request.url))
      response.cookies.delete(SESSION_COOKIE)
      return response
    }

    // For admin routes: reject non-admin sessions early using the client role cookie
    if (isAdminRoute) {
      const userRole = request.cookies.get("user_role")?.value
      // If role cookie exists and is explicitly not admin, block immediately.
      // If absent (e.g. legacy session), fall through — server-side checkAdminAuth() handles it.
      if (userRole && userRole !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
}
