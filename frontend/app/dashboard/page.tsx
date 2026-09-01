import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles, Briefcase, GraduationCap, Bookmark, TrendingUp, Bell, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { DashboardSnapshot, UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

const BANNERS = [
  "linear-gradient(135deg,#7c3aed,#0ea5e9)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#0ea5e9)",
  "linear-gradient(135deg,#6366f1,#ec4899)",
];

export default async function DashboardPage() {
  let user: UserOut | null = null;
  let dash: DashboardSnapshot | null = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<DashboardSnapshot>("/api/v1/me/dashboard"),
    ]);
    user = u;
    dash = d;
  } catch {
    // If not authenticated, redirect to login
    redirect("/auth/login?redirect=/dashboard");
  }

  // Authoritative Role Check: Redirect to appropriate role dashboard
  if (user.role === "college_rep") {
    redirect("/dashboard/college");
  } else if (user.role === "recruiter") {
    redirect("/dashboard/recruiter");
  } else if (user.role === "admin") {
    redirect("/admin");
  }

  const displayName = user?.profile?.first_name ?? user?.email.split("@")[0] ?? "Student";

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="chip-brand"><Sparkles size={12} /> Welcome back, {displayName}</div>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink-900">Student Dashboard</h1>
          <p className="text-sm text-ink-500">Track your college exploration, internship applications, and bookmarks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications" className="btn-outline flex items-center gap-1.5">
            <Bell size={16} /> Notifications
          </Link>
          <Link href="/ai-finder" className="btn-primary flex items-center gap-1.5">
            <Sparkles size={16} /> New AI Match
          </Link>
          <form action={logoutAction}>
            <button className="btn-ghost">Log out</button>
          </form>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: GraduationCap, l: "Saved Colleges", v: dash?.stats?.saved_colleges ?? 0, tint: "from-brand-500 to-brand-700" },
          { icon: Briefcase, l: "Applications", v: dash?.stats?.applications ?? 0, tint: "from-sky-500 to-blue-700" },
          { icon: Bookmark, l: "Saved Internships", v: dash?.stats?.saved_internships ?? 0, tint: "from-emerald-500 to-teal-600" },
          { icon: TrendingUp, l: "Unread Notifications", v: dash?.stats?.unread_notifs ?? 0, tint: "from-rose-500 to-red-600" },
        ].map((s) => (
          <div key={s.l} className="card p-5 border border-slate-200 shadow-xs">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
              <s.icon size={20} />
            </div>
            <div className="mt-4 font-display text-3xl font-extrabold text-ink-900">{s.v}</div>
            <div className="text-sm text-ink-500">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Colleges */}
          <div className="card p-6 border border-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Badge variant="brand"><Sparkles size={12} /> Personalized for you</Badge>
                <h2 className="mt-1 font-display text-xl font-bold text-ink-900">Recommended Institutions</h2>
              </div>
              <Link href="/colleges" className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition">
                Explore all
              </Link>
            </div>
            {!dash?.recommended_colleges || dash.recommended_colleges.length === 0 ? (
              <p className="text-sm text-ink-500">Explore colleges from the directory to build your personalized recommendations.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {dash.recommended_colleges.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/colleges/${c.slug}`}
                    className="group rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:shadow-md"
                  >
                    <div className="h-16 rounded-lg transition group-hover:scale-[1.01]" style={{ background: BANNERS[i % BANNERS.length] }} />
                    <div className="mt-3 font-semibold text-ink-900">{c.short_name ?? c.name}</div>
                    <div className="text-xs text-ink-500">
                      {c.city}, {c.state} {c.nirf_rank ? `· NIRF #${c.nirf_rank}` : ""}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="card p-6 border border-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="blue">Submitted Applications</Badge>
              <Link href="/internships" className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition">
                Browse internships
              </Link>
            </div>
            {!dash?.recent_applications || dash.recent_applications.length === 0 ? (
              <p className="text-sm text-ink-500">You haven&apos;t applied to any internships yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {dash.recent_applications.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-semibold text-ink-900 capitalize">{a.target_kind} Application</div>
                      <div className="text-xs text-ink-500">{new Date(a.submitted_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="brand">{a.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="card p-6 border border-slate-200">
            <h3 className="font-display text-lg font-bold text-ink-900">Student Profile</h3>
            <dl className="mt-3 grid gap-2.5 text-sm">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-ink-500">Email</dt>
                <dd className="font-semibold text-ink-900">{user.email}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-ink-500">Role</dt>
                <dd className="font-semibold text-brand-700 capitalize">{user.role}</dd>
              </div>
              {user.student?.graduation_year && (
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <dt className="text-ink-500">Graduation Year</dt>
                  <dd className="font-semibold text-ink-900">{user.student.graduation_year}</dd>
                </div>
              )}
              {user.student?.preferred_course && (
                <div className="flex justify-between pb-1">
                  <dt className="text-ink-500">Course Preference</dt>
                  <dd className="font-semibold text-ink-900">{user.student.preferred_course}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-indigo-800 p-6 text-white shadow-lg">
            <div className="flex items-center gap-2">
              <Rocket size={16} className="text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-100">AI College Match</span>
            </div>
            <div className="mt-3 font-display text-lg font-bold">Find colleges tailored to your scores & budget</div>
            <Link href="/ai-finder" className="btn mt-4 bg-white text-brand-800 hover:bg-slate-50 font-semibold shadow-md inline-flex items-center gap-2">
              Run AI Finder <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
