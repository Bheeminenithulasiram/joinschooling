import Link from "next/link";
import { Briefcase, ArrowRight, Sparkles, Clock, CheckCircle2, Building2, GraduationCap, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Timestamp } from "@/components/ui/Timestamp";
import { api } from "@/lib/api";
import type { ApplicationOut } from "@/lib/types";

export const dynamic = "force-dynamic";

interface EnrichedApplication {
  id: string;
  title: string;
  organization: string;
  type: "internship" | "college";
  status: "submitted" | "under_review" | "shortlisted" | "interview" | "selected" | "offered" | "rejected";
  submitted_at: string;
  slug: string;
  note: string;
}

const STATUS_BADGE: Record<string, { label: string; variant: "brand" | "amber" | "green" | "blue" }> = {
  submitted: { label: "Submitted", variant: "blue" },
  under_review: { label: "Under Review", variant: "amber" },
  shortlisted: { label: "Shortlisted", variant: "green" },
  interview: { label: "Interview Round", variant: "amber" },
  selected: { label: "Selected / Offered", variant: "green" },
  offered: { label: "Offer Received", variant: "green" },
  rejected: { label: "Archived", variant: "brand" },
};

export default async function ApplicationsPage() {
  let items: EnrichedApplication[] = [];

  try {
    const res = await api<ApplicationOut[]>("/api/v1/me/applications");
    if (res && res.length > 0) {
      items = res.map((r, i) => ({
        id: r.id || `app-${i}`,
        title: r.target_kind === "internship" ? "Tech Internship Application" : "College Admissions Counseling",
        organization: r.target_id || "Participating Organization",
        type: (r.target_kind as any) || "internship",
        status: (r.status as any) || "submitted",
        submitted_at: r.submitted_at || new Date().toISOString(),
        slug: r.target_id || "internship",
        note: `Real-time status: ${r.status.replace("_", " ")}`,
      }));
    }
  } catch {
    items = [];
  }

  const stats = {
    total: items.length,
    underReview: items.filter((i) => i.status === "under_review" || i.status === "interview").length,
    shortlisted: items.filter((i) => i.status === "shortlisted" || i.status === "selected" || i.status === "offered").length,
  };

  return (
    <>
      <PageHeader
        eyebrow="Real-Time Status Tracker"
        title="My Applications & Inquiries"
        subtitle="Track every internship application and college admissions inquiry in real-time with recruiter review notes and next steps."
      />

      <div className="container-page py-10 space-y-8">
        {/* KPI Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5 border-slate-200 shadow-sm bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Submitted</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-slate-900">{stats.total} Applications</div>
            <span className="text-xs text-slate-500">Across colleges & top tech drives</span>
          </div>

          <div className="card p-5 border-slate-200 shadow-sm bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Under Review</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-amber-900">{stats.underReview} In Screening</div>
            <span className="text-xs text-amber-600">Recruiters currently reviewing profiles</span>
          </div>

          <div className="card p-5 border-slate-200 shadow-sm bg-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Shortlisted / Offered</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-emerald-900">{stats.shortlisted} Positive Next Steps</div>
            <span className="text-xs text-emerald-600">Interviews & seat offers</span>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Active Applications & Inquiries</h2>
            <Link href="/internships" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Explore More Drives <ArrowRight size={13} />
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="card grid place-items-center p-14 text-center border-slate-200 shadow-sm bg-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                <Briefcase size={28} />
              </div>
              <div className="font-display text-lg font-bold text-slate-900">No applications submitted yet</div>
              <div className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
                When you apply to verified campus drives or college programs, their real-time interview stages will be tracked here.
              </div>
              <Link href="/internships" className="btn-primary mt-5 text-xs font-bold py-2.5 px-5 inline-flex items-center gap-2">
                Browse Verified Internships <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((app) => (
                <div
                  key={app.id}
                  className="card p-5 hover:border-blue-300 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-slate-200 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
                        app.type === "internship"
                          ? "bg-gradient-to-br from-blue-600 to-indigo-700"
                          : "bg-gradient-to-br from-emerald-600 to-teal-700"
                      }`}
                    >
                      {app.type === "internship" ? <Briefcase size={22} /> : <GraduationCap size={22} />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-bold text-slate-900">{app.title}</span>
                        <Badge variant={STATUS_BADGE[app.status]?.variant || "blue"}>
                          {STATUS_BADGE[app.status]?.label || app.status}
                        </Badge>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{app.organization}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> <Timestamp iso={app.submitted_at} mode="date" />
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5">
                        <Sparkles size={12} className="text-blue-600 shrink-0" />
                        <span>{app.note}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <Link
                      href={app.type === "internship" ? `/internships/${app.slug}` : `/colleges/${app.slug}`}
                      className="btn-outline py-2 px-3 text-xs font-bold flex items-center gap-1"
                    >
                      View Role Details <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Boost Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-indigo-950 p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold">
              <Sparkles size={13} /> Boost Your Match Odds
            </div>
            <h3 className="font-display text-xl font-bold">Want to rank in the top 10% of applicants?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Use our AI College & Internship Finder to compute your exact percentile score, cutoff match probability, and personalized skill gap fixes.
            </p>
          </div>

          <Link
            href="/ai-finder"
            className="btn bg-white hover:bg-slate-100 text-brand-900 font-bold px-6 py-3 rounded-xl text-xs shrink-0 shadow-lg flex items-center gap-2"
          >
            Launch AI Finder <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
