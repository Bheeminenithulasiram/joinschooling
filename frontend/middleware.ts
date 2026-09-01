import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [
  /^\/applications(\/|$)/,
  /^\/dashboard(\/|$)/,
  /^\/admin(\/|$)/,
  /^\/colleges\/saved(\/|$)/,
  /^\/internships\/saved(\/|$)/,
  /^\/notifications(\/|$)/,
];

const API_BASE =
  process.env.API_INTERNAL_BASE ?? process.env.API_BASE ?? "http://localhost:8000";

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload);
    // Expiration check (with 10s leeway)
    if (parsed.exp && parsed.exp * 1000 + 10000 < Date.now()) {
      return null;
    }
    return parsed.role || null;
  } catch {
    return null;
  }
}

function getOwnDashboardRoute(role?: string | null): string {
  switch (role) {
    case "college_rep":
      return "/dashboard/college";
    case "recruiter":
      return "/dashboard/recruiter";
    case "admin":
      return "/admin";
    case "student":
    default:
      return "/dashboard";
  }
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED.some((r) => r.test(pathname));
  if (!isProtected) return NextResponse.next();

  let access = req.cookies.get("ec_at")?.value;
  const refresh = req.cookies.get("ec_rt")?.value;
  let newCookiesToSet: { name: string; value: string; opts: any }[] = [];

  // 1. Attempt token refresh if access token is missing or expired
  if ((!access || !getRoleFromToken(access)) && refresh) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      });
      if (res.ok) {
        const tokens = await res.json();
        access = tokens.access_token;
        const secure = process.env.NODE_ENV === "production";
        newCookiesToSet = [
          {
            name: "ec_at",
            value: tokens.access_token,
            opts: {
              httpOnly: true,
              sameSite: "lax" as const,
              secure,
              path: "/",
              maxAge: tokens.expires_in || 15 * 60,
            },
          },
          {
            name: "ec_rt",
            value: tokens.refresh_token,
            opts: {
              httpOnly: true,
              sameSite: "lax" as const,
              secure,
              path: "/",
              maxAge: 30 * 24 * 60 * 60,
            },
          },
        ];
      }
    } catch {
      // Refresh failed
    }
  }

  // 2. Unauthenticated redirect to login
  if (!access) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete("ec_at");
    response.cookies.delete("ec_rt");
    return response;
  }

  const role = getRoleFromToken(access) || "student";
  const ownDashboard = getOwnDashboardRoute(role);

  // 3. Strict Role-Based Route Protection
  let redirectTarget: string | null = null;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      redirectTarget = ownDashboard;
    }
  } else if (pathname.startsWith("/dashboard/college")) {
    if (role !== "college_rep" && role !== "admin") {
      redirectTarget = ownDashboard;
    }
  } else if (pathname.startsWith("/dashboard/recruiter")) {
    if (role !== "recruiter" && role !== "admin") {
      redirectTarget = ownDashboard;
    }
  } else if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (role === "college_rep") {
      redirectTarget = "/dashboard/college";
    } else if (role === "recruiter") {
      redirectTarget = "/dashboard/recruiter";
    } else if (role === "admin") {
      redirectTarget = "/admin";
    }
  } else if (
    pathname.startsWith("/applications") ||
    pathname.includes("/saved")
  ) {
    if (role !== "student" && role !== "admin") {
      redirectTarget = ownDashboard;
    }
  }

  if (redirectTarget && redirectTarget !== pathname) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = redirectTarget;
    redirectUrl.searchParams.delete("redirect");
    const response = NextResponse.redirect(redirectUrl);
    newCookiesToSet.forEach((c) => response.cookies.set(c.name, c.value, c.opts));
    return response;
  }

  const response = NextResponse.next();
  newCookiesToSet.forEach((c) => response.cookies.set(c.name, c.value, c.opts));
  return response;
}

export const config = {
  matcher: [
    "/applications/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/colleges/saved/:path*",
    "/internships/saved/:path*",
    "/notifications/:path*",
  ],
};
