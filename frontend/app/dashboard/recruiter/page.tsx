import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, Users, PlusCircle, Building, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboardPage() {
  let user: UserOut | null = null;
  let data: any = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<any>("/api/v1/me/recruiter-dashboard"),
    ]);
    user = u;
    data = d;
  } catch {
    redirect("/auth/login?redirect=/dashboard/recruiter");
  }

  // Authoritative Role Check: only recruiter and admin allowed
  if (user.role !== "recruiter" && user.role !== "admin") {
    if (user.role === "student") redirect("/dashboard");
    if (user.role === "college_rep") redirect("/dashboard/college");
  }

  return (
    <div className="container-page py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-sky-100 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-semibold backdrop-blur-md">
              <Building size={14} className="text-sky-400" /> Company Recruiter Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome, {data?.recruiter?.name}
            </h1>
            <p className="text-sm text-sky-200">
              {data?.recruiter?.designation} • <span className="font-semibold text-white">{data?.recruiter?.company_name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/internships"
              className="btn bg-white text-slate-950 hover:bg-slate-50 shadow-md font-semibold text-sm rounded-xl px-5 py-3 transition inline-flex items-center gap-2"
            >
              <PlusCircle size={16} /> Post Opportunity
            </Link>
            <form action={logoutAction}>
              <button className="btn bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl px-4 py-3 transition">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Postings</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Briefcase size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-ink-900">{data?.stats?.active_postings ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Live internships & hackathons</p>
        </div>

        <div className="card p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-ink-900">{data?.stats?.total_applicants ?? 0}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Verified student resumes submitted</p>
        </div>

        <div className="card p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recruiter Status</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-emerald-600">
            {data?.recruiter?.is_verified ? "Verified Partner" : "Active"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Registered hiring organization</p>
        </div>
      </div>

      {/* Recent Postings List */}
      <div className="card p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">Your Recent Opportunities</h2>
          <Link href="/internships" className="text-sm font-semibold text-brand-700 hover:text-brand-800 transition">
            Browse all
          </Link>
        </div>
        {!data?.recent_postings || data.recent_postings.length === 0 ? (
          <p className="text-sm text-ink-500">No opportunities posted yet. Click &quot;Post Opportunity&quot; to publish your first internship.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.recent_postings.map((p: any) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-semibold text-ink-900">{p.title}</h3>
                  <p className="text-xs text-ink-500">{p.domain} {p.openings ? `· ${p.openings} openings` : ""}</p>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {p.posted_at ? new Date(p.posted_at).toLocaleDateString() : "Active"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
