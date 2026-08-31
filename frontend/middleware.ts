import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [
  /^\/applications(\/|$)/,
  /^\/dashboard(\/|$)/,
  /^\/colleges\/saved(\/|$)/,
  /^\/internships\/saved(\/|$)/,
  /^\/notifications(\/|$)/,
];

const API_BASE = process.env.API_INTERNAL_BASE ?? process.env.API_BASE ?? "http://localhost:8000";

export async function middleware(req: NextRequest) {
  const isProtected = PROTECTED.some((r) => r.test(req.nextUrl.pathname));
  if (!isProtected) return NextResponse.next();

  let access = req.cookies.get("ec_at")?.value;
  const refresh = req.cookies.get("ec_rt")?.value;

  if (!access && refresh) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (res.ok) {
        const tokens = await res.json();
        const response = NextResponse.next();
        const secure = process.env.NODE_ENV === "production";
        response.cookies.set("ec_at", tokens.access_token, {
          httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: tokens.expires_in || 15 * 60,
        });
        response.cookies.set("ec_rt", tokens.refresh_token, {
          httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 30 * 24 * 60 * 60,
        });
        return response;
      }
    } catch {
      // Failed to refresh
    }
  }

  if (!access) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", req.nextUrl.pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete("ec_at");
    response.cookies.delete("ec_rt");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/applications/:path*",
    "/dashboard/:path*",
    "/colleges/saved/:path*",
    "/internships/saved/:path*",
    "/notifications/:path*",
  ],
};
