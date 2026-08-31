import Link from "next/link";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { states } from "@/lib/mock";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { apiPublic } from "@/lib/api";
import type { PagedColleges } from "@/lib/types";

export const dynamic = "force-dynamic";

const BANNERS = [
  "linear-gradient(135deg,#7c3aed,#0ea5e9)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#0ea5e9)",
  "linear-gradient(135deg,#6366f1,#ec4899)",
  "linear-gradient(135deg,#0ea5e9,#22d3ee)",
  "linear-gradient(135deg,#a855f7,#3b82f6)",
];

async function fetchColleges(sp: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.state) params.set("state", sp.state);
  if (sp.type) params.set("type", sp.type);
  if (sp.sort) params.set("sort", sp.sort);
  params.set("page_size", "24");
  try {
    return await apiPublic<PagedColleges>(`/api/v1/colleges?${params.toString()}`);
  } catch (e) {
    return { items: [], pagination: { page: 1, page_size: 24, total: 0, has_next: false }, _err: true };
  }
}

export default async function CollegesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const data = await fetchColleges(sp);

  return (
    <>
      <PageHeader eyebrow={`${data.pagination.total.toLocaleString()}+ colleges`} title="Find your college" subtitle="Filter by NIRF rank, location, placement, fees and more." />
      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <form className="card h-fit p-5">
            <div className="flex items-center gap-2 text-sm font-bold"><Filter size={14} /> Filters</div>
            <div className="mt-5">
              <label className="label">Search</label>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-3 text-ink-300" />
                <input name="q" defaultValue={sp.q ?? ""} className="input pl-9" placeholder="e.g. IIT" />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Type</label>
              <select name="type" defaultValue={sp.type ?? ""} className="input">
                <option value="">Any</option>
                <option value="government">Government</option>
                <option value="private">Private</option>
                <option value="deemed">Deemed</option>
                <option value="autonomous">Autonomous</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="label">State</label>
              <select name="state" defaultValue={sp.state ?? ""} className="input">
                <option value="">Any</option>
                {states.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mt-4">
              <label className="label">Sort</label>
              <select name="sort" defaultValue={sp.sort ?? ""} className="input">
                <option value="">Best match</option>
                <option value="rating">Rating</option>
                <option value="avg_package">Avg package</option>
                <option value="nirf_rank">NIRF rank</option>
                <option value="fees_asc">Fees (low → high)</option>
                <option value="fees_desc">Fees (high → low)</option>
              </select>
            </div>
            <button className="btn-primary mt-5 w-full">Apply filters</button>
          </form>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-ink-500">Showing <b>{data.items.length}</b> of {data.pagination.total.toLocaleString()}</div>
            </div>
            {data.items.length === 0 ? (
              <div className="card grid place-items-center p-14 text-center">
                <div>
                  <div className="font-display text-lg font-bold">No colleges match</div>
                  <div className="mt-1 text-sm text-ink-500">Try relaxing your filters.</div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {data.items.map((c, i) => (
                  <Link key={c.id} href={`/colleges/${c.slug}`} className="group card overflow-hidden transition hover:shadow-glow">
                    <div className="relative h-32" style={c.banner_url ? { backgroundImage: `url(${c.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: BANNERS[i % BANNERS.length] }}>
                      <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold"><Star size={12} className="text-amber-500" /> {c.rating} ({c.reviews_count})</div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-display text-lg font-bold group-hover:text-brand-700">{c.short_name ?? c.name}</div>
                        {c.nirf_rank && <Badge variant="slate">#{c.nirf_rank}</Badge>}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-ink-500"><MapPin size={12} /> {c.city}, {c.state}</div>
                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                        <div><div className="text-base font-bold text-brand-700">₹{c.avg_package_lpa ?? "—"}L</div><div className="text-[10px] uppercase text-ink-500">Avg pkg</div></div>
                        <div><div className="text-base font-bold text-emerald-600">{c.placement_percent ?? "—"}%</div><div className="text-[10px] uppercase text-ink-500">Placed</div></div>
                        <div><div className="text-base font-bold text-amber-600">{c.type}</div><div className="text-[10px] uppercase text-ink-500">Type</div></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
