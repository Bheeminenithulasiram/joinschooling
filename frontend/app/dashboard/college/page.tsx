import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, Users, Eye, CheckCircle2, ShieldCheck, ArrowRight, BookOpen, Award } from "lucide-react";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function CollegeDashboardPage() {
  let user: UserOut | null = null;
  let data: any = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<any>("/api/v1/me/college-dashboard"),
    ]);
    user = u;
    data = d;
  } catch {
    redirect("/auth/login?redirect=/dashboard/college");
  }

  // Authoritative Role Check: only college_rep and admin allowed
  if (user.role !== "college_rep" && user.role !== "admin") {
    if (user.role === "student") redirect("/dashboard");
    if (user.role === "recruiter") redirect("/dashboard/recruiter");
  }

  return (
    <div className="container-page py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" /> College Representative Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome, {data?.representative?.name}
            </h1>
            <p className="text-sm text-indigo-200">
              {data?.representative?.designation} • <span className="font-semibold text-white">{data?.representative?.college_name}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/colleges"
              className="btn bg-white text-indigo-950 hover:bg-indigo-50 shadow-md font-semibold text-sm rounded-xl px-5 py-3 transition inline-flex items-center gap-2"
            >
              Public Directory <ArrowRight size={16} />
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Inquiries & Saves</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-ink-900">{data?.stats?.student_inquiries ?? 0}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">Interested prospective applicants</p>
        </div>

        <div className="card p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile Impressions</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Eye size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-ink-900">{data?.stats?.profile_views ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Search & comparison directory views</p>
        </div>

        <div className="card p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Listing Status</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-emerald-600">
            {data?.stats?.is_published ? "Published" : "Active"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Verified institution on JoinSchooling</p>
        </div>
      </div>

      {/* Institution Management Modules */}
      <div className="card p-6 border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-ink-900">Institution Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition space-y-2">
            <div className="flex items-center gap-2 text-brand-700 font-semibold text-sm">
              <BookOpen size={16} /> Cutoff & Admission Criteria
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Manage required entrance exam ranks, JEE Main/Advanced and State EAMCET score percentiles for engineering branches.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition space-y-2">
            <div className="flex items-center gap-2 text-brand-700 font-semibold text-sm">
              <Award size={16} /> Placement & Recruiter Statistics
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify campus recruitment packages, highest CTC numbers, and top hiring partner companies for prospective students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
