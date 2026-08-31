"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { apiPublic, persistTokens, clearTokens, ApiError, api } from "@/lib/api";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAction(_prev: any, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { ok: false, error: "Email and password are required." };
  try {
    const tokens = await apiPublic("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await persistTokens(tokens);
  } catch (e: any) {
    return { ok: false, error: e instanceof ApiError ? (e.problem?.title || "Login failed") : "Login failed" };
  }
  redirect("/dashboard");
}

export async function registerAction(_prev: any, form: FormData): Promise<ActionResult> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const first_name = String(form.get("first_name") ?? "").trim();
  const last_name = String(form.get("last_name") ?? "").trim();
  if (!email || password.length < 8 || !first_name || !last_name) {
    return { ok: false, error: "All fields required (password ≥ 8 chars)." };
  }
  try {
    const tokens = await apiPublic("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, first_name, last_name }),
    });
    await persistTokens(tokens);
  } catch (e: any) {
    return { ok: false, error: e instanceof ApiError ? (e.problem?.title || "Register failed") : "Register failed" };
  }
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  try {
    const jar = await cookies();
    const refresh = jar.get("ec_rt")?.value || "";
    await api("/api/v1/auth/logout", { method: "POST", body: JSON.stringify({ refresh_token: refresh }) });
  } catch {}
  await clearTokens();
  redirect("/");
}
