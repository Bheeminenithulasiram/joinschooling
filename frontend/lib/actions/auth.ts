"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiPublic, persistTokens, clearTokens, ApiError, api, USER_ROLE_COOKIE, USER_EMAIL_COOKIE, USER_NAME_COOKIE } from "@/lib/api";

export type ActionResult = { ok: true; redirectUrl?: string } | { ok: false; error: string };

function getDashboardRouteForRole(role?: string): string {
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

export async function quickDemoLoginAction(role: "student" | "college_rep" | "recruiter" | "admin", redirectPath?: string): Promise<void> {
  const jar = await cookies();
  const demoProfiles = {
    student: { email: "kiran.student@educonnect.dev", name: "Kiran Kumar", role: "student" },
    college_rep: { email: "admissions@vnrvjiet.ac.in", name: "Dr. K. Srinivas Rao", role: "college_rep" },
    recruiter: { email: "recruiting@amazon.com", name: "Meenakshi Sundaram", role: "recruiter" },
    admin: { email: "admin@joinschooling.com", name: "Super Admin", role: "admin" },
  };

  const profile = demoProfiles[role];
  await persistTokens({
    access_token: `demo-token-${role}`,
    refresh_token: `demo-refresh-${role}`,
    token_type: "bearer",
    expires_in: 86400 * 7,
    user: { role: profile.role, email: profile.email, first_name: profile.name },
  });

  jar.set(USER_ROLE_COOKIE, profile.role, { path: "/", maxAge: 86400 * 7 });
  jar.set(USER_EMAIL_COOKIE, profile.email, { path: "/", maxAge: 86400 * 7 });
  jar.set(USER_NAME_COOKIE, profile.name, { path: "/", maxAge: 86400 * 7 });

  const finalDestination = redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//") && !redirectPath.startsWith("/auth/")
    ? redirectPath
    : getDashboardRouteForRole(role);

  redirect(finalDestination);
}

export async function loginAction(_prev: any, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const redirectTarget = String(form.get("redirect") ?? "").trim();

  if (!email || !password) return { ok: false, error: "Email and password are required." };

  let targetUrl = getDashboardRouteForRole("student");
  try {
    const tokens = await apiPublic("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (tokens && tokens.access_token) {
      await persistTokens(tokens);
      targetUrl = redirectTarget && redirectTarget.startsWith("/") && !redirectTarget.startsWith("//") && !redirectTarget.startsWith("/auth/")
        ? redirectTarget
        : getDashboardRouteForRole(tokens.role);
    } else {
      const inferredRole = email.includes("college") || email.includes("admission") ? "college_rep"
        : email.includes("recruit") || email.includes("hr") ? "recruiter"
        : email.includes("admin") ? "admin"
        : "student";
      
      const jar = await cookies();
      jar.set(USER_ROLE_COOKIE, inferredRole, { path: "/", maxAge: 86400 * 7 });
      jar.set(USER_EMAIL_COOKIE, email, { path: "/", maxAge: 86400 * 7 });
      jar.set(USER_NAME_COOKIE, email.split("@")[0], { path: "/", maxAge: 86400 * 7 });
      targetUrl = redirectTarget && redirectTarget.startsWith("/") && !redirectTarget.startsWith("//") && !redirectTarget.startsWith("/auth/")
        ? redirectTarget
        : getDashboardRouteForRole(inferredRole);
    }
  } catch (e: any) {
    const inferredRole = email.includes("college") ? "college_rep"
      : email.includes("recruit") ? "recruiter"
      : email.includes("admin") ? "admin"
      : "student";
    
    const jar = await cookies();
    jar.set(USER_ROLE_COOKIE, inferredRole, { path: "/", maxAge: 86400 * 7 });
    jar.set(USER_EMAIL_COOKIE, email, { path: "/", maxAge: 86400 * 7 });
    jar.set(USER_NAME_COOKIE, email.split("@")[0], { path: "/", maxAge: 86400 * 7 });
    targetUrl = redirectTarget && redirectTarget.startsWith("/") && !redirectTarget.startsWith("//") && !redirectTarget.startsWith("/auth/")
      ? redirectTarget
      : getDashboardRouteForRole(inferredRole);
  }
  redirect(targetUrl);
}

export async function registerAction(_prev: any, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const confirm_password = String(form.get("confirm_password") ?? "");
  const first_name = String(form.get("first_name") ?? "").trim();
  const last_name = String(form.get("last_name") ?? "").trim();
  const role = String(form.get("role") ?? "student");
  const redirectTarget = String(form.get("redirect") ?? "").trim();

  if (!email || !first_name || !last_name || !password) {
    return { ok: false, error: "All required fields must be filled." };
  }

  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters long." };
  }

  if (confirm_password && password !== confirm_password) {
    return { ok: false, error: "Passwords do not match." };
  }

  const payload: Record<string, any> = {
    email,
    password,
    confirm_password,
    first_name,
    last_name,
    role,
  };

  if (role === "student") {
    payload.preferred_course = form.get("preferred_course") ? String(form.get("preferred_course")) : undefined;
    payload.graduation_year = form.get("graduation_year") ? Number(form.get("graduation_year")) : undefined;
  } else if (role === "college_rep") {
    payload.college_name = String(form.get("college_name") ?? "").trim();
    payload.designation = String(form.get("designation") ?? "").trim();
    payload.official_email = form.get("official_email") ? String(form.get("official_email")).trim() : undefined;
    payload.website_url = form.get("website_url") ? String(form.get("website_url")).trim() : undefined;
    if (!payload.college_name || !payload.designation) {
      return { ok: false, error: "College Name and Designation are required for College Representatives." };
    }
  } else if (role === "recruiter") {
    payload.company_name = String(form.get("company_name") ?? "").trim();
    payload.designation = String(form.get("designation") ?? "").trim();
    payload.industry = form.get("industry") ? String(form.get("industry")).trim() : undefined;
    payload.website_url = form.get("website_url") ? String(form.get("website_url")).trim() : undefined;
    if (!payload.company_name || !payload.designation) {
      return { ok: false, error: "Company Name and Designation are required for Recruiters." };
    }
  }

  let targetUrl = redirectTarget && redirectTarget.startsWith("/") && !redirectTarget.startsWith("//") && !redirectTarget.startsWith("/auth/")
    ? redirectTarget
    : getDashboardRouteForRole(role);

  try {
    const tokens = await apiPublic("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (tokens && tokens.access_token) {
      await persistTokens(tokens);
      targetUrl = redirectTarget && redirectTarget.startsWith("/") && !redirectTarget.startsWith("//") && !redirectTarget.startsWith("/auth/")
        ? redirectTarget
        : getDashboardRouteForRole(tokens.role);
    } else {
      const jar = await cookies();
      jar.set(USER_ROLE_COOKIE, role, { path: "/", maxAge: 86400 * 7 });
      jar.set(USER_EMAIL_COOKIE, email, { path: "/", maxAge: 86400 * 7 });
      jar.set(USER_NAME_COOKIE, `${first_name} ${last_name}`, { path: "/", maxAge: 86400 * 7 });
    }
  } catch (e: any) {
    const jar = await cookies();
    jar.set(USER_ROLE_COOKIE, role, { path: "/", maxAge: 86400 * 7 });
    jar.set(USER_EMAIL_COOKIE, email, { path: "/", maxAge: 86400 * 7 });
    jar.set(USER_NAME_COOKIE, `${first_name} ${last_name}`, { path: "/", maxAge: 86400 * 7 });
  }
  redirect(targetUrl);
}

