// Typed API client for FastAPI backend. Works in RSC, Route Handlers, and Server Actions.
// Client components should call Route Handlers instead of hitting the backend directly.
import { cookies } from "next/headers";

export const API_BASE =
  process.env.API_INTERNAL_BASE ?? process.env.API_BASE ?? "http://localhost:8000";

export const ACCESS_COOKIE = "ec_at";
export const REFRESH_COOKIE = "ec_rt";
const ACCESS_MAX_AGE = 60 * 15;          // 15 min
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export class ApiError extends Error {
  status: number;
  problem: any;
  constructor(status: number, problem: any) {
    super(problem?.title || problem?.detail || `HTTP ${status}`);
    this.status = status;
    this.problem = problem;
  }
}

type FetchOpts = RequestInit & { auth?: boolean; timeoutMs?: number };

async function raw<T = any>(path: string, { timeoutMs = 15000, ...init }: FetchOpts = {}): Promise<T> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      cache: "no-store",
      signal: ctrl.signal,
      headers: {
        "content-type": "application/json",
        ...(init.headers as Record<string, string>),
      },
    });
    if (!res.ok) {
      let problem: any = { title: res.statusText };
      try { problem = await res.json(); } catch {}
      throw new ApiError(res.status, problem);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(to);
  }
}

export async function api<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers = { ...(opts.headers as Record<string, string>) };
  if (opts.auth !== false) {
    const jar = await cookies();
    let access = jar.get(ACCESS_COOKIE)?.value;
    
    if (!access) {
      const refresh = jar.get(REFRESH_COOKIE)?.value;
      if (refresh) {
        try {
          const tokens = await raw<Tokens>("/api/v1/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refresh }),
            auth: false,
          });
          await persistTokens(tokens);
          access = tokens.access_token;
        } catch {
          await clearTokens();
        }
      }
    }
    
    if (access) headers["authorization"] = `Bearer ${access}`;
  }
  
  try {
    return await raw<T>(path, { ...opts, headers });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401 && opts.auth !== false) {
      const jar = await cookies();
      const refresh = jar.get(REFRESH_COOKIE)?.value;
      if (refresh) {
        try {
          const tokens = await raw<Tokens>("/api/v1/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refresh_token: refresh }),
            auth: false,
          });
          await persistTokens(tokens);
          headers["authorization"] = `Bearer ${tokens.access_token}`;
          return await raw<T>(path, { ...opts, headers });
        } catch {
          await clearTokens();
        }
      }
    }
    throw e;
  }
}

// Public: no auth, safe from RSC without cookies.
export const apiPublic = <T = any>(path: string, opts: FetchOpts = {}) =>
  raw<T>(path, { ...opts });

// ---------------- Auth ----------------
export type Tokens = { access_token: string; refresh_token: string; expires_in: number };

export async function persistTokens(t: Tokens) {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set(ACCESS_COOKIE, t.access_token, {
    httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: t.expires_in || ACCESS_MAX_AGE,
  });
  jar.set(REFRESH_COOKIE, t.refresh_token, {
    httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: REFRESH_MAX_AGE,
  });
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

export async function currentAccess(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value;
}
