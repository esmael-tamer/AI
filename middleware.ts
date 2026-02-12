import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get("mt-session")
  const userRole = request.cookies.get("user_role")

  // Protect admin routes (except login)
  if (
    pathname === "/admin" ||
    (pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login"))
  ) {
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Verify admin role
    if (userRole?.value !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protect customer portal routes
  if (pathname.startsWith("/portal")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  )

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/api/:path*"],
}
