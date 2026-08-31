import Link from "next/link";
import { Bookmark, ArrowRight, MapPin, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { CollegeCard } from "@/lib/types";

export const dynamic = "force-dynamic";

const BANNERS = [
  "linear-gradient(135deg,#7c3aed,#0ea5e9)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#0ea5e9)",
  "linear-gradient(135deg,#6366f1,#ec4899)",
];

const DEMO: CollegeCard[] = [
  { id: "1", slug: "iit-bombay",     name: "IIT Bombay",     short_name: "IITB",    city: "Mumbai",     state: "Maharashtra", type: "government", nirf_rank: 3,   avg_package_lpa: 21.8, placement_percent: 98, rating: 4.9, reviews_count: 5420 },
  { id: "2", slug: "iiit-hyderabad", name: "IIIT Hyderabad", short_name: "IIIT-H",  city: "Hyderabad",  state: "Telangana",   type: "deemed",     nirf_rank: 47,  avg_package_lpa: 26.4, placement_percent: 99, rating: 4.8, reviews_count: 3100 },
  { id: "3", slug: "bits-pilani",    name: "BITS Pilani",    short_name: "BITS",    city: "Pilani",     state: "Rajasthan",   type: "deemed",     nirf_rank: 25,  avg_package_lpa: 18.9, placement_percent: 96, rating: 4.7, reviews_count: 4210 },
];

export default async function SavedCollegesPage() {
  let items: CollegeCard[] = DEMO;
  let isDemo = true;
  try {
    items = await api<CollegeCard[]>("/api/v1/me/saved/colleges");
    isDemo = false;
  } catch { /* keep demo */ }

  return (
    <>
      <PageHeader eyebrow="Your shortlist" title="Saved colleges" subtitle="Colleges you've bookmarked to review later." />
      <div className="container-page py-10">
        {isDemo && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <b>Demo data</b> — log in to see your saved shortlist.
          </div>
        )}

        {items.length === 0 ? (
          <div className="card grid place-items-center p-14 text-center">
            <Bookmark className="text-ink-300" size={40} />
            <div className="mt-3 font-display text-lg font-bold">Nothing saved yet</div>
            <div className="mt-1 max-w-sm text-sm text-ink-500">Bookmark colleges as you browse to build your shortlist here.</div>
            <Link href="/colleges" className="btn-primary mt-4">Browse colleges <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <Link key={c.id} href={`/colleges/${c.slug}`} className="card overflow-hidden transition hover:shadow-glow">
                <div className="h-20" style={{ background: BANNERS[i % BANNERS.length] }} />
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">{c.type}</Badge>
                    {c.nirf_rank != null && <Badge variant="amber">NIRF #{c.nirf_rank}</Badge>}
                  </div>
                  <div className="mt-2 font-display text-lg font-bold">{c.short_name ?? c.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-ink-500"><MapPin size={12}/> {c.city}, {c.state}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> <b>{c.rating}</b></div>
                    {c.avg_package_lpa != null && <div className="font-semibold text-brand-700">₹{c.avg_package_lpa} LPA avg</div>}
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
