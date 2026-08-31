import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { roadmaps } from "@/lib/mock";
import { ArrowRight, Clock } from "lucide-react";

const levelVariant = { beginner: "green", intermediate: "amber", advanced: "accent" } as const;

export default function RoadmapsPage() {
  return (
    <>
      <PageHeader eyebrow="Learn in order" title="Roadmaps" subtitle="Step-by-step guides curated by industry experts to help you master any career track." />
      <div className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {roadmaps.map((r) => (
            <div key={r.id} className="card overflow-hidden transition hover:shadow-glow">
              <div className="h-24" style={{ background: r.hero }} />
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Badge variant={levelVariant[r.level]}>{r.level}</Badge>
                  <span className="flex items-center gap-1 text-xs text-ink-500"><Clock size={12} /> {r.duration_weeks} weeks</span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold">{r.title}</h3>

                <ol className="mt-4 space-y-2">
                  {r.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                      <span className="text-sm text-ink-700">{s}</span>
                    </li>
                  ))}
                </ol>

                <button className="btn-primary mt-6 w-full">Start roadmap <ArrowRight size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
