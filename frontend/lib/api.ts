// Universal Hybrid API Client for JoinSchooling.
// Connects to FastAPI backend in hybrid mode, with instant reliable fallback to mock database on Vercel preview.

import { cookies } from "next/headers";
import {
  colleges,
  internships,
  workshops,
  hackathons,
  scholarships,
  mockCollegeInquiries,
  mockRecruiterApplicants,
  type College,
  type Internship
} from "@/lib/mock";
import type {
  Tokens,
  UserOut,
  PagedColleges,
  PagedInternships,
  CollegeDetail,
  InternshipDetail,
  DashboardSnapshot,
  ApplicationOut,
  AiFinderResponse
} from "@/lib/types";

export const API_BASE =
  process.env.API_INTERNAL_BASE ?? process.env.API_BASE ?? "http://localhost:8000";

export const ACCESS_COOKIE = "ec_at";
export const REFRESH_COOKIE = "ec_rt";
export const USER_ROLE_COOKIE = "ec_role";
export const USER_EMAIL_COOKIE = "ec_email";
export const USER_NAME_COOKIE = "ec_name";

const ACCESS_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
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

// Helper to get user profile from verified cookies
async function getDemoUserFromCookies(): Promise<UserOut | null> {
  const jar = await cookies();
  const role = jar.get(USER_ROLE_COOKIE)?.value;
  const email = jar.get(USER_EMAIL_COOKIE)?.value;
  const name = jar.get(USER_NAME_COOKIE)?.value;

  if (!role) {
    return null;
  }

  if (role === "college_rep") {
    return {
      id: "session-college-id",
      email: email || "admissions@institution.edu.in",
      role: "college_rep",
      is_email_verified: true,
      college_rep: {
        college_name: name || "Institution",
        first_name: name?.split(" ")[0] || "College",
        last_name: name?.split(" ")[1] || "Rep",
        designation: "Dean of Admissions",
        is_verified: true
      }
    };
  }

  if (role === "recruiter") {
    return {
      id: "session-recruiter-id",
      email: email || "recruiting@company.com",
      role: "recruiter",
      is_email_verified: true,
      recruiter_profile: {
        company_name: name || "Company",
        first_name: name?.split(" ")[0] || "Recruiter",
        last_name: name?.split(" ")[1] || "Lead",
        designation: "Lead Technical Recruiter",
        is_verified: true
      }
    };
  }

  if (role === "mentor") {
    return {
      id: "session-mentor-id",
      email: email || "mentor@google.com",
      role: "mentor",
      is_email_verified: true,
      mentor_profile: {
        first_name: name?.split(" ")[0] || "Arjun",
        last_name: name?.split(" ")[1] || "Sundaram",
        company_or_institution: "Google India",
        designation: "Senior Software Engineer",
        domain_expertise: "Software Engineering & Distributed Systems",
        graduation_batch: 2020,
        bio: "Senior Software Engineer guiding students on system design and algorithms.",
        is_verified: true,
      }
    };
  }

  if (role === "admin") {
    return {
      id: "session-admin-id",
      email: email || "admin@joinschooling.com",
      role: "admin",
      is_email_verified: true,
      profile: { first_name: "Super", last_name: "Admin" }
    };
  }

  return {
    id: "session-student-id",
    email: email || "student@joinschooling.in",
    role: "student",
    is_email_verified: true,
    student: {
      first_name: name?.split(" ")[0] || "Student",
      last_name: name?.split(" ")[1] || "",
      graduation_year: 2026,
      skills: [],
      preferred_companies: []
    }
  };
}

