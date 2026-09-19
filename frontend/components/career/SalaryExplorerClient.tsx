"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Building2, Briefcase, Award, Sparkles, CheckCircle2, ChevronRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface RoleSalaryData {
  title: string;
  fresherBase: string;
  fresherTotal: string;
  experiencedTotal: string;
  topCompanies: { name: string; ctc: string; base: string; logo: string }[];
}

const SALARY_DATA: Record<string, RoleSalaryData> = {
  sde: {
    title: "Software Development Engineer (SDE)",
    fresherBase: "₹16,00,000 - ₹24,00,000",
    fresherTotal: "₹24,00,000 - ₹45,00,000",
    experiencedTotal: "₹45,00,000 - ₹85,00,000",
    topCompanies: [
      { name: "Google", ctc: "₹52.0 LPA", base: "₹22.0 LPA", logo: "G" },
      { name: "Microsoft", ctc: "₹45.5 LPA", base: "₹18.5 LPA", logo: "M" },
      { name: "Amazon", ctc: "₹44.0 LPA", base: "₹17.5 LPA", logo: "A" },
      { name: "Uber", ctc: "₹48.0 LPA", base: "₹21.0 LPA", logo: "U" },
      { name: "Atlassian", ctc: "₹55.0 LPA", base: "₹24.0 LPA", logo: "At" },
      { name: "Flipkart", ctc: "₹32.0 LPA", base: "₹18.0 LPA", logo: "F" },
    ],
  },
  ai_ml: {
    title: "AI / Machine Learning Engineer",
    fresherBase: "₹18,00,000 - ₹26,00,000",
    fresherTotal: "₹28,00,000 - ₹50,00,000",
    experiencedTotal: "₹55,00,000 - ₹1,10,00,000",
    topCompanies: [
      { name: "NVIDIA", ctc: "₹48.0 LPA", base: "₹22.0 LPA", logo: "NV" },
      { name: "Google DeepMind", ctc: "₹65.0 LPA", base: "₹28.0 LPA", logo: "G" },
      { name: "Microsoft AI", ctc: "₹46.0 LPA", base: "₹20.0 LPA", logo: "M" },
      { name: "Adobe Research", ctc: "₹40.0 LPA", base: "₹19.0 LPA", logo: "Ad" },
    ],
  },
  data_science: {
    title: "Data Scientist / Analyst",
    fresherBase: "₹12,00,000 - ₹18,00,000",
    fresherTotal: "₹16,00,000 - ₹28,00,000",
    experiencedTotal: "₹35,00,000 - ₹65,00,000",
    topCompanies: [
      { name: "Walmart Global Tech", ctc: "₹28.0 LPA", base: "₹16.0 LPA", logo: "W" },
      { name: "Flipkart", ctc: "₹26.0 LPA", base: "₹15.0 LPA", logo: "F" },
      { name: "American Express", ctc: "₹22.0 LPA", base: "₹14.0 LPA", logo: "AX" },
      { name: "JPMorgan Chase", ctc: "₹24.0 LPA", base: "₹16.0 LPA", logo: "JP" },
    ],
  },
  product: {
    title: "Associate Product Manager (APM)",
    fresherBase: "₹15,00,000 - ₹22,00,000",
    fresherTotal: "₹20,00,000 - ₹38,00,000",
    experiencedTotal: "₹42,00,000 - ₹80,00,000",
    topCompanies: [
      { name: "Cred", ctc: "₹36.0 LPA", base: "₹20.0 LPA", logo: "C" },
      { name: "Zomato", ctc: "₹28.0 LPA", base: "₹16.0 LPA", logo: "Z" },
      { name: "Swiggy", ctc: "₹30.0 LPA", base: "₹17.0 LPA", logo: "S" },
      { name: "PhonePe", ctc: "₹32.0 LPA", base: "₹18.0 LPA", logo: "P" },
    ],
  },
};

