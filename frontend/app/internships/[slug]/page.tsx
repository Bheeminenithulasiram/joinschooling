import { notFound } from "next/navigation";
import { apiPublic, api, ApiError } from "@/lib/api";
import type { InternshipDetail } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Clock, CalendarClock, CheckCircle2 } from "lucide-react";
import ApplyButton from "./ApplyButton";
import SaveButton from "@/components/ui/SaveButton";

export const revalidate = 300;

export default async function InternshipDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let i: InternshipDetail;
  try {
    i = await apiPublic<InternshipDetail>(`/api/v1/internships/${slug}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return notFound();
    return notFound();
  }

  let initiallySaved = false;
  try {
    const saved = await api<any[]>("/api/v1/saved");
    initiallySaved = saved.some((s) => s.kind === "internship" && s.target_id === i.id);
  } catch {}

  const deadline = i.apply_deadline ? new Date(i.apply_deadline) : null;

  return (
    <div className="container-page py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-3xl overflow-hidden border border-slate-200/50">
                {i.company?.logo_url ? (
                  <img src={i.company.logo_url} alt={i.company.name} className="h-full w-full object-contain p-1.5" />
                ) : (
                  "💼"
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>{i.work_mode}</Badge>
                  <Badge variant="brand">{i.domain}</Badge>
                </div>
                <h1 className="mt-2 font-display text-2xl font-extrabold">{i.title}</h1>
                <div className="text-sm text-ink-500">{i.company?.name}</div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-500">
                  <span className="flex items-center gap-1"><MapPin size={12} /> {i.location_city ?? "Remote"}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {i.duration_months} months</span>
                  {deadline && <span className="flex items-center gap-1"><CalendarClock size={12} /> Deadline {deadline.toDateString()}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-display text-lg font-bold">About the role</h2>
            <p className="mt-2 text-sm text-ink-700 whitespace-pre-line">{i.description}</p>

            {i.responsibilities?.length > 0 && (
              <>
                <h3 className="mt-6 font-display text-base font-bold">Responsibilities</h3>
                <ul className="mt-2 space-y-1 text-sm text-ink-700">
                  {i.responsibilities.map((r) => (
                    <li key={r} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> {r}</li>
                  ))}
                </ul>
              </>
            )}

            {i.requirements?.length > 0 && (
              <>
                <h3 className="mt-6 font-display text-base font-bold">Requirements</h3>
                <ul className="mt-2 space-y-1 text-sm text-ink-700">
                  {i.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> {r}</li>
                  ))}
                </ul>
              </>
            )}

            {i.skills?.length > 0 && (
              <>
                <h3 className="mt-6 font-display text-base font-bold">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-1">{i.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="card p-6">
            <div className="text-xs uppercase tracking-wider text-ink-500">Stipend</div>
            {i.stipend_max ? (
              <div className="mt-1 font-display text-2xl font-extrabold text-brand-700">₹{i.stipend_min?.toLocaleString()}–{i.stipend_max?.toLocaleString()}</div>
            ) : (
              <div className="mt-1 font-display text-xl font-bold">Unpaid</div>
            )}
            <div className="text-xs text-ink-500">per month</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-ink-500">Duration</div><div className="font-bold">{i.duration_months}mo</div></div>
              <div><div className="text-xs text-ink-500">Mode</div><div className="font-bold capitalize">{i.work_mode}</div></div>
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-xs text-ink-500">Interested?</span>
              <SaveButton kind="internship" targetId={i.id} initiallySaved={initiallySaved} />
            </div>
          </div>

          <ApplyButton internshipId={i.id} />
        </aside>
      </div>
    </div>
  );
}