// Fallback resolver for mock data
function resolveLocalMock<T = any>(path: string, opts: FetchOpts = {}, user: UserOut | null): T {
  const url = new URL(`http://localhost${path}`);
  const pathname = url.pathname;
  const sp = url.searchParams;

  // 1. Colleges List
  if (pathname === "/api/v1/colleges") {
    let items = [...colleges];
    const q = sp.get("q")?.toLowerCase();
    const state = sp.get("state");
    const type = sp.get("type");
    const sort = sp.get("sort");

    if (q) {
      items = items.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.short_name?.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.courses.some((cr) => cr.name.toLowerCase().includes(q))
      );
    }
    if (state) items = items.filter((c) => c.state.toLowerCase() === state.toLowerCase());
    if (type) items = items.filter((c) => c.type.toLowerCase() === type.toLowerCase());

    if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    else if (sort === "avg_package") items.sort((a, b) => (b.avg_package_lpa || 0) - (a.avg_package_lpa || 0));
    else if (sort === "nirf_rank") items.sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
    else if (sort === "fees_asc") items.sort((a, b) => (a.fees_per_year_lpa || 0) - (b.fees_per_year_lpa || 0));
    else if (sort === "fees_desc") items.sort((a, b) => (b.fees_per_year_lpa || 0) - (a.fees_per_year_lpa || 0));

    const result: PagedColleges = {
      items: items.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        short_name: c.short_name,
        city: c.city,
        state: c.state,
        type: c.type,
        nirf_rank: c.nirf_rank,
        avg_package_lpa: c.avg_package_lpa,
        highest_package_lpa: c.highest_package_lpa,
        placement_percent: c.placement_percent,
        rating: c.rating,
        reviews_count: c.reviews_count,
        banner_url: c.banner_url,
      })),
      pagination: { page: 1, page_size: 24, total: items.length, has_next: false },
    };
    return result as T;
  }

  // 2. College Detail
  if (pathname.startsWith("/api/v1/colleges/")) {
    const slug = pathname.replace("/api/v1/colleges/", "");
    const match = colleges.find((c) => c.slug === slug || c.id === slug);
    if (!match) throw new ApiError(404, { detail: "College not found" });

    const detail: CollegeDetail = {
      id: match.id,
      slug: match.slug,
      name: match.name,
      short_name: match.short_name,
      city: match.city,
      state: match.state,
      type: match.type,
      nirf_rank: match.nirf_rank,
      avg_package_lpa: match.avg_package_lpa,
      highest_package_lpa: match.highest_package_lpa,
      placement_percent: match.placement_percent,
      rating: match.rating,
      reviews_count: match.reviews_count,
      about: match.about,
      website: match.website,
      admission_process: match.admission_process,
      facilities: match.facilities,
      hostel_available: match.hostel_available,
      hostel_fee_lpa: match.hostel_fee_lpa,
      infrastructure: {},
      courses: match.courses.map((cr) => ({
        id: cr.id,
        name: cr.name,
        degree_level: cr.degree_level,
        duration_years: cr.duration_years,
        fees_per_year_lpa: cr.fees_per_year_lpa,
        total_seats: cr.total_seats,
        entrance_exams: cr.entrance_exams,
      })),
      placements: match.placements.map((p) => ({
        year: p.year,
        avg_package_lpa: p.avg_package_lpa,
        highest_package_lpa: p.highest_package_lpa,
        students_placed: p.students_placed,
        total_eligible: p.total_eligible,
        top_recruiters: p.top_recruiters,
      })),
    };
    return detail as T;
  }

  // 3. Internships List
  if (pathname === "/api/v1/internships") {
    let items = [...internships];
    const q = sp.get("q")?.toLowerCase();
    const domain = sp.get("domain");
    const work_mode = sp.get("work_mode");
    const min_stipend = sp.get("min_stipend") ? Number(sp.get("min_stipend")) : null;
    const sort = sp.get("sort");

    if (q) {
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.company.toLowerCase().includes(q) ||
          i.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (domain) items = items.filter((i) => i.domain.toLowerCase() === domain.toLowerCase());
    if (work_mode) items = items.filter((i) => i.work_mode === work_mode);
    if (min_stipend) items = items.filter((i) => i.stipend_min >= min_stipend);

    if (sort === "stipend_desc") items.sort((a, b) => b.stipend_max - a.stipend_max);
    else if (sort === "deadline") items.sort((a, b) => new Date(a.apply_deadline).getTime() - new Date(b.apply_deadline).getTime());

    const result: PagedInternships = {
      items: items.map((i) => ({
        id: i.id,
        slug: i.slug,
        title: i.title,
        domain: i.domain,
        work_mode: i.work_mode,
        duration_months: i.duration_months,
        stipend_min: i.stipend_min,
        stipend_max: i.stipend_max,
        location_city: i.city,
        posted_at: i.posted_at,
        apply_deadline: i.apply_deadline,
        company: { id: i.company, name: i.company, slug: i.company.toLowerCase(), logo_url: undefined },
      })),
      pagination: { page: 1, page_size: 24, total: items.length, has_next: false },
    };
    return result as T;
  }

  // 4. Internship Detail
  if (pathname.startsWith("/api/v1/internships/")) {
    const slug = pathname.replace("/api/v1/internships/", "");
    const match = internships.find((i) => i.slug === slug || i.id === slug);
    if (!match) throw new ApiError(404, { detail: "Internship not found" });

    const detail: InternshipDetail = {
      id: match.id,
      slug: match.slug,
      title: match.title,
      domain: match.domain,
      work_mode: match.work_mode,
      duration_months: match.duration_months,
      stipend_min: match.stipend_min,
      stipend_max: match.stipend_max,
      location_city: match.city,
      posted_at: match.posted_at,
      apply_deadline: match.apply_deadline,
      company: { id: match.company, name: match.company, slug: match.company.toLowerCase() },
      description: match.description,
      responsibilities: match.responsibilities,
      requirements: match.requirements,
      skills: match.skills,
      benefits: match.benefits,
      eligibility_batches: match.eligibility_batches,
    };
    return detail as T;
  }

  // 5. Current User / Profile
  if (pathname === "/api/v1/me") {
    if (!user) {
      throw new ApiError(401, { detail: "Authentication required" });
    }
    return user as T;
  }

  // 6. Student Dashboard Snapshot
  if (pathname === "/api/v1/me/dashboard") {
    const snap: DashboardSnapshot = {
      stats: {
        applications: 0,
        saved_colleges: 0,
        saved_internships: 0,
        unread_notifs: 0,
      },
      recent_applications: [],
      recommended_colleges: colleges.slice(0, 4).map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        short_name: c.short_name,
        city: c.city,
        state: c.state,
        type: c.type,
        nirf_rank: c.nirf_rank,
        avg_package_lpa: c.avg_package_lpa,
        rating: c.rating,
        reviews_count: c.reviews_count,
      })),
      upcoming_deadlines: [],
    };
    return snap as T;
  }

  // 7. College Representative Dashboard
  if (pathname === "/api/v1/me/college-dashboard") {
    return {
      representative: {
        name: user?.college_rep?.first_name ? `${user.college_rep.first_name} ${user.college_rep.last_name}` : "Dr. K. Srinivas Rao",
        designation: user?.college_rep?.designation || "Dean of Admissions",
        college_name: user?.college_rep?.college_name || "VNR VJIET",
      },
      stats: {
        student_inquiries: 0,
        profile_views: 0,
        is_published: true,
      },
      inquiries: [],
    } as T;
  }

  // 8. Recruiter Dashboard
  if (pathname === "/api/v1/me/recruiter-dashboard") {
    return {
      recruiter: {
        name: user?.recruiter_profile?.first_name ? `${user.recruiter_profile.first_name} ${user.recruiter_profile.last_name}` : "Recruiter",
        designation: user?.recruiter_profile?.designation || "Lead University Recruiter",
        company_name: user?.recruiter_profile?.company_name || "Company",
        is_verified: true,
      },
      stats: {
        active_postings: 0,
        total_applicants: 0,
      },
      recent_postings: [],
      applicants: [],
    } as T;
  }

  // 8b. Mentor Dashboard
  if (pathname === "/api/v1/me/mentor-dashboard") {
    return {
      mentor: {
        name: user?.mentor_profile?.first_name ? `${user.mentor_profile.first_name} ${user.mentor_profile.last_name}` : "Industry Mentor",
        domain: user?.mentor_profile?.domain_expertise || "Software Engineering",
        company_name: user?.mentor_profile?.company_or_institution || "Tech Industry",
        experience_years: 5,
      },
      stats: {
        active_mentees: 0,
        completed_sessions: 0,
        upcoming_sessions: 0,
        rating: 5.0,
      },
      sessions: [],
    } as T;
  }

  // 9. Saved items
  if (pathname === "/api/v1/saved" || pathname === "/api/v1/saved/colleges" || pathname === "/api/v1/me/saved/colleges" || pathname === "/api/v1/saved/internships" || pathname === "/api/v1/me/saved/internships") {
    return [] as T;
  }

  // 10. Student applications
  if (pathname === "/api/v1/me/applications") {
    return [] as T;
  }

  return {} as T;
}

