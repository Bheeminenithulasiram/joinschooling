import Link from "next/link";
import { Bookmark, ArrowRight, MapPin, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import type { CollegeCard } from "@/lib/types";

export const dynamic = "force-dynamic";

const BANNERS = [
  "linear-gradient(135deg,#7c3aed,#0ea5e9)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#0ea5e9)",
  "linear-gradient(135deg,#6366f1,#ec4899)",
];

export default async function SavedCollegesPage() {
  let items: CollegeCard[] = [];
  try {
    items = await api<CollegeCard[]>("/api/v1/me/saved/colleges");
  } catch {
    items = [];
  }

  return (
    <>
      <PageHeader
        eyebrow="Your Personal Shortlist"
        title="Saved Colleges"
        subtitle="Institutions you've bookmarked to compare, review cutoffs, or submit applications."
      />
      <div className="container-page py-10">
        {items.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No colleges saved yet"
            description="Explore NIRF rankings, campus cutoff benchmarks, and fee structures to bookmark institutions to your shortlist."
            actionLabel="Browse Colleges & Cutoffs"
            actionHref="/colleges"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c, i) => (
              <Link
                key={c.id}
                href={`/colleges/${c.slug}`}
                className="card overflow-hidden transition hover:shadow-md hover:border-blue-400 bg-white group cursor-pointer"
              >
                <div className="h-20" style={{ background: BANNERS[i % BANNERS.length] }} />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand">{c.type}</Badge>
                    {c.nirf_rank != null && <Badge variant="amber">NIRF #{c.nirf_rank}</Badge>}
                  </div>
                  <div className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
                    {c.short_name ?? c.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} className="text-slate-400" /> {c.city}, {c.state}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star size={13} className="text-amber-500 fill-amber-500" /> <b className="text-slate-900">{c.rating}</b>
                    </div>
                    {c.avg_package_lpa != null && (
                      <div className="font-bold text-emerald-700">₹{c.avg_package_lpa} LPA avg</div>
                    )}
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
