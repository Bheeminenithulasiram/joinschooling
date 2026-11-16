import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { domains, internships as mockInternships } from "@/lib/mock";
import {
  Search,
  MapPin,
  Clock,
  Filter,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  Layers,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { apiPublic } from "@/lib/api";
import type { PagedInternships } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchInternships(sp: Record<string, string | undefined>): Promise<PagedInternships> {
  const params = new URLSearchParams();
  if (sp.q) params.set("q", sp.q);
  if (sp.domain) params.set("domain", sp.domain);
  if (sp.work_mode) params.set("work_mode", sp.work_mode);
  if (sp.min_stipend) params.set("min_stipend", sp.min_stipend);
  if (sp.type) params.set("type", sp.type);
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
  const roleType = sp.type;

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

  if (roleType === "job") {
    items = items.filter(
      (i) => i.opportunity_type === "job" || (!i.title.toLowerCase().includes("intern") && i.duration_months >= 12)
    );
  } else if (roleType === "internship") {
    items = items.filter(
      (i) => i.opportunity_type === "internship" || i.title.toLowerCase().includes("intern")
    );
  }

  if (sort === "stipend_desc") items.sort((a, b) => b.stipend_max - a.stipend_max);
  else if (sort === "deadline")
    items.sort((a, b) => new Date(a.apply_deadline).getTime() - new Date(b.apply_deadline).getTime());

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
      opportunity_type: i.opportunity_type || (i.title.toLowerCase().includes("intern") ? "internship" : "job"),
      skills: i.skills,
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
  const activeType = sp.type || "all";

  const makeTypeHref = (newType: string | null) => {
    const p = new URLSearchParams();
    if (newType) p.set("type", newType);
    if (sp.q) p.set("q", sp.q);
    if (sp.domain) p.set("domain", sp.domain);
    if (sp.work_mode) p.set("work_mode", sp.work_mode);
    if (sp.min_stipend) p.set("min_stipend", sp.min_stipend);
    if (sp.sort) p.set("sort", sp.sort);
    const qs = p.toString();
    return qs ? `/internships?${qs}` : "/internships";
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        eyebrow={`${data.pagination.total.toLocaleString()}+ Verified Opportunities`}
        title="Internships &amp; Full-Time Tech Jobs"
        subtitle="Explore verified tech internships, graduate engineering roles, and campus hiring drives from enterprise and high-growth employers."
        actions={
          <Link
            href="/auth/register?role=recruiter"
            className="btn-outline text-xs inline-flex items-center gap-1.5"
          >
            <Building2 size={14} className="text-blue-600" /> Post an Opportunity
          </Link>
        }
      />

      <div className="container-page space-y-6">
        {/* Unified Segmented Switcher for Role Types */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner">
            <Link
              href={makeTypeHref(null)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeType === "all"
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Layers size={13} className={activeType === "all" ? "text-blue-600" : "text-slate-400"} />
              <span>All Opportunities</span>
            </Link>

            <Link
              href={makeTypeHref("internship")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeType === "internship"
                  ? "bg-white text-blue-600 shadow-xs border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <GraduationCap size={14} className={activeType === "internship" ? "text-blue-600" : "text-slate-400"} />
              <span>Internships</span>
            </Link>

            <Link
              href={makeTypeHref("job")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeType === "job"
                  ? "bg-white text-indigo-600 shadow-xs border border-slate-200/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Briefcase size={13} className={activeType === "job" ? "text-indigo-600" : "text-slate-400"} />
              <span>Full-Time Jobs</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 size={14} /> Direct Verified Employer Drives
          </div>
        </div>

        {/* Quick Domain Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">Domains:</span>
            {domains.map((d) => (
              <Link
                key={d}
                href={`/internships?domain=${d}${activeType !== "all" ? `&type=${activeType}` : ""}`}
                className="chip text-xs hover:border-blue-500 hover:text-blue-700"
              >
                {d}
              </Link>
            ))}
          </div>

          <span className="text-xs text-slate-500">
            Showing <b className="text-slate-900">{data.items.length}</b> verified positions
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Form */}
          <form className="card h-fit p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <Filter size={14} className="text-blue-600" /> Filter Roles
              </div>
              <Link href="/internships" className="text-xs text-blue-600 font-semibold hover:underline">
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
              <label className="label">Opportunity Type</label>
              <select name="type" defaultValue={sp.type ?? ""} className="input text-xs">
                <option value="">All Types (Internships &amp; Jobs)</option>
                <option value="internship">Internships Only</option>
                <option value="job">Full-Time Jobs Only</option>
              </select>
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
              <label className="label">Min Compensation (₹/mo)</label>
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
                <option value="stipend_desc">Highest Compensation</option>
                <option value="deadline">Application Deadline</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full text-xs py-2.5 font-bold">
              Apply Filters
            </button>
          </form>

          {/* Internships & Jobs List */}
          <div className="space-y-4">
            {data.items.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No opportunities matched"
                description="Try adjusting your keyword criteria, changing opportunity type, or clearing compensation filters."
                actionHref="/internships"
                actionLabel="Clear Filters"
              />
            ) : (
              <div className="space-y-3.5">
                {data.items.map((i) => {
                  const isJob =
                    i.opportunity_type === "job" ||
                    (!i.title.toLowerCase().includes("intern") && i.duration_months >= 12);
                  const minLpa = i.stipend_min ? ((i.stipend_min * 12) / 100000).toFixed(1) : null;
                  const maxLpa = i.stipend_max ? ((i.stipend_max * 12) / 100000).toFixed(1) : null;

                  return (
                    <Link
                      key={i.id}
                      href={`/internships/${i.slug}`}
                      className="card p-5 sm:p-6 hover:border-blue-400 hover:shadow-md transition duration-150 block group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-sm border ${
                              isJob
                                ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                                : "bg-blue-50 text-blue-700 border-blue-100"
                            }`}
                          >
                            {i.company?.name ? i.company.name.substring(0, 2).toUpperCase() : "TC"}
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                                {i.title}
                              </h3>

                              {isJob ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                                  <Briefcase size={10} className="text-indigo-600" /> Full-Time Job
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80">
                                  <GraduationCap size={10} className="text-blue-600" /> Internship
                                </span>
                              )}

                              <Badge
                                variant={
                                  i.work_mode === "remote"
                                    ? "green"
                                    : i.work_mode === "hybrid"
                                    ? "amber"
                                    : "blue"
                                }
                              >
                                {i.work_mode}
                              </Badge>
                            </div>

                            <p className="text-xs font-semibold text-slate-600">
                              {i.company?.name || "Tech Employer"} ·{" "}
                              <span className="text-slate-400">{i.location_city || "Pan India"}</span>
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-slate-400" /> {i.location_city || "Remote"}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="text-slate-400" />
                                {isJob ? "Full-Time Role" : `${i.duration_months} Months`}
                              </span>
                              <span>•</span>
                              <span className="text-slate-600 font-semibold">{i.domain}</span>
                            </div>

                            {i.skills && i.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {i.skills.slice(0, 4).map((skill: string) => (
                                  <span
                                    key={skill}
                                    className="rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="sm:text-right border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end shrink-0">
                          {isJob ? (
                            <div>
                              <div className="font-display text-base font-black text-indigo-700">
                                ₹{minLpa}–{maxLpa} LPA
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                Annual CTC Package
                              </div>
                            </div>
                          ) : (
                            i.stipend_max && (
                              <div>
                                <div className="font-display text-base font-black text-emerald-600">
                                  ₹{i.stipend_min?.toLocaleString()}–{i.stipend_max?.toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                                  per month stipend
                                </div>
                              </div>
                            )
                          )}
                          <span className="btn-primary text-xs py-2 px-4 mt-2 font-bold shadow-2xs">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