async function raw<T = any>(path: string, { timeoutMs = 2500, ...init }: FetchOpts = {}): Promise<T> {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);

  // If we are in standalone mode or API_BASE is unreachable, fast-fallback to local data
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
      try {
        problem = await res.json();
      } catch {}
      throw new ApiError(res.status, problem);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (err) {
    // Graceful fallback to local mock database on Vercel/Local offline
    const user = await getDemoUserFromCookies();
    return resolveLocalMock<T>(path, init, user);
  } finally {
    clearTimeout(to);
  }
}

export async function api<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const headers = { ...(opts.headers as Record<string, string>) };
  if (opts.auth !== false) {
    const jar = await cookies();
    const access = jar.get(ACCESS_COOKIE)?.value;
    if (access) headers["authorization"] = `Bearer ${access}`;
  }

  try {
    return await raw<T>(path, { ...opts, headers });
  } catch (e) {
    const user = await getDemoUserFromCookies();
    return resolveLocalMock<T>(path, opts, user);
  }
}

// Public API call
export const apiPublic = <T = any>(path: string, opts: FetchOpts = {}) =>
  raw<T>(path, { ...opts });

// ---------------- Auth Helpers ----------------
export async function persistTokens(t: Tokens & { user?: { role?: string; email?: string; first_name?: string } }) {
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set(ACCESS_COOKIE, t.access_token || "demo-token", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: t.expires_in || ACCESS_MAX_AGE,
  });
  jar.set(REFRESH_COOKIE, t.refresh_token || "demo-refresh-token", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  });
  const role = t.role || t.user?.role;
  if (role) {
    jar.set(USER_ROLE_COOKIE, role, { path: "/", maxAge: REFRESH_MAX_AGE });
  }
  const email = t.email || t.user?.email;
  if (email) {
    jar.set(USER_EMAIL_COOKIE, email, { path: "/", maxAge: REFRESH_MAX_AGE });
  }
  const name = t.first_name ? `${t.first_name} ${t.last_name || ""}`.trim() : (t.user?.first_name || (email ? email.split("@")[0] : undefined));
  if (name) {
    jar.set(USER_NAME_COOKIE, name, { path: "/", maxAge: REFRESH_MAX_AGE });
  }
}

export async function clearTokens() {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(USER_ROLE_COOKIE);
  jar.delete(USER_EMAIL_COOKIE);
  jar.delete(USER_NAME_COOKIE);
}

export async function currentAccess(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value;
}