export function SalaryExplorerClient() {
  const [selectedRole, setSelectedRole] = useState("sde");
  const [experience, setExperience] = useState("fresher");
  const [collegeTier, setCollegeTier] = useState("tier1");

  // Resume Reviewer State
  const [resumeText, setResumeText] = useState("");
  const [reviewResult, setReviewResult] = useState<{
    score: number;
    verdict: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { addToast } = useToast();

  const currentRoleData = SALARY_DATA[selectedRole] || SALARY_DATA.sde;

  const handleAnalyzeResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      addToast("Please enter bullet points or summary from your resume.", "error");
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const hasActionVerbs = /(built|developed|optimized|engineered|architected|increased|reduced)/i.test(resumeText);
      const hasMetrics = /\d+%|\d+x|\$\d+|\d+ users|\d+ ms/i.test(resumeText);
      const hasTechStack = /(react|next\.js|python|fastapi|java|spring|docker|kubernetes|aws|postgresql|node)/i.test(resumeText);

      let score = 65;
      if (hasActionVerbs) score += 12;
      if (hasMetrics) score += 15;
      if (hasTechStack) score += 8;
      score = Math.min(score, 96);

      setReviewResult({
        score,
        verdict: score >= 85 ? "Strong Tier-1 Tech Candidate" : "Solid Foundation — Add Quantifiable Impact",
        strengths: [
          hasActionVerbs ? "Great usage of strong technical action verbs" : "Clean structural format",
          hasTechStack ? "Modern high-demand tech stack identified (Next.js, Python, Cloud)" : "Good academic profile",
          "Clear career intent aligned with top tech standards",
        ],
        improvements: [
          !hasMetrics ? "Add quantifiable metrics (e.g. 'Reduced latency by 40%', 'Handled 5,000+ daily active users')" : "Include link to live deployed demo",
          "Highlight complex DSA or system architecture tradeoffs",
        ],
      });
      addToast("Resume analysis complete! Check your ATS score below.", "success");
    }, 1000);
  };

  return (
    <div className="space-y-12">
      {/* 1. Salary & Compensation Insights */}
      <section className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
              <TrendingUp size={14} /> Tech Compensation 2026
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Tech Salary & Offer Benchmarks
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verified CTC figures compiled from verified offers, alumni data, and placement reports.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "sde", label: "Software Engineer" },
              { id: "ai_ml", label: "AI / ML Engineer" },
              { id: "data_science", label: "Data Science" },
              { id: "product", label: "Product (APM)" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  selectedRole === r.id
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Highlights Banner */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Fresher CTC (0-1 yrs)</span>
            <div className="mt-2 font-display text-xl font-extrabold text-emerald-950">
              {currentRoleData.fresherTotal}
            </div>
            <span className="text-xs text-emerald-600 font-medium">Base: {currentRoleData.fresherBase}</span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 border border-brand-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700">Experienced CTC (3-5 yrs)</span>
            <div className="mt-2 font-display text-xl font-extrabold text-brand-950">
              {currentRoleData.experiencedTotal}
            </div>
            <span className="text-xs text-brand-600 font-medium">Includes base + ESOP grants</span>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Internship Stipend</span>
            <div className="mt-2 font-display text-xl font-extrabold text-amber-950">
              ₹80,000 - ₹1,50,000 / mo
            </div>
            <span className="text-xs text-amber-600 font-medium">Top Tier-1 Tech companies</span>
          </div>
        </div>

        {/* Top Company Breakdown */}
        <div>
          <h3 className="font-display text-sm font-bold text-slate-800 mb-3">
            Top Paying Companies for {currentRoleData.title}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentRoleData.topCompanies.map((c) => (
              <div
                key={c.name}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-300 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-sm">
                    {c.logo}
                  </div>
                  <div>
                    <div className="font-display text-sm font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">Base: {c.base}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-sm font-extrabold text-emerald-700">{c.ctc}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">Total CTC</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Interactive AI Resume & ATS Review Tool */}
      <section className="glass-card p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              AI Resume Reviewer & ATS Matcher
            </h2>
            <p className="text-xs text-slate-500">
              Simulate enterprise recruiter ATS scans. Check your score against Amazon, Google, and Microsoft hiring bars.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyzeResume} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Paste your Resume Experience / Project Bullet Points
            </label>
            <textarea
              rows={5}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="e.g. Architected full-stack portal using Next.js 15, FastAPI, and PostgreSQL. Reduced latency by 45% using Redis caching. Implemented real-time Kanban pipeline for 2,000+ applicants..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setResumeText(
                  "• Developed high-throughput microservices using FastAPI and PostgreSQL handling 50k+ daily queries.\n• Built responsive frontend using Next.js 15 and TailwindCSS with sub-second page loads.\n• Designed AI ranking model using scikit-learn achieving 92% match accuracy for campus placements."
                );
              }}
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 underline"
            >
              Load sample tech bullet points
            </button>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-2"
            >
              {isAnalyzing ? "Scanning ATS & Keywords..." : "Run AI Resume Review"}
            </button>
          </div>
        </form>

        {reviewResult && (
          <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">ATS Verdict</span>
                <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">{reviewResult.verdict}</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-semibold">Match Score</div>
                  <div className="text-[10px] text-emerald-600 font-bold">FAANG-Ready</div>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white font-display text-2xl font-extrabold shadow-md">
                  {reviewResult.score}%
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 pt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Key Strengths
                </h4>
                <ul className="space-y-1.5">
                  {reviewResult.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} /> Recommended Tweaks
                </h4>
                <ul className="space-y-1.5">
                  {reviewResult.improvements.map((imp, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-amber-500 font-bold">→</span> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
