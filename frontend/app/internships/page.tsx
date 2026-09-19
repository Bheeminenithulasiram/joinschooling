import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { domains, internships as mockInternships } from "@/lib/mock";
import { Search, MapPin, Clock, Filter, Briefcase, Building2, CheckCircle2 } from "lucide-react";
import { apiPublic } from "@/lib/api";
import type { PagedInternships } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchInternships(sp: Record<string, string | undefined>): Promise<PagedInternships> {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.domain) params.set("domain", sp.domain);
  if (sp.work_mode) params.set("work_mode", sp.work_mode);
  if (sp.min_stipend) params.set("min_stipend", sp.min_stipend);
  if (sp.sort) params.set("sort", sp.sort);
  params.set("page_size", "24");

  try {
    const res = await apiPublic<PagedInternships>(`/api/v1/internships?${params.toString()}`);
    if (res && res.items && res.items.length > 0) return res;
  } catch {}

  // Local fallback
  let items = [...mockInternships];
  const q = sp.q?.toLowerCase();
  const domain = sp.domain;
  const work_mode = sp.work_mode;
  const min_stipend = sp.min_stipend ? Number(sp.min_stipend) : null;
  const sort = sp.sort;

  if (q) {
    items = items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.company.toLowerCase().includes(q) ||
        i.skills.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (domain) items = items.filter((i) => i.domain.toLowerCase() === domain.toLowerCase());
  if (work_mode) items = items.filter((i) => i.work_mode === work_mode);
  if (min_stipend) items = items.filter((i) => i.stipend_min >= min_stipend);

  if (sort === "stipend_desc") items.sort((a, b) => b.stipend_max - a.stipend_max);
  else if (sort === "deadline") items.sort((a, b) => new Date(a.apply_deadline).getTime() - new Date(b.apply_deadline).getTime());

  return {
    items: items.map((i) => ({
      id: i.id,
      slug: i.slug,
      title: i.title,
      domain: i.domain,
      work_mode: i.work_mode,
      duration_months: i.duration_months,
      stipend_min: i.stipend_min,
      stipend_max: i.stipend_max,
      location_city: i.city,
      posted_at: i.posted_at,
      apply_deadline: i.apply_deadline,
      company: { id: i.company, name: i.company, slug: i.company.toLowerCase() },
    })),
    pagination: { page: 1, page_size: 24, total: items.length, has_next: false },
  };
}

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const data = await fetchInternships(sp);

  return (
    <>
      <PageHeader
        eyebrow={`${data.pagination.total.toLocaleString()}+ Verified Openings`}
        title="Internships & Campus Hiring Drives"
        subtitle="Explore verified tech, data science, and product internships from verified enterprise and high-growth employers."
      />

      <div className="container-page py-10 space-y-6">
        {/* Quick Domain Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Domains:</span>
            {domains.map((d) => (
              <Link
                key={d}
                href={`/internships?domain=${d}`}
                className="chip text-xs hover:border-blue-500 hover:text-blue-700"
              >
                {d}
              </Link>
            ))}
          </div>

          <Link
            href="/dashboard/recruiter"
            className="btn-outline text-xs inline-flex items-center gap-1.5"
          >
            <Building2 size={14} className="text-blue-600" /> Are you an Employer? Post a Drive
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
          {/* Filters Form */}
          <form className="card h-fit p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Filter size={14} className="text-blue-600" /> Filter Roles
              </div>
              <Link href="/internships" className="text-xs text-blue-600 hover:underline">
                Reset
              </Link>
            </div>

            <div>
              <label className="label">Search Role / Skill</label>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  name="q"
                  defaultValue={sp.q ?? ""}
                  className="input pl-9 text-xs"
                  placeholder="e.g. SDE, Python, React..."
                />
              </div>
            </div>

            <div>
              <label className="label">Work Mode</label>
              <select name="work_mode" defaultValue={sp.work_mode ?? ""} className="input text-xs">
                <option value="">All Modes</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>

            <div>
              <label className="label">Domain</label>
              <select name="domain" defaultValue={sp.domain ?? ""} className="input text-xs">
                <option value="">All Domains</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Min Stipend (₹/mo)</label>
              <input
                name="min_stipend"
                type="number"
                step={5000}
                defaultValue={sp.min_stipend ?? ""}
                className="input text-xs"
                placeholder="e.g. 50000"
              />
            </div>

            <div>
              <label className="label">Sort By</label>
              <select name="sort" defaultValue={sp.sort ?? ""} className="input text-xs">
                <option value="">Recently Posted</option>
                <option value="stipend_desc">Highest Stipend</option>
                <option value="deadline">Application Deadline</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full text-xs py-2 font-semibold">
              Apply Filters
            </button>
          </form>

          {/* Internships List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-1">
              <div>
                Showing <b className="text-slate-900">{data.items.length}</b> verified opportunities
              </div>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 size={13} /> PPO Conversion Opportunities
              </span>
            </div>

            {data.items.length === 0 ? (
              <div className="card grid place-items-center p-14 text-center space-y-3">
                <Briefcase className="text-slate-300 mx-auto" size={44} />
                <h3 className="font-display text-base font-bold text-slate-900">No internships matched</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Try adjusting your search criteria or clearing filters.
                </p>
                <Link href="/internships" className="btn-primary text-xs mt-2">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {data.items.map((i) => (
                  <Link
                    key={i.id}
                    href={`/internships/${i.slug}`}
                    className="card p-5 hover:border-blue-400 hover:shadow-sm transition duration-150 block group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-800 text-sm">
                          {i.company?.name ? i.company.name.substring(0, 2).toUpperCase() : "CO"}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                              {i.title}
                            </h3>
                            <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>
                              {i.work_mode}
                            </Badge>
                          </div>

                          <p className="text-xs font-semibold text-slate-700">
                            {i.company?.name || "Tech Employer"} · <span className="text-slate-500">{i.location_city || "Pan India"}</span>
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {i.location_city || "Remote"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {i.duration_months} Months</span>
                            <span>•</span>
                            <span className="text-slate-700 font-medium">{i.domain}</span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                        {i.stipend_max && (
                          <div>
                            <div className="font-display text-base font-bold text-blue-700">
                              ₹{i.stipend_min?.toLocaleString()}–{i.stipend_max?.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-semibold">per month stipend</div>
                          </div>
                        )}
                        <span className="btn-primary text-xs py-1.5 px-3.5 mt-2 font-semibold">
                          View Details →
                        </span>
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
