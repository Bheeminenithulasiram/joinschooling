"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiPublic, persistTokens, clearTokens, ApiError, api } from "@/lib/api";

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

export async function loginAction(_prev: any, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Email and password are required." };

  let targetUrl = "/dashboard";
  try {
    const tokens = await apiPublic("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await persistTokens(tokens);
    targetUrl = getDashboardRouteForRole(tokens.role);
  } catch (e: any) {
    return {
      ok: false,
      error: e instanceof ApiError ? (e.problem?.detail || e.problem?.title || "Invalid email or password.") : "Login failed.",
    };
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

  let targetUrl = "/dashboard";
  try {
    const tokens = await apiPublic("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await persistTokens(tokens);
    targetUrl = getDashboardRouteForRole(tokens.role);
  } catch (e: any) {
    return {
      ok: false,
      error: e instanceof ApiError ? (e.problem?.detail || e.problem?.title || "Registration failed.") : "Registration failed.",
    };
  }
  redirect(targetUrl);
}

export async function googleLoginAction(credential: string, role: string = "student"): Promise<ActionResult> {
  let targetUrl = "/dashboard";
  try {
    const tokens = await apiPublic("/api/v1/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential, role }),
    });
    await persistTokens(tokens);
    targetUrl = getDashboardRouteForRole(tokens.role);
  } catch (e: any) {
    return {
      ok: false,
      error: e instanceof ApiError ? (e.problem?.detail || "Google authentication failed.") : "Google sign in failed.",
    };
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
