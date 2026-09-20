import Link from "next/link";
import { Bookmark, ArrowRight, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { InternshipCard } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SavedInternshipsPage() {
  let items: InternshipCard[] = [];
  try {
    items = await api<InternshipCard[]>("/api/v1/me/saved/internships");
  } catch {
    items = [];
  }

  return (
    <>
      <PageHeader
        eyebrow="Your Career Shortlist"
        title="Saved Internships & Jobs"
        subtitle="Opportunities you've bookmarked to review requirements and apply before deadlines close."
      />
      <div className="container-page py-10">
        {items.length === 0 ? (
          <div className="card grid place-items-center p-14 text-center border-slate-200 shadow-sm bg-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-3">
              <Bookmark size={28} />
            </div>
            <div className="font-display text-lg font-bold text-slate-900">No internships saved yet</div>
            <div className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
              Explore verified tech drives, AI research, and campus opportunities with transparent stipends to save roles here.
            </div>
            <Link href="/internships" className="btn-primary mt-5 text-xs font-bold py-2.5 px-5 inline-flex items-center gap-2">
              Browse Internships & Jobs <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((i) => (
              <Link
                key={i.id}
                href={`/internships/${i.slug}`}
                className="card p-5 transition hover:shadow-md hover:border-blue-400 bg-white group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-sm">
                    {i.company?.name ? i.company.name.slice(0, 2).toUpperCase() : "INT"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-display text-base font-bold text-slate-900 group-hover:text-blue-700 transition">
                        {i.title}
                      </div>
                      <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>
                        {i.work_mode}
                      </Badge>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">{i.company?.name}</div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" /> {i.location_city ?? "Remote"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" /> {i.duration_months} months
                      </span>
                      <span className="font-medium text-blue-600">{i.domain}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {i.stipend_max && (
                      <div>
                        <div className="text-base font-bold text-emerald-700">
                          ₹{i.stipend_min?.toLocaleString()}–{i.stipend_max?.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">per month</div>
                      </div>
                    )}
                    <div className="btn-outline text-xs py-1 px-3 mt-2 font-bold group-hover:bg-blue-600 group-hover:text-white transition">
                      View Role →
                    </div>
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
