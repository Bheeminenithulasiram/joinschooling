import Link from "next/link";
import { Briefcase, ArrowRight, Sparkles, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Timestamp } from "@/components/ui/Timestamp";
import { api } from "@/lib/api";
import type { ApplicationOut } from "@/lib/types";

export const dynamic = "force-dynamic";

const DEMO: ApplicationOut[] = [
  { id: "d1", target_kind: "internship", target_id: "amazon-sde",     status: "under_review", submitted_at: new Date().toISOString() },
  { id: "d2", target_kind: "internship", target_id: "microsoft-swe",  status: "submitted",    submitted_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "d3", target_kind: "internship", target_id: "flipkart-data",  status: "shortlisted",  submitted_at: new Date(Date.now() - 3*86400000).toISOString() },
  { id: "d4", target_kind: "college",    target_id: "iit-bombay",     status: "submitted",    submitted_at: new Date(Date.now() - 6*86400000).toISOString() },
];

const STATUS_TINT: Record<string, "brand" | "amber" | "green" | "blue"> = {
  submitted: "blue",
  under_review: "amber",
  shortlisted: "green",
  offered: "green",
  rejected: "brand",
  withdrawn: "brand",
};

export default async function ApplicationsPage() {
  let items: ApplicationOut[] = DEMO;
  let isDemo = true;
  try {
    items = await api<ApplicationOut[]>("/api/v1/me/applications");
    isDemo = false;
  } catch { /* keep demo */ }

  const grouped = items.reduce<Record<string, ApplicationOut[]>>((acc, a) => {
    (acc[a.status] ??= []).push(a);
    return acc;
  }, {});

  const order = ["submitted", "under_review", "shortlisted", "offered", "rejected", "withdrawn"];

  return (
    <>
      <PageHeader eyebrow="Track everything" title="Your applications" subtitle="Every application you've made across internships and colleges — grouped by stage." />
      <div className="container-page py-10">
        {isDemo && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <b>Demo data</b> — log in to view your real applications.
          </div>
        )}

        {items.length === 0 ? (
          <div className="card grid place-items-center p-14 text-center">
            <Briefcase className="text-ink-300" size={40} />
            <div className="mt-3 font-display text-lg font-bold">No applications yet</div>
            <div className="mt-1 max-w-sm text-sm text-ink-500">Discover roles you love and apply in one click.</div>
            <Link href="/internships" className="btn-primary mt-4">Find internships <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {order.filter((s) => grouped[s]?.length).map((status) => (
              <section key={status} className="card p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant={STATUS_TINT[status] ?? "brand"}>{status.replace("_", " ")}</Badge>
                  <span className="text-xs text-ink-500">{grouped[status].length}</span>
                </div>
                <ul className="space-y-3">
                  {grouped[status].map((a) => (
                    <li key={a.id} className="rounded-xl border border-slate-100 p-3 transition hover:border-brand-300">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold capitalize">{a.target_kind.replace("_", " ")}</div>
                        <div className="text-xs text-ink-500 flex items-center gap-1"><Clock size={11}/> <Timestamp iso={a.submitted_at} mode="date" /></div>
                      </div>
                      <div className="mt-1 truncate text-xs text-ink-500">{a.target_id}</div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand-700 to-accent-500 p-6 text-white">
          <div className="flex items-center gap-2"><Sparkles size={16} /><span className="text-xs font-semibold uppercase tracking-wider">Improve odds</span></div>
          <div className="mt-2 font-display text-lg font-bold">Run AI Finder to see roles where you'd rank in the top 20%.</div>
          <Link href="/ai-finder" className="btn mt-4 bg-white text-brand-700">Open AI Finder <ArrowRight size={16} /></Link>
        </div>
      </div>
    </>
  );
}
