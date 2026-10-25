import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require strict database authentication before entry
const PROTECTED_ROUTES = [
  "/dashboard",
  "/advisory",
  "/calculator",
  "/chat",
  "/chc-locator",
  "/crisis",
  "/crops",
  "/expenses",
  "/experts",
  "/fertilizer-calculator",
  "/health-score",
  "/knowledge",
  "/loans",
  "/magazines",
  "/market",
  "/notifications",
  "/scanner",
  "/schemes",
  "/settings",
  "/soil-health",
  "/videos",
  "/warehouses",
  "/weather",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("khetisaathi_session")?.value;
  const uid = request.cookies.get("khetisaathi_uid")?.value;

  const isAuthenticated = Boolean(sessionToken && uid);

  // 1. Check if user is attempting to access a protected webapp section
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected && !isAuthenticated) {
    // Strictly block and redirect to login page
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("mode", "login");
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated user navigates to auth login/register, route them to dashboard
  if (pathname === "/auth" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
