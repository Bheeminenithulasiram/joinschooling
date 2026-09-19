import Link from "next/link";
import { ArrowRight, Sparkles, Briefcase, GraduationCap, Bookmark, TrendingUp, Bell, Rocket, CheckCircle2, Clock, MapPin } from "lucide-react";
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
  } catch {}

  const displayName = user?.student?.first_name || user?.profile?.first_name || "Kiran Kumar";

  return (
    <div className="container-page py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-bold backdrop-blur-md">
              <Sparkles size={14} className="text-amber-400" /> Student Growth & Admissions Hub
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-brand-200">
              Track your college admissions, internship applications, and AI recommendation shortlists.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/ai-finder"
              className="btn bg-white text-brand-950 hover:bg-brand-50 text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-brand-600" /> AI College Matcher
            </Link>
            <form action={logoutAction}>
              <button className="btn bg-white/10 hover:bg-white/20 text-white text-xs py-2.5 px-4 rounded-xl transition font-semibold">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: GraduationCap, l: "Saved Colleges", v: dash?.stats?.saved_colleges ?? 4, tint: "from-brand-500 to-brand-700" },
          { icon: Briefcase, l: "Live Applications", v: dash?.stats?.applications ?? 3, tint: "from-sky-500 to-blue-700" },
          { icon: Bookmark, l: "Saved Internships", v: dash?.stats?.saved_internships ?? 5, tint: "from-emerald-500 to-teal-600" },
          { icon: TrendingUp, l: "Verified CGPA", v: "9.1 / 10", tint: "from-purple-500 to-indigo-600" },
        ].map((s) => (
          <div key={s.l} className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.l}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
                <s.icon size={18} />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900">{s.v}</div>
            <div className="text-[11px] text-slate-400 font-medium">Active student profile</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Applications Timeline */}
          <div className="card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Your Submitted Applications</h2>
                <p className="text-xs text-slate-500">Real-time status updates from corporate hiring & admissions teams.</p>
              </div>
              <Link href="/internships" className="btn-outline text-xs py-1.5 px-3">
                Apply to More
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { title: "Amazon — SDE Intern", type: "Tech Internship", status: "shortlisted", date: "2 days ago", badge: "green" },
                { title: "Microsoft — AI Research Intern", type: "Research Internship", status: "under_review", date: "5 days ago", badge: "amber" },
                { title: "IIT Bombay — B.Tech CSE", type: "College Admission", status: "submitted", date: "1 week ago", badge: "blue" },
              ].map((app) => (
                <div key={app.title} className="rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-sm">{app.title}</div>
                    <div className="text-xs text-slate-500">{app.type} · Submitted {app.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      app.status === "shortlisted"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : app.status === "under_review"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-sky-100 text-sky-800 border border-sky-300"
                    }`}>
                      {app.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Colleges */}
          <div className="card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Personalized Institutions</h2>
                <p className="text-xs text-slate-500">Recommended based on your GPA and preferred course.</p>
              </div>
              <Link href="/colleges" className="text-xs font-bold text-brand-700 hover:underline">
                Explore All →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {dash?.recommended_colleges.slice(0, 4).map((c, i) => (
                <Link
                  key={c.id}
                  href={`/colleges/${c.slug}`}
                  className="rounded-2xl border border-slate-200 p-4 space-y-2 hover:border-brand-400 hover:shadow-md transition bg-white"
                >
                  <div className="h-16 rounded-xl text-white p-2.5 flex justify-between items-start" style={{ background: BANNERS[i % BANNERS.length] }}>
                    <span className="text-xs font-bold bg-black/40 px-2 py-0.5 rounded">NIRF #{c.nirf_rank || "—"}</span>
                    <span className="text-xs font-bold bg-white/90 text-slate-900 px-2 py-0.5 rounded">⭐ {c.rating}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">{c.short_name || c.name}</div>
                  <div className="text-xs text-slate-500">{c.city}, {c.state} · ₹{c.avg_package_lpa}L avg</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">Academic Profile</h3>
            <dl className="text-xs space-y-2.5 divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <dt className="text-slate-500 font-medium">Student Name</dt>
                <dd className="font-bold text-slate-900">Kiran Kumar</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">10th / 12th Board</dt>
                <dd className="font-bold text-slate-900">94.2% / 91.0%</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">Current CGPA</dt>
                <dd className="font-bold text-brand-700">9.1 / 10</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">Graduation Year</dt>
                <dd className="font-bold text-slate-900">2026 Batch</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-indigo-900 p-6 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Rocket size={18} className="text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-200">AI Counselor</span>
            </div>
            <h4 className="font-display text-lg font-bold">Unsure about your college or internship chances?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Run the multi-factor rubric algorithm to get an updated fit ranking across top institutions.
            </p>
            <Link
              href="/ai-finder"
              className="btn bg-white text-brand-900 hover:bg-slate-50 text-xs font-bold w-full py-2.5 shadow-md mt-2 inline-flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} /> Calculate Matches
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
