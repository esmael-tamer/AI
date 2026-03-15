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
    if (!session?.value) {
      const redirectTo = isAdminRoute ? "/admin/login" : "/login"
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
}
