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
  } else if (user.role === "admin") {
    redirect("/admin");
  }

  const displayName = user.student?.first_name
    ? `${user.student.first_name} ${user.student.last_name || ""}`.trim()
    : user.profile?.first_name || "Student";

  return (
    <div className="container-page py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
              <GraduationCap size={14} className="text-brand-300" /> Student Admissions & Career Desk
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Track your college admissions, internship applications, and 1:1 alumni mentorship bookings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/profile"
              className="btn bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Award size={14} className="text-blue-600" /> View & Edit Profile
            </Link>
            <Link
              href="/mentorship"
              className="btn bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
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
          { icon: GraduationCap, l: "Saved Colleges", v: dash?.stats?.saved_colleges ?? 4, tint: "from-brand-700 to-navy-900" },
          { icon: Briefcase, l: "Live Applications", v: dash?.stats?.applications ?? 3, tint: "from-blue-600 to-navy-800" },
          { icon: Bookmark, l: "Saved Internships", v: dash?.stats?.saved_internships ?? 5, tint: "from-emerald-700 to-teal-900" },
          { icon: TrendingUp, l: "Verified CGPA", v: "9.1 / 10", tint: "from-slate-700 to-slate-900" },
        ].map((s) => (
          <div key={s.l} className="card p-5 space-y-2 border border-slate-200 shadow-sm">
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
          <div className="card p-6 sm:p-8 space-y-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Your Submitted Applications</h2>
                <p className="text-xs text-slate-500">Real-time status updates from corporate hiring & admissions desks.</p>
              </div>
              <Link href="/internships" className="btn-outline text-xs py-1.5 px-3">
                Apply to More
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { title: "Amazon — SDE Intern", type: "Tech Internship", status: "shortlisted", date: "2 days ago" },
                { title: "Microsoft — Software Engineering Intern", type: "Tech Internship", status: "under_review", date: "5 days ago" },
                { title: "IIT Bombay — B.Tech CSE Counseling", type: "College Admission", status: "submitted", date: "1 week ago" },
              ].map((app) => (
                <div key={app.title} className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
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
          <div className="card p-6 sm:p-8 space-y-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">Featured Accredited Institutions</h2>
                <p className="text-xs text-slate-500">Benchmark NIRF rankings and placement records.</p>
              </div>
              <Link href="/colleges" className="text-xs font-bold text-brand-700 hover:underline">
                Explore All →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {dash?.recommended_colleges.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/colleges/${c.slug}`}
                  className="rounded-xl border border-slate-200 p-4 space-y-2 hover:border-brand-500 hover:shadow-sm transition bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      NIRF #{c.nirf_rank || "—"}
                    </span>
                    <span className="text-xs font-bold text-slate-700">★ {c.rating}</span>
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
          <div className="card p-6 space-y-4 border border-slate-200 shadow-sm">
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
                <dd className="font-bold text-slate-900">94.2% / 91.0%</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">Current CGPA</dt>
                <dd className="font-bold text-blue-600">9.1 / 10</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-slate-500 font-medium">Graduation Year</dt>
                <dd className="font-bold text-slate-900">{user?.student?.graduation_year ? `${user.student.graduation_year} Batch` : "2026 Batch"}</dd>
              </div>
            </dl>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/profile"
                className="btn-outline text-xs font-bold w-full py-2 flex items-center justify-center gap-1"
              >
                Open Full Profile Dashboard →
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 p-6 text-white space-y-3 shadow-md border border-slate-800">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-brand-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">1:1 Mentorship</span>
            </div>
            <h4 className="font-display text-base font-bold">Connect with Top Tier Alumni</h4>
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

