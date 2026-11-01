import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, GraduationCap, Bookmark, TrendingUp, Users, ArrowRight, CheckCircle2, Award, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { DashboardSnapshot, UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

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

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  // Role routing guard
  if (user.role === "college_rep") {
    redirect("/dashboard/college");
  } else if (user.role === "recruiter") {
    redirect("/dashboard/recruiter");
  } else if (user.role === "mentor") {
    redirect("/dashboard/mentor");
  } else if (user.role === "admin") {
    redirect("/admin");
  }

  const displayName = user.student?.first_name
    ? `${user.student.first_name} ${user.student.last_name || ""}`.trim()
    : user.profile?.first_name || "Student";

  return (
    <div className="container-page py-10 space-y-8">
      {/* Welcome Banner in Brand Deep Navy */}
      <div className="rounded-3xl border border-slate-800 bg-[#101A32] p-7 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              <GraduationCap size={14} className="text-blue-300" /> Student Admissions &amp; Career Desk
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your college admissions, internship applications, and 1:1 alumni mentorship bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/profile"
              className="btn bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Award size={14} className="text-blue-600" /> Profile &amp; Skills
            </Link>
            <Link
              href="/mentorship"
              className="btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Users size={14} /> 1:1 Mentorship
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
          {
            href: "/colleges/saved",
            icon: GraduationCap,
            l: "Saved Colleges",
            v: dash?.stats?.saved_colleges ?? 0,
            sub: "View saved institutions →",
            color: "bg-blue-50 text-blue-700",
          },
          {
            href: "/applications",
            icon: Briefcase,
            l: "Live Applications",
            v: dash?.stats?.applications ?? 0,
            sub: "Track your applications →",
            color: "bg-purple-50 text-purple-700",
          },
          {
            href: "/internships/saved",
            icon: Bookmark,
            l: "Saved Internships",
            v: dash?.stats?.saved_internships ?? 0,
            sub: "View saved drives →",
            color: "bg-emerald-50 text-emerald-700",
          },
          {
            href: "/profile",
            icon: TrendingUp,
            l: "Verified CGPA",
            v: user?.student?.cgpa ? `${user.student.cgpa} / 10` : "—",
            sub: user?.student?.cgpa ? "Academic details verified →" : "Add CGPA in profile →",
            color: "bg-slate-100 text-slate-800",
          },
        ].map((s) => (
          <Link
            key={s.l}
            href={s.href}
            className="card p-5 space-y-2 hover:border-blue-400 hover:shadow-md transition group bg-white"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-700 transition">
                {s.l}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} font-bold shadow-2xs group-hover:scale-105 transition`}>
                <s.icon size={19} />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900">{s.v}</div>
            <div className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
              {s.sub}
            </div>
          </Link>
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
                <p className="text-xs text-slate-500">Real-time status updates from corporate hiring &amp; admissions desks.</p>
              </div>
              <Link href="/internships" className="btn-outline text-xs py-1.5 px-3 font-semibold">
                Explore Drives →
              </Link>
            </div>

            {dash?.recent_applications && dash.recent_applications.length > 0 ? (
              <div className="space-y-3">
                {dash.recent_applications.map((app) => (
                  <Link
                    key={app.id}
                    href="/applications"
                    className="rounded-xl border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-100/70 hover:border-blue-300 transition"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-sm">
                        {app.target_id || (app.target_kind === "internship" ? "Internship Application" : "College Admission")}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {app.target_kind} Application · Submitted {new Date(app.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        app.status === "selected" || app.status === "shortlisted"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : app.status === "under_review" || app.status === "interview"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : app.status === "rejected"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-sky-100 text-sky-800 border border-sky-300"
                      }`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3 bg-slate-50/40">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Briefcase size={22} />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">No applications submitted yet</div>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Browse verified tech internships and campus drives with transparent stipends to start applying.
                  </p>
                </div>
                <div className="pt-1">
                  <Link href="/internships" className="btn-primary text-xs py-2 px-4 shadow-sm font-bold inline-flex items-center gap-1.5">
                    Browse Internships &amp; Jobs <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Colleges */}
          <div className="card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Featured Accredited Institutions</h2>
                <p className="text-xs text-slate-500">Benchmark NIRF rankings and placement records.</p>
              </div>
              <Link href="/colleges" className="text-xs font-bold text-blue-700 hover:underline">
                Explore All →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {dash?.recommended_colleges.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/colleges/${c.slug}`}
                  className="rounded-2xl border border-slate-200/80 p-4 space-y-2 hover:border-blue-400 hover:shadow-sm transition bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-[#101A32] text-white px-2 py-0.5 rounded-md">
                      NIRF #{c.nirf_rank || "—"}
                    </span>
                    <span className="text-xs font-bold text-slate-700">★ {c.rating}</span>
                  </div>
                  <div className="font-display text-sm font-bold text-slate-900 truncate">{c.short_name || c.name}</div>
                  <div className="text-xs text-slate-500">{c.city}, {c.state} · ₹{c.avg_package_lpa}L avg</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900">Academic Profile</h3>
              <Link href="/profile" className="text-xs font-bold text-blue-600 hover:underline">
                Edit →
              </Link>
            </div>
            <dl className="text-xs space-y-2.5 divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <dt className="text-slate-500 font-medium">Student Name</dt>
                <dd className="font-bold text-slate-900">{displayName}</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">10th / 12th Board</dt>
                <dd className="font-bold text-slate-900">
                  {user?.student?.tenth_percentage && user?.student?.twelfth_percentage
                    ? `${user.student.tenth_percentage}% / ${user.student.twelfth_percentage}%`
                    : "Not provided"}
                </dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">Current CGPA</dt>
                <dd className="font-bold text-blue-600">
                  {user?.student?.cgpa ? `${user.student.cgpa} / 10` : "Not provided"}
                </dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">Graduation Year</dt>
                <dd className="font-bold text-slate-900">
                  {user?.student?.graduation_year
                    ? `${user.student.graduation_year} Batch`
                    : user?.student?.degree
                    ? `${user.student.degree}`
                    : "Not provided"}
                </dd>
              </div>
            </dl>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/profile"
                className="btn-outline text-xs font-bold w-full py-2 flex items-center justify-center gap-1"
              >
                Open Full Profile Desk →
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-[#101A32] p-6 text-white space-y-3 shadow-md border border-slate-800">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">1:1 Mentorship</span>
            </div>
            <h4 className="font-display text-base font-bold text-white">Connect with Top Tier Alumni</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Book real 1:1 sessions with verified engineers and alumni from Google, Amazon, Microsoft, and IITs.
            </p>
            <Link
              href="/mentorship"
              className="btn bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold w-full py-2.5 shadow-sm mt-2 inline-flex items-center justify-center gap-1.5"
            >
              Browse Mentors →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