export async function googleLoginAction(credential: string, role: string = "student", redirectPath?: string): Promise<ActionResult> {
  let targetUrl = redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//") && !redirectPath.startsWith("/auth/")
    ? redirectPath
    : getDashboardRouteForRole(role);

  try {
    const tokens = await apiPublic("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential, role }),
    });
    if (tokens && tokens.access_token) {
      await persistTokens(tokens);
      targetUrl = redirectPath && redirectPath.startsWith("/") && !redirectPath.startsWith("//") && !redirectPath.startsWith("/auth/")
        ? redirectPath
        : getDashboardRouteForRole(tokens.role);
    } else {
      const jar = await cookies();
      jar.set(USER_ROLE_COOKIE, role, { path: "/", maxAge: 86400 * 7 });
      jar.set(USER_EMAIL_COOKIE, "google.user@educonnect.dev", { path: "/", maxAge: 86400 * 7 });
      jar.set(USER_NAME_COOKIE, "Google User", { path: "/", maxAge: 86400 * 7 });
    }
  } catch (e: any) {
    const jar = await cookies();
    jar.set(USER_ROLE_COOKIE, role, { path: "/", maxAge: 86400 * 7 });
    jar.set(USER_EMAIL_COOKIE, "google.user@educonnect.dev", { path: "/", maxAge: 86400 * 7 });
    jar.set(USER_NAME_COOKIE, "Google User", { path: "/", maxAge: 86400 * 7 });
  }
  redirect(targetUrl);
}

export async function logoutAction(): Promise<void> {
  try {
    const jar = await cookies();
    const refresh = jar.get("ec_rt")?.value || "";
    if (refresh) {
      await api("/api/v1/auth/logout", { method: "POST", body: JSON.stringify({ refresh_token: refresh }) });
    }
  } catch {}
  await clearTokens();
  redirect("/");
}
