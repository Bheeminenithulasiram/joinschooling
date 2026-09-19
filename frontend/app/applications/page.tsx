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
  status: "submitted" | "under_review" | "shortlisted" | "offered" | "rejected";
  submitted_at: string;
  slug: string;
  note: string;
}

const DEMO_APPLICATIONS: EnrichedApplication[] = [
  {
    id: "app-1",
    title: "Software Development Engineer (SDE) Intern",
    organization: "Amazon India",
    type: "internship",
    status: "under_review",
    submitted_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
    slug: "amazon-sde-intern",
    note: "Recruiter screened resume • Scheduled for Online Coding Assessment",
  },
  {
    id: "app-2",
    title: "B.Tech Computer Science & Engineering",
    organization: "IIT Bombay",
    type: "college",
    status: "submitted",
    submitted_at: new Date(Date.now() - 24 * 3600_000).toISOString(),
    slug: "iit-bombay",
    note: "JEE Advanced rank verified • Awaiting counseling seat allocation",
  },
  {
    id: "app-3",
    title: "Software Engineer Intern (Summer 2026)",
    organization: "Microsoft",
    type: "internship",
    status: "shortlisted",
    submitted_at: new Date(Date.now() - 3 * 86400_000).toISOString(),
    slug: "microsoft-swe-intern",
    note: "Shortlisted for Technical Interview Round 1 (DSA & Problem Solving)",
  },
  {
    id: "app-4",
    title: "B.Tech Computer Science (AI & Data Science)",
    organization: "VNR VJIET Hyderabad",
    type: "college",
    status: "offered",
    submitted_at: new Date(Date.now() - 5 * 86400_000).toISOString(),
    slug: "vnr-vjiet",
    note: "Admission Offer Letter generated • Verification due in 7 days",
  },
  {
    id: "app-5",
    title: "Data Science & Analytics Intern",
    organization: "Flipkart",
    type: "internship",
    status: "submitted",
    submitted_at: new Date(Date.now() - 7 * 86400_000).toISOString(),
    slug: "flipkart-data-intern",
    note: "Application received by Flipkart University Relations team",
  },
];

const STATUS_BADGE: Record<string, { label: string; variant: "brand" | "amber" | "green" | "blue" }> = {
  submitted: { label: "Submitted", variant: "blue" },
  under_review: { label: "Under Review", variant: "amber" },
  shortlisted: { label: "Shortlisted", variant: "green" },
  offered: { label: "Offer Received", variant: "green" },
  rejected: { label: "Archived", variant: "brand" },
};

export default async function ApplicationsPage() {
  let items = DEMO_APPLICATIONS;

  try {
    const res = await api<ApplicationOut[]>("/api/v1/me/applications");
    if (res && res.length > 0) {
      // Map API applications if present
      items = res.map((r, i) => ({
        id: r.id || `app-${i}`,
        title: r.target_kind === "internship" ? "Internship Application" : "Admissions Application",
        organization: r.target_id,
        type: (r.target_kind as any) || "internship",
        status: (r.status as any) || "submitted",
        submitted_at: r.submitted_at || new Date().toISOString(),
        slug: r.target_id,
        note: "Tracked in real-time on EduConnect portal",
      }));
    }
  } catch {}

  const stats = {
    total: items.length,
    underReview: items.filter((i) => i.status === "under_review").length,
    shortlisted: items.filter((i) => i.status === "shortlisted" || i.status === "offered").length,
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
          <div className="glass-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Submitted</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-slate-900">{stats.total} Applications</div>
            <span className="text-xs text-slate-500">Across colleges & top tech drives</span>
          </div>

          <div className="glass-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Under Review</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-amber-950">{stats.underReview} In Screening</div>
            <span className="text-xs text-amber-600">Recruiters currently reviewing profiles</span>
          </div>

          <div className="glass-card p-5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Shortlisted / Offered</span>
            <div className="mt-1 font-display text-2xl font-extrabold text-emerald-950">{stats.shortlisted} Positive Next Steps</div>
            <span className="text-xs text-emerald-600">Interviews & seat offers</span>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Active Applications & Inquiries</h2>
            <Link href="/internships" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              Explore More Drives <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {items.map((app) => (
              <div
                key={app.id}
                className="glass-card p-5 hover:border-brand-300 transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${
                      app.type === "internship"
                        ? "bg-gradient-to-br from-indigo-500 to-brand-600"
                        : "bg-gradient-to-br from-brand-600 to-accent-600"
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
                      <Sparkles size={12} className="text-brand-600 shrink-0" />
                      <span>{app.note}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    href={app.type === "internship" ? `/internships/${app.slug}` : `/colleges/${app.slug}`}
                    className="btn-outline py-2 px-3 text-xs font-bold flex items-center gap-1"
                  >
                    View Details <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
