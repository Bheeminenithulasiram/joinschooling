import Link from "next/link";
import { Bookmark, ArrowRight, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { InternshipCard } from "@/lib/types";

export const dynamic = "force-dynamic";

const NOW = new Date().toISOString();
const DEMO: InternshipCard[] = [
  { id: "d1", slug: "amazon-sde-intern",  title: "SDE Intern",              company: { id: "c1", name: "Amazon",    slug: "amazon" },    location_city: "Bengaluru", work_mode: "hybrid",  duration_months: 6, stipend_min: 60000, stipend_max: 90000, domain: "Software", posted_at: NOW },
  { id: "d2", slug: "microsoft-swe",      title: "Software Engineer Intern",company: { id: "c2", name: "Microsoft", slug: "microsoft" }, location_city: "Hyderabad", work_mode: "onsite",  duration_months: 3, stipend_min: 80000, stipend_max: 120000, domain: "Software", posted_at: NOW },
  { id: "d3", slug: "flipkart-data",      title: "Data Science Intern",     company: { id: "c3", name: "Flipkart",  slug: "flipkart" },  location_city: "Bengaluru", work_mode: "onsite",  duration_months: 6, stipend_min: 50000, stipend_max: 75000, domain: "Data", posted_at: NOW },
];

export default async function SavedInternshipsPage() {
  let items: InternshipCard[] = DEMO;
  let isDemo = true;
  try {
    items = await api<InternshipCard[]>("/api/v1/me/saved/internships");
    isDemo = false;
  } catch { /* keep demo */ }

  return (
    <>
      <PageHeader eyebrow="Your shortlist" title="Saved internships" subtitle="Roles you've bookmarked. Apply before deadlines close." />
      <div className="container-page py-10">
        {isDemo && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <b>Demo data</b> — log in to see your saved roles.
          </div>
        )}

        {items.length === 0 ? (
          <div className="card grid place-items-center p-14 text-center">
            <Bookmark className="text-ink-300" size={40} />
            <div className="mt-3 font-display text-lg font-bold">Nothing saved yet</div>
            <div className="mt-1 max-w-sm text-sm text-ink-500">Bookmark internships as you browse to build your shortlist.</div>
            <Link href="/internships" className="btn-primary mt-4">Browse internships <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((i) => (
              <Link key={i.id} href={`/internships/${i.slug}`} className="card p-5 transition hover:shadow-glow">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">💼</div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-display text-lg font-bold">{i.title}</div>
                      <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>{i.work_mode}</Badge>
                    </div>
                    <div className="text-sm text-ink-500">{i.company?.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-500">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {i.location_city ?? "Remote"}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {i.duration_months} months</span>
                      <span>{i.domain}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {i.stipend_max && (
                      <>
                        <div className="text-lg font-bold text-brand-700">₹{i.stipend_min?.toLocaleString()}–{i.stipend_max?.toLocaleString()}</div>
                        <div className="text-xs text-ink-500">per month</div>
                      </>
                    )}
                    <div className="btn-primary mt-3">View</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
