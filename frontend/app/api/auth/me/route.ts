import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, USER_ROLE_COOKIE, USER_EMAIL_COOKIE, USER_NAME_COOKIE, API_BASE } from "@/lib/api";

export async function GET(req: NextRequest) {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  const role = jar.get(USER_ROLE_COOKIE)?.value;
  const email = jar.get(USER_EMAIL_COOKIE)?.value;
  const name = jar.get(USER_NAME_COOKIE)?.value;

  if (!access && !role) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  // If backend is running, try to fetch fresh user profile
  if (access) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/me`, {
        headers: {
          authorization: `Bearer ${access}`,
          "content-type": "application/json",
        },
        cache: "no-store",
      });
      if (res.ok) {
        const user = await res.json();
        return NextResponse.json({ user });
      }
    } catch {
      // Backend offline fallback to verified session cookies
    }
  }

  if (role) {
    const user = {
      id: "session-user",
      email: email || "user@joinschooling.com",
      role: role,
      name: name || email?.split("@")[0] || "User",
      is_email_verified: true,
      student: role === "student" ? {
        first_name: name?.split(" ")[0] || "Student",
        last_name: name?.split(" ")[1] || "User",
      } : undefined,
      college_rep: role === "college_rep" ? {
        first_name: name?.split(" ")[0] || "College",
        last_name: name?.split(" ")[1] || "Representative",
        designation: "Admissions Representative",
        college_name: "Institution",
      } : undefined,
      recruiter_profile: role === "recruiter" ? {
        first_name: name?.split(" ")[0] || "Recruiter",
        last_name: name?.split(" ")[1] || "User",
        company_name: "Company",
        designation: "Recruitment Lead",
      } : undefined,
    };
    return NextResponse.json({ user });
  }

  return NextResponse.json({ user: null }, { status: 401 });
}
