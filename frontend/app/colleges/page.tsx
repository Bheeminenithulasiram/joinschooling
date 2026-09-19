import Link from "next/link";
import { Search, Filter, MapPin, Star, Building2, Compass, ShieldCheck } from "lucide-react";
import { states, colleges as mockColleges } from "@/lib/mock";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { apiPublic } from "@/lib/api";
import type { PagedColleges } from "@/lib/types";

export const dynamic = "force-dynamic";

const BANNERS = [
  "linear-gradient(135deg,#1e3a8a,#0f172a)",
  "linear-gradient(135deg,#0f2b48,#1e293b)",
  "linear-gradient(135deg,#1e40af,#0369a1)",
  "linear-gradient(135deg,#0f172a,#334155)",
  "linear-gradient(135deg,#0369a1,#0f2b48)",
];

async function fetchColleges(sp: Record<string, string | undefined>): Promise<PagedColleges> {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.state) params.set("state", sp.state);
  if (sp.type) params.set("type", sp.type);
  if (sp.sort) params.set("sort", sp.sort);
  params.set("page_size", "24");

  try {
    const res = await apiPublic<PagedColleges>(`/api/v1/colleges?${params.toString()}`);
    if (res && res.items && res.items.length > 0) return res;
  } catch {}

  // Local filtering fallback
  let items = [...mockColleges];
  const q = sp.q?.toLowerCase();
  const state = sp.state;
  const type = sp.type;
  const sort = sp.sort;

  if (q) {
    items = items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.short_name?.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }
  if (state) items = items.filter((c) => c.state.toLowerCase() === state.toLowerCase());
  if (type) items = items.filter((c) => c.type.toLowerCase() === type.toLowerCase());

  if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
  else if (sort === "avg_package") items.sort((a, b) => (b.avg_package_lpa || 0) - (a.avg_package_lpa || 0));
  else if (sort === "nirf_rank") items.sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
  else if (sort === "fees_asc") items.sort((a, b) => (a.fees_per_year_lpa || 0) - (b.fees_per_year_lpa || 0));
  else if (sort === "fees_desc") items.sort((a, b) => (b.fees_per_year_lpa || 0) - (a.fees_per_year_lpa || 0));

  return {
    items: items.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      short_name: c.short_name,
      city: c.city,
      state: c.state,
      type: c.type,
      nirf_rank: c.nirf_rank,
      avg_package_lpa: c.avg_package_lpa,
      highest_package_lpa: c.highest_package_lpa,
      placement_percent: c.placement_percent,
      fees_per_year_lpa: c.fees_per_year_lpa,
      rating: c.rating,
      reviews_count: c.reviews_count,
      banner_url: c.banner_url,
    })),
    pagination: { page: 1, page_size: 24, total: items.length, has_next: false },
  };
}

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const data = await fetchColleges(sp);

  return (
    <>
      <PageHeader
        eyebrow={`${data.pagination.total.toLocaleString()}+ Verified Institutions`}
        title="Colleges & Cutoffs Directory"
        subtitle="Explore verified NIRF rankings, autonomous and government accreditation, fee structures, and placement track records."
      />

      <div className="container-page py-10 space-y-6">
        {/* Quick Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Quick Filters:</span>
            {[
              { label: "Top NIRF Ranks", query: "sort=nirf_rank" },
              { label: "Highest Package", query: "sort=avg_package" },
              { label: "Autonomous", query: "type=autonomous" },
              { label: "Government / Central", query: "type=government" },
              { label: "Telangana", query: "state=Telangana" },
              { label: "Maharashtra", query: "state=Maharashtra" },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={`/colleges?${tag.query}`}
                className="chip text-xs hover:border-blue-500 hover:text-blue-700"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          <Link
            href="/compare"
            className="btn-outline text-xs inline-flex items-center gap-1.5"
          >
            <Compass size={14} className="text-blue-600" /> Side-by-Side College Comparison
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
          {/* Classic Left Filter Sidebar */}
          <form className="card h-fit p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Filter size={14} className="text-blue-600" /> Filter Directory
              </div>
              <Link href="/colleges" className="text-xs text-blue-600 hover:underline">
                Reset
              </Link>
            </div>

            <div>
              <label className="label">College Name / City</label>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  name="q"
                  defaultValue={sp.q ?? ""}
                  className="input pl-9 text-xs"
                  placeholder="e.g. IIT, VNR, BITS..."
                />
              </div>
            </div>

            <div>
              <label className="label">Institution Type</label>
              <select name="type" defaultValue={sp.type ?? ""} className="input text-xs">
                <option value="">All Types</option>
                <option value="government">Government / Central</option>
                <option value="autonomous">Autonomous</option>
                <option value="deemed">Deemed University</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="label">State / Region</label>
              <select name="state" defaultValue={sp.state ?? ""} className="input text-xs">
                <option value="">All States</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Sort By</label>
              <select name="sort" defaultValue={sp.sort ?? ""} className="input text-xs">
                <option value="">Default Ranking</option>
                <option value="nirf_rank">NIRF Rank (Top First)</option>
                <option value="avg_package">Average Package (High to Low)</option>
                <option value="rating">Rating (Highest)</option>
                <option value="fees_asc">Tuition Fees (Low to High)</option>
                <option value="fees_desc">Tuition Fees (High to Low)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full text-xs py-2 font-semibold">
              Apply Filters
            </button>
          </form>

          {/* Colleges Listing Grid */}
          <div>
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div>
                Showing <b className="text-slate-900">{data.items.length}</b> institutions
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck size={14} /> Official NIRF & NAAC Benchmarks
              </div>
            </div>

            {data.items.length === 0 ? (
              <div className="card grid place-items-center p-14 text-center space-y-3">
                <Building2 className="text-slate-300 mx-auto" size={44} />
                <h3 className="font-display text-base font-bold text-slate-900">No institutions found</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  No colleges matched your selected filter criteria. Try clearing search keywords.
                </p>
                <Link href="/colleges" className="btn-primary text-xs mt-2">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {data.items.map((c, i) => (
                  <Link
                    key={c.id}
                    href={`/colleges/${c.slug}`}
                    className="group card overflow-hidden hover:border-blue-500 hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="relative h-28 p-4 text-white flex flex-col justify-between"
                        style={{ background: BANNERS[i % BANNERS.length] }}
                      >
                        <div className="flex items-start justify-between">
                          <span className="rounded bg-black/50 px-2 py-0.5 text-xs font-bold">
                            NIRF #{c.nirf_rank || "—"}
                          </span>
                          <span className="rounded bg-white text-slate-900 px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                            <Star size={12} className="text-amber-500 fill-amber-500" /> {c.rating}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-200">
                          {c.city}, {c.state}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                              {c.short_name || c.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <MapPin size={12} className="text-slate-400 shrink-0" /> {c.city}, {c.state}
                            </div>
                          </div>
                          <Badge variant="brand" className="shrink-0 text-[10px] capitalize">
                            {c.type}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                          <div className="rounded-lg bg-slate-50 p-2">
                            <div className="text-xs font-bold text-blue-700">₹{c.avg_package_lpa || "—"}L</div>
                            <div className="text-[10px] uppercase text-slate-400 font-semibold">Avg Pkg</div>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-2">
                            <div className="text-xs font-bold text-emerald-700">{c.placement_percent || "—"}%</div>
                            <div className="text-[10px] uppercase text-slate-400 font-semibold">Placement</div>
                          </div>
                          <div className="rounded-lg bg-slate-50 p-2">
                            <div className="text-xs font-bold text-slate-800">₹{c.fees_per_year_lpa || "2.5"}L</div>
                            <div className="text-[10px] uppercase text-slate-400 font-semibold">Fees / yr</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-4 pt-1 flex items-center justify-between border-t border-slate-50 text-xs font-bold text-blue-600">
                      <span>View Courses & Admissions</span>
                      <span>→</span>
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
