import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { scholarships } from "@/lib/mock";
import { Award, Calendar, IndianRupee, CheckCircle2 } from "lucide-react";

const catVariant = { merit: "brand", need: "green", minority: "amber", sports: "blue" } as const;

export default function ScholarshipsPage() {
  return (
    <>
      <PageHeader eyebrow="₹100Cr+ discovered every year" title="Scholarships" subtitle="Discover scholarships across merit, need, minority, and sports categories." />
      <div className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2">
          {scholarships.map((s) => (
            <div key={s.id} className="card p-6 transition hover:shadow-glow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={catVariant[s.category]}>{s.category}</Badge>
                    </div>
                    <div className="mt-1 font-display text-lg font-bold">{s.title}</div>
                    <div className="text-xs text-ink-500">{s.provider}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-display text-2xl font-extrabold text-brand-700"><IndianRupee size={18} /> {s.amount_lpa}L</div>
                  <div className="text-xs text-ink-500">per year</div>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-2 text-sm text-ink-700"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600 shrink-0" /> {s.eligibility}</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-ink-500"><Calendar size={14} /> Deadline: <b className="text-ink-900">{new Date(s.deadline).toDateString()}</b></div>
              <div className="mt-4 flex gap-2">
                <button className="btn-primary flex-1">Check eligibility</button>
                <button className="btn-outline">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
