import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Define protected routes
  const protectedRoutes = [
    "/profile",
    "/transactions",
    "/admin",
  ]

  // Redirect unauthenticated users away from protected routes
  if (!isLoggedIn && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/log-in", req.url))
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && (pathname === "/log-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Admin route protection
  if (pathname.startsWith("/admin") && req.auth?.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}