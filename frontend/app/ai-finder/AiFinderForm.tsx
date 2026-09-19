"use client";
import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Wallet,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sliders,
  Award
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { runAiFinderAction, type AiFinderInput } from "@/lib/actions/apply";
import type { AiFinderResponse } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";

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
  const { success } = useToast();

  const [form, setForm] = useState<AiFinderInput>({
    tenth_percentage: 92,
    twelfth_percentage: 88,
    cgpa: 8.8,
    preferred_course: "Computer Science Engineering",
    budget_max_lpa: 3.5,
    state: "Telangana",
    hostel_required: true,
    expected_package_lpa: 12,
    preferred_companies: ["Amazon", "Google", "Microsoft"],
  });

  const toggleCompany = (n: string) => {
    const curr = form.preferred_companies || [];
    if (curr.includes(n)) {
      setForm({ ...form, preferred_companies: curr.filter((x) => x !== n) });
    } else {
      setForm({ ...form, preferred_companies: [...curr, n] });
    }
  };

  const handleGenerate = () => {
    setError(null);
    start(async () => {
      const res = await runAiFinderAction(form);
      if (res.ok) {
        setResult(res.data);
        success("AI recommendations generated successfully!");
      } else {
        setError(res.error || "Failed to generate recommendations");
      }
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] items-start">
      {/* Interactive Form Card */}
      <div className="card p-6 sm:p-8 space-y-6 shadow-md border-brand-200/80">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
            <Sparkles size={15} className="text-brand-600" /> Multi-Factor Profile Engine
          </div>
          <button
            onClick={() =>
              setForm({
                tenth_percentage: 92,
                twelfth_percentage: 88,
                cgpa: 8.8,
                preferred_course: "Computer Science Engineering",
                budget_max_lpa: 3.5,
                state: "Telangana",
                hostel_required: true,
                expected_package_lpa: 12,
                preferred_companies: ["Amazon", "Google", "Microsoft"],
              })
            }
            className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900">Your Academic Scores</h2>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">10th Score (%)</label>
              <input
                type="number"
                min={40}
                max={100}
                className="input text-xs"
                value={form.tenth_percentage}
                onChange={(e) => setForm({ ...form, tenth_percentage: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="label">12th Score (%)</label>
              <input
                type="number"
                min={40}
                max={100}
                className="input text-xs"
                value={form.twelfth_percentage}
                onChange={(e) => setForm({ ...form, twelfth_percentage: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="label">Undergrad CGPA</label>
              <input
                type="number"
                step={0.05}
                min={4.0}
                max={10.0}
                className="input text-xs"
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <h2 className="font-display text-xl font-bold text-slate-900">Preferences & Budget Cap</h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Preferred Course</label>
              <select
                className="input text-xs"
                value={form.preferred_course}
                onChange={(e) => setForm({ ...form, preferred_course: e.target.value })}
              >
                <option value="Computer Science Engineering">Computer Science & Eng</option>
                <option value="Artificial Intelligence & ML">AI & Machine Learning</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics and Communication">Electronics & Comm</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>
            <div>
              <label className="label">Preferred Region</label>
              <select
                className="input text-xs"
                value={form.state || ""}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              >
                <option value="">Any State (All India)</option>
                <option value="Telangana">Telangana</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Max Annual Budget</label>
              <div className="relative">
                <input
                  type="number"
                  step={0.5}
                  min={0.5}
                  max={20}
                  className="input text-xs"
                  value={form.budget_max_lpa}
                  onChange={(e) => setForm({ ...form, budget_max_lpa: Number(e.target.value) })}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">LPA</span>
              </div>
            </div>
            <div>
              <label className="label">Target CTC Package</label>
              <div className="relative">
                <input
                  type="number"
                  step={1}
                  min={3}
                  max={50}
                  className="input text-xs"
                  value={form.expected_package_lpa || 10}
                  onChange={(e) => setForm({ ...form, expected_package_lpa: Number(e.target.value) })}
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">LPA</span>
              </div>
            </div>
          </div>

          <div>
            <label className="label">Dream Recruiter Companies</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Amazon", "Google", "Microsoft", "Flipkart", "Apple", "Oracle", "TCS"].map((comp) => {
                const isSelected = form.preferred_companies?.includes(comp);
                return (
                  <button
                    type="button"
                    key={comp}
                    onClick={() => toggleCompany(comp)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition border ${
                      isSelected
                        ? "bg-brand-600 text-white border-brand-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {isSelected ? `✓ ${comp}` : `+ ${comp}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={pending}
          className="btn-primary w-full py-3.5 text-sm font-bold shadow-glow"
        >
          <Sparkles size={16} /> {pending ? "Analyzing 12,500+ Institutions..." : "Calculate AI Recommendations"}
        </button>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {!result ? (
          <div className="card grid place-items-center p-12 sm:p-16 text-center space-y-4 border-dashed border-2 border-slate-200 bg-white/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-glow">
              <Sparkles size={28} />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900">Personalized AI Matcher</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
              Adjust your GPA and budget constraints on the left and click <b>Calculate AI Recommendations</b> to see custom institution shortlists with admit probabilities.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Match Results</span>
                <h2 className="font-display text-2xl font-extrabold text-slate-900">Top Recommended Matches</h2>
              </div>
              <Badge variant="green">{result.recommendations.length} Institutions Ranked</Badge>
            </div>

            <div className="space-y-4">
              {result.recommendations.map((m, idx) => (
                <div
                  key={m.college.id}
                  className="card p-6 space-y-4 hover:border-brand-400 hover:shadow-lg transition duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-extrabold text-white shadow-xs"
                        style={{ background: BANNERS[idx % BANNERS.length] }}
                      >
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-lg font-bold text-slate-900">
                            {m.college.short_name || m.college.name}
                          </h3>
                          <span className="rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 border border-emerald-300">
                            {Math.round(m.match_score * 100)}% Fit Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {m.college.city}, {m.college.state} · NIRF #{m.college.nirf_rank || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:text-right">
                      <div className="text-xs text-slate-400 uppercase font-semibold">Admit Probability</div>
                      <div className="text-lg font-extrabold text-brand-700">
                        {Math.round((m.admission_probability || 0.85) * 100)}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="text-xs font-bold text-brand-700">₹{m.college.avg_package_lpa} LPA</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Avg CTC</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="text-xs font-bold text-emerald-600">{m.college.placement_percent}%</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Placed</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="text-xs font-bold text-slate-800">₹{m.college.fees_per_year_lpa || 2.5}L</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Tuition / yr</div>
                    </div>
                  </div>

                  {/* AI Reasoning Badges */}
                  {(m.pros?.length > 0 || m.cons?.length > 0) && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                      {m.pros?.map((p) => (
                        <div key={p} className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                      {m.cons?.map((c) => (
                        <div key={c} className="flex items-center gap-1.5 text-amber-700 font-medium">
                          <AlertCircle size={13} className="shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <Link
                      href={`/colleges/${m.college.slug}`}
                      className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                    >
                      View Full Profile & Cutoffs <ArrowRight size={13} />
                    </Link>
                    <Link
                      href={`/colleges/${m.college.slug}`}
                      className="btn-primary text-xs py-1.5 px-3.5 shadow-xs"
                    >
                      Apply / Inquire
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
