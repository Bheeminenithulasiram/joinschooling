import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { alumni } from "@/lib/mock";
import { MessageSquare, Briefcase, GraduationCap } from "lucide-react";

export default function AlumniPage() {
  return (
    <>
      <PageHeader eyebrow="42,000+ mentors" title="Alumni Network" subtitle="Connect with alumni who've been where you're going. Get mentorship, referrals and advice." />
      <div className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", "SDE", "Data Science", "Product", "Design", "Consulting"].map((c, i) => (
            <button key={c} className={i === 0 ? "chip-brand" : "chip"}>{c}</button>
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <div key={a.id} className="card p-6 transition hover:shadow-glow">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-extrabold text-white">
                  {a.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-bold">{a.name}</div>
                  <div className="flex items-center gap-1 text-xs text-ink-500"><Briefcase size={12} /> {a.role} @ {a.company}</div>
                  <div className="flex items-center gap-1 text-xs text-ink-500"><GraduationCap size={12} /> {a.college} · {a.batch}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1">
                {a.skills.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between">
                {a.open_to_mentor ? <Badge variant="green">Open to mentor</Badge> : <Badge variant="slate">Not accepting</Badge>}
                <button className="btn-primary"><MessageSquare size={14} /> Connect</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
