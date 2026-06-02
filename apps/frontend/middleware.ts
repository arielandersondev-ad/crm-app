import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  const isAuthenticated = !!token;

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};