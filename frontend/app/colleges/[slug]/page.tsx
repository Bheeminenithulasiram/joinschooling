import Link from "next/link";
import { notFound } from "next/navigation";
import { apiPublic, api, ApiError } from "@/lib/api";
import type { CollegeDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { MapPin, GraduationCap, TrendingUp, Share2, CheckCircle2, Star } from "lucide-react";
import SaveButton from "@/components/ui/SaveButton";

export const revalidate = 300; // 5-min ISR

const BANNER = "linear-gradient(135deg,#7c3aed,#0ea5e9)";

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let c: CollegeDetail;
  try {
    c = await apiPublic<CollegeDetail>(`/api/v1/colleges/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return notFound();
    return notFound();
  }

  let initiallySaved = false;
  try {
    const saved = await api<any[]>("/api/v1/saved");
    initiallySaved = saved.some((s) => s.kind === "college" && s.target_id === c.id);
  } catch {}

  return (
    <>
      <div className="relative h-56 sm:h-72" style={c.banner_url ? { backgroundImage: `url(${c.banner_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: BANNER }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="container-page -mt-16 relative">
        <div className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand">{c.type}</Badge>
                {c.nirf_rank && <Badge variant="amber">NIRF #{c.nirf_rank}</Badge>}
                {c.placement_percent != null && <Badge variant="green">{c.placement_percent}% placed</Badge>}
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold">{c.name}</h1>
              <div className="mt-1 flex items-center gap-2 text-ink-500"><MapPin size={14} /> {c.city}, {c.state}</div>
              <div className="mt-2 flex items-center gap-1 text-sm"><Star size={14} className="text-amber-500" /> <b>{c.rating}</b> <span className="text-ink-500">({c.reviews_count.toLocaleString()} reviews)</span></div>
            </div>
            <div className="flex gap-2">
              <SaveButton kind="college" targetId={c.id} initiallySaved={initiallySaved} />
              <button className="btn-outline"><Share2 size={16} /> Share</button>
              {c.website ? (
                <a href={c.website} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Visit Website
                </a>
              ) : (
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(c.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Apply
                </a>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {[
              { icon: TrendingUp, l: "Avg package", v: c.avg_package_lpa != null ? `₹${c.avg_package_lpa} LPA` : "—" },
              { icon: TrendingUp, l: "Placement", v: c.placement_percent != null ? `${c.placement_percent}%` : "—" },
              { icon: GraduationCap, l: "Type", v: c.type },
              { icon: Star, l: "Rating", v: `${c.rating}/5` },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500"><s.icon size={14} /> {s.l}</div>
                <div className="mt-2 font-display text-2xl font-extrabold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {c.about && (
              <section className="card p-6">
                <h2 className="font-display text-xl font-bold">About</h2>
                <p className="mt-2 text-sm text-ink-700 whitespace-pre-line">{c.about}</p>
              </section>
            )}

            {c.facilities?.length > 0 && (
              <section className="card p-6">
                <h2 className="font-display text-xl font-bold">Facilities</h2>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {c.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2 rounded-xl border border-slate-100 p-3 text-sm">
                      <CheckCircle2 size={16} className="text-emerald-600" /> {f}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {c.courses?.length > 0 && (
              <section className="card p-6">
                <h2 className="font-display text-xl font-bold">Courses offered</h2>
                <ul className="mt-3 divide-y divide-slate-100">
                  {c.courses.map((n) => (
                    <li key={n.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-semibold">{n.name}</div>
                        <div className="text-xs text-ink-500">{n.duration_years} yrs · {n.degree_level}</div>
                      </div>
                      {n.fees_per_year_lpa != null && <div className="text-sm font-semibold text-brand-700">₹{n.fees_per_year_lpa}L / yr</div>}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h3 className="font-display text-lg font-bold">Admission</h3>
              <p className="mt-2 text-sm text-ink-700 whitespace-pre-line">{c.admission_process ?? "Contact college for admission details."}</p>
              <button className="btn-primary mt-4 w-full">Start application</button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
