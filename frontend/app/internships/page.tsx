import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { domains } from "@/lib/mock";
import { Search, MapPin, Clock } from "lucide-react";
import { apiPublic } from "@/lib/api";
import type { PagedInternships } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchInternships(sp: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.domain) params.set("domain", sp.domain);
  if (sp.work_mode) params.set("work_mode", sp.work_mode);
  if (sp.min_stipend) params.set("min_stipend", sp.min_stipend);
  if (sp.sort) params.set("sort", sp.sort);
  params.set("page_size", "24");
  try {
    return await apiPublic<PagedInternships>(`/api/v1/internships?${params.toString()}`);
  } catch {
    return { items: [], pagination: { page: 1, page_size: 24, total: 0, has_next: false } };
  }
}

const LOGO_FALLBACK = "💼";

export default async function InternshipsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const data = await fetchInternships(sp);

  return (
    <>
      <PageHeader eyebrow="Hiring now" title="Internships" subtitle="Apply to internships at top companies — filter by domain, mode and stipend." />
      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <form className="card h-fit p-5">
            <div className="text-sm font-bold">Filters</div>
            <div className="mt-4">
              <label className="label">Search</label>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-3 text-ink-300" />
                <input name="q" defaultValue={sp.q ?? ""} className="input pl-9" placeholder="e.g. SDE" />
              </div>
            </div>
            <div className="mt-4">
              <label className="label">Work mode</label>
              <select name="work_mode" defaultValue={sp.work_mode ?? ""} className="input">
                <option value="">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="label">Domain</label>
              <select name="domain" defaultValue={sp.domain ?? ""} className="input">
                <option value="">Any</option>
                {domains.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="mt-4">
              <label className="label">Min stipend (₹/mo)</label>
              <input name="min_stipend" type="number" step={1000} defaultValue={sp.min_stipend ?? ""} className="input" placeholder="0" />
            </div>
            <div className="mt-4">
              <label className="label">Sort</label>
              <select name="sort" defaultValue={sp.sort ?? ""} className="input">
                <option value="">Most recent</option>
                <option value="stipend_desc">Highest stipend</option>
                <option value="deadline">Deadline soon</option>
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
                  <div className="font-display text-lg font-bold">No internships match</div>
                  <div className="mt-1 text-sm text-ink-500">Try relaxing your filters.</div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {data.items.map((i) => (
                  <Link key={i.id} href={`/internships/${i.slug}`} className="card p-5 transition hover:shadow-glow">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl overflow-hidden border border-slate-200/50">
                        {i.company?.logo_url ? (
                          <img src={i.company.logo_url} alt={i.company.name} className="h-full w-full object-contain p-1.5" />
                        ) : (
                          LOGO_FALLBACK
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-display text-lg font-bold">{i.title}</div>
                          <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>{i.work_mode}</Badge>
                        </div>
                        <div className="text-sm text-ink-500">{i.company?.name ?? "—"}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-ink-500">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {i.location_city ?? "Remote"}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {i.duration_months} months</span>
                          <span className="flex items-center gap-1">{i.domain}</span>
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
        </div>
      </div>
    </>
  );
}
