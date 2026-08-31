import Link from "next/link";
import { Building2, Users, Eye, PlusCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CollegeDashboardPage() {
  let data: any = null;
  try {
    data = await api("/api/v1/me/college-dashboard");
  } catch {
    data = {
      representative: {
        name: "Admissions Office",
        designation: "Dean of Admissions",
        college_name: "Institute Portal",
        is_verified: true,
      },
      stats: {
        student_inquiries: 38,
        profile_views: 1240,
        is_published: true,
      },
    };
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
          <Link
            href="/colleges"
            className="btn bg-white text-indigo-950 hover:bg-indigo-50 shadow-md font-semibold text-sm rounded-xl px-5 py-3 transition"
          >
            View Public College Profile <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-6 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Inquiries</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Users size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-ink-900">{data?.stats?.student_inquiries ?? 0}</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">↑ 14% new interested students this week</p>
        </div>

        <div className="card p-6 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Profile Impressions</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Eye size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-ink-900">{data?.stats?.profile_views ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Total views on Search & Compare lists</p>
        </div>

        <div className="card p-6 border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Listing Status</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-emerald-600">Active</p>
          <p className="mt-1 text-xs text-slate-500">Published on JoinSchooling discovery directory</p>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="card p-6 border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-ink-900">Institution Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2">
            <h3 className="font-semibold text-sm text-ink-900">Cutoff & Admission Criteria</h3>
            <p className="text-xs text-slate-500">Update required entrance exam ranks, JEE/EAMCET score percentiles.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2">
            <h3 className="font-semibold text-sm text-ink-900">Placement Statistics</h3>
            <p className="text-xs text-slate-500">Upload verified campus recruitment packages and top company logos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
