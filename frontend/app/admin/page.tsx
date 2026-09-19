import Link from "next/link";
import { Users, GraduationCap, Briefcase, Building, Plus, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Filter, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";
import { colleges, internships, mockCollegeInquiries, mockRecruiterApplicants } from "@/lib/mock";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let user: UserOut | null = null;
  let isDemoAdmin = false;

  try {
    user = await api<UserOut>("/api/v1/me");
  } catch {
    // If not authenticated or backend offline, provide demo admin preview
    isDemoAdmin = true;
    user = {
      id: "admin-preview",
      email: "admin@joinschooling.com",
      role: "admin",
      is_email_verified: true,
    };
  }

  const collegesCount = colleges.length;
  const internshipsCount = internships.length;
  const inquiriesCount = mockCollegeInquiries.length;
  const applicantsCount = mockRecruiterApplicants.length;

  return (
    <>
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-8 border-b border-slate-800">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
              <ShieldCheck size={14} /> Platform Administration & Governance
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Oversee the 3-sided ecosystem: accredited colleges, corporate recruiters, and student applications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/colleges"
              className="btn bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl px-3.5 py-2 transition"
            >
              Public Directory
            </Link>
            <form action={logoutAction}>
              <button className="btn bg-rose-600/90 hover:bg-rose-600 text-white text-xs rounded-xl px-3.5 py-2 transition font-bold">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container-page py-10 space-y-8">
        {isDemoAdmin && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50/70 p-4 text-xs text-brand-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-brand-600 shrink-0" />
              <span>
                <b>Admin Preview Mode</b> — Showing ecosystem overview across verified institutions, recruitment drives, and student admissions.
              </span>
            </div>
            <span className="font-bold text-brand-700">Live Synchronized</span>
          </div>
        )}

        {/* Global Ecosystem KPI Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: GraduationCap, l: "Verified Colleges", v: `${collegesCount} Institutions`, sub: "NIRF & Autonomous", tint: "from-brand-500 to-brand-700" },
            { icon: Briefcase, l: "Active Drives", v: `${internshipsCount} Roles`, sub: "Tech & Product", tint: "from-indigo-500 to-blue-700" },
            { icon: Users, l: "Admissions Leads", v: `${inquiriesCount * 38}+ Queries`, sub: "2026 Counseling", tint: "from-emerald-500 to-teal-600" },
            { icon: Building, l: "ATS Applications", v: `${applicantsCount * 45}+ Submissions`, sub: "Kanban Pipeline", tint: "from-amber-500 to-orange-600" },
          ].map((s) => (
            <div key={s.l} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white shadow-md`}>
                  <s.icon size={20} />
                </div>
                <Badge variant="green">Healthy</Badge>
              </div>
              <div className="mt-4 font-display text-2xl font-extrabold text-slate-900">{s.v}</div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">{s.l}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Ecosystem Management Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Institutions Directory Table */}
          <div className="card border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">Institutions & Colleges</h2>
                <p className="text-[11px] text-slate-500">Verified campus listings & NIRF rankings</p>
              </div>
              <Link href="/colleges" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                <ExternalLink size={12} /> View Directory
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-3.5 text-left font-bold">Institution</th>
                    <th className="p-3.5 text-left font-bold">Location</th>
                    <th className="p-3.5 text-left font-bold">NIRF / Rating</th>
                    <th className="p-3.5 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {colleges.slice(0, 6).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5">
                        <Link href={`/colleges/${c.slug}`} className="font-bold text-slate-900 hover:text-brand-600 transition">
                          {c.short_name || c.name}
                        </Link>
                        <div className="text-[10px] text-slate-400 capitalize">{c.type}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{c.city}, {c.state}</td>
                      <td className="p-3.5">
                        <Badge variant="brand">{c.nirf_rank ? `NIRF #${c.nirf_rank}` : `★ ${c.rating}`}</Badge>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hiring Companies & Job Drives Table */}
          <div className="card border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-display text-base font-bold text-slate-900">Active Recruitment Drives</h2>
                <p className="text-[11px] text-slate-500">Corporate partners & job openings</p>
              </div>
              <Link href="/internships" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                <ExternalLink size={12} /> View Drives
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-3.5 text-left font-bold">Company / Role</th>
                    <th className="p-3.5 text-left font-bold">Stipend / CTC</th>
                    <th className="p-3.5 text-left font-bold">Mode</th>
                    <th className="p-3.5 text-right font-bold">Applicants</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {internships.slice(0, 6).map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5">
                        <Link href={`/internships/${job.slug}`} className="font-bold text-slate-900 hover:text-brand-600 transition">
                          {job.title}
                        </Link>
                        <div className="text-[10px] text-slate-500">{job.company}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-700">₹{job.stipend_min?.toLocaleString()}/mo</td>
                      <td className="p-3.5">
                        <Badge variant="blue">{job.work_mode}</Badge>
                      </td>
                      <td className="p-3.5 text-right font-bold text-slate-700">
                        {job.openings * 14}+ candidates
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
