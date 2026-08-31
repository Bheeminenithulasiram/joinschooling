"use client";
import { useState, useTransition } from "react";
import { Sparkles, ArrowRight, TrendingUp, GraduationCap, Wallet, MapPin, Building2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { runAiFinderAction, type AiFinderInput } from "@/lib/actions/apply";
import type { AiFinderResponse } from "@/lib/types";

const BANNERS = [
  "linear-gradient(135deg,#7c3aed,#0ea5e9)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#0ea5e9)",
  "linear-gradient(135deg,#6366f1,#ec4899)",
  "linear-gradient(135deg,#0ea5e9,#22d3ee)",
  "linear-gradient(135deg,#a855f7,#3b82f6)",
];

export default function AiFinderForm() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<AiFinderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<string[]>(["Amazon"]);

  const [form, setForm] = useState<AiFinderInput>({
    tenth_percentage: 94,
    twelfth_percentage: 89,
    cgpa: 8.6,
    preferred_course: "Computer Science Engineering",
    budget_max_lpa: 3.0,
    state: "Telangana",
    hostel_required: true,
    expected_package_lpa: 12,
    preferred_companies: ["Amazon"],
  });

  const submit = () => {
    setError(null);
    start(async () => {
      const res = await runAiFinderAction({ ...form, preferred_companies: companies });
      if (res.ok) setResult(res.data as AiFinderResponse);
      else setError(res.error);
    });
  };

  const toggleCompany = (n: string) =>
    setCompanies((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      {/* FORM */}
      <div className="card p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-700"><Sparkles size={14} /> Your profile</div>
        <h2 className="mt-1 font-display text-xl font-bold">Tell us about yourself</h2>

        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">10th %</label>
              <input type="number" min={0} max={100} className="input" value={form.tenth_percentage}
                onChange={(e) => setForm({ ...form, tenth_percentage: +e.target.value })} />
            </div>
            <div>
              <label className="label">12th %</label>
              <input type="number" min={0} max={100} className="input" value={form.twelfth_percentage}
                onChange={(e) => setForm({ ...form, twelfth_percentage: +e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">CGPA</label>
              <input type="number" step={0.01} min={0} max={10} className="input" value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: +e.target.value })} />
            </div>
            <div>
              <label className="label">Budget (LPA)</label>
              <input type="number" step={0.1} min={0} className="input" value={form.budget_max_lpa}
                onChange={(e) => setForm({ ...form, budget_max_lpa: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Preferred course</label>
            <select className="input" value={form.preferred_course}
              onChange={(e) => setForm({ ...form, preferred_course: e.target.value })}>
              <option>Computer Science Engineering</option>
              <option>ECE</option>
              <option>Mechanical</option>
              <option>AI/ML</option>
            </select>
          </div>
          <div>
            <label className="label">Preferred state</label>
            <select className="input" value={form.state ?? ""}
              onChange={(e) => setForm({ ...form, state: e.target.value })}>
              <option>Telangana</option><option>Karnataka</option><option>Maharashtra</option><option>Tamil Nadu</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Expected pkg (LPA)</label>
              <input type="number" step={0.5} className="input" value={form.expected_package_lpa ?? 0}
                onChange={(e) => setForm({ ...form, expected_package_lpa: +e.target.value })} />
            </div>
            <div>
              <label className="label">Hostel</label>
              <select className="input" value={form.hostel_required ? "yes" : "no"}
                onChange={(e) => setForm({ ...form, hostel_required: e.target.value === "yes" })}>
                <option value="yes">Yes</option><option value="no">No</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Preferred companies</label>
            <div className="flex flex-wrap gap-2">
              {["Amazon", "Microsoft", "Google", "TCS", "Infosys"].map((n) => (
                <label key={n} className="chip cursor-pointer">
                  <input type="checkbox" checked={companies.includes(n)} onChange={() => toggleCompany(n)} className="mr-1" /> {n}
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <AlertTriangle size={14} /> {error} — you must be logged in to run AI Finder.
            </div>
          )}

          <button onClick={submit} disabled={pending} className="btn-primary mt-2 w-full disabled:opacity-60">
            <Sparkles size={16} /> {pending ? "Generating…" : "Generate matches"}
          </button>
          <p className="text-center text-xs text-ink-500">Requires login. Runs a deterministic weighted rubric.</p>
        </div>
      </div>

      {/* RESULTS */}
      <div>
        {!result ? (
          <div className="card grid h-full min-h-[500px] place-items-center p-6 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
                <Sparkles size={28} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">Fill your profile to see matches</h3>
              <p className="mt-2 max-w-md text-sm text-ink-500">
                Our engine runs a weighted rubric (academics 30% · budget 20% · placement 25% · location 10% · facilities 15%) and returns your top matches with admission probability.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Badge variant="brand"><Sparkles size={12} /> {result.recommendations.length} matches</Badge>
                <h3 className="mt-1 font-display text-xl font-bold">Your top recommendations</h3>
              </div>
              <span className="text-xs text-ink-500">Run · {result.run_id.slice(0, 8)}</span>
            </div>
            <div className="space-y-4">
              {result.recommendations.map((m, i) => (
                <div key={m.college.id} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-display text-xl font-extrabold text-white" style={{ background: BANNERS[i % BANNERS.length] }}>#{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-display text-lg font-bold">{m.college.short_name ?? m.college.name}</div>
                        <Badge variant="amber">{Math.round(m.match_score * 100)}% match</Badge>
                        {m.admission_probability != null && <Badge variant="green">{Math.round(m.admission_probability * 100)}% admit</Badge>}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-ink-500"><MapPin size={12} /> {m.college.city}, {m.college.state}{m.college.nirf_rank ? ` · NIRF #${m.college.nirf_rank}` : ""}</div>
                      <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                        <Cell icon={GraduationCap} k="Type" v={m.college.type} />
                        <Cell icon={TrendingUp} k="Avg" v={m.college.avg_package_lpa ? `₹${m.college.avg_package_lpa}L` : "—"} />
                        <Cell icon={Wallet} k="Placed" v={m.college.placement_percent ? `${m.college.placement_percent}%` : "—"} />
                        <Cell icon={Building2} k="Rating" v={`${m.college.rating}★`} />
                      </div>
                      {(m.pros?.length > 0 || m.cons?.length > 0) && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {m.pros?.length > 0 && (
                            <div><div className="text-xs font-bold text-emerald-700">Pros</div><ul className="mt-1 text-xs text-ink-700 space-y-0.5">{m.pros.map((p) => <li key={p}>✓ {p}</li>)}</ul></div>
                          )}
                          {m.cons?.length > 0 && (
                            <div><div className="text-xs font-bold text-rose-700">Cons</div><ul className="mt-1 text-xs text-ink-700 space-y-0.5">{m.cons.map((p) => <li key={p}>× {p}</li>)}</ul></div>
                          )}
                        </div>
                      )}
                    </div>
                    <a href={`/colleges/${m.college.slug}`} className="btn-outline">View <ArrowRight size={14} /></a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Cell({ icon: I, k, v }: { icon: any; k: string; v: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink-500"><I size={10} /> {k}</div>
      <div className="mt-0.5 text-sm font-bold">{v}</div>
    </div>
  );
}
