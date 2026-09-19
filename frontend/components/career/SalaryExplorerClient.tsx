"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Building2, Briefcase, Award, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
  const currentRoleData = SALARY_DATA[selectedRole] || SALARY_DATA.sde;

  return (
    <div className="space-y-8">
      {/* 1. Salary & Compensation Benchmarks */}
      <section className="card p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-1">
              <TrendingUp size={13} /> Verified Tech Compensation
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Campus Placement Salary Benchmarks
            </h2>
            <p className="text-xs text-slate-500">
              Verified figures compiled from campus placement cell reports, offer letters, and verified alumni data.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "sde", label: "Software Engineer (SDE)" },
              { id: "ai_ml", label: "AI / ML Engineer" },
              { id: "data_science", label: "Data Science" },
              { id: "product", label: "Product (APM)" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedRole === r.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Salary Highlight Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fresher CTC (0-1 yrs)</span>
            <div className="mt-1 font-display text-lg font-bold text-slate-900">
              {currentRoleData.fresherTotal}
            </div>
            <span className="text-xs text-slate-500">Base: {currentRoleData.fresherBase}</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Experienced (3-5 yrs)</span>
            <div className="mt-1 font-display text-lg font-bold text-slate-900">
              {currentRoleData.experiencedTotal}
            </div>
            <span className="text-xs text-slate-500">Includes base salary + ESOP grants</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Internship Stipend</span>
            <div className="mt-1 font-display text-lg font-bold text-emerald-700">
              ₹80,000 - ₹1,40,000 / mo
            </div>
            <span className="text-xs text-slate-500">Top Tier-1 Tech companies</span>
          </div>
        </div>

        {/* Top Company CTC Breakdown */}
        <div>
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Top Paying Employers for {currentRoleData.title}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currentRoleData.topCompanies.map((c) => (
              <div
                key={c.name}
                className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white font-bold text-xs">
                    {c.logo}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{c.name}</div>
                    <div className="text-[10px] text-slate-400">Base: {c.base}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-700">{c.ctc}</div>
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Total CTC</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Structured Placement Preparation Roadmap */}
      <section className="card p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" /> Essential Interview Preparation Milestones
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-700">Phase 1: DSA Foundations</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Master Blind-75 LeetCode patterns: Two Pointers, Sliding Window, Trees, Graphs, and Dynamic Programming.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-700">Phase 2: System Architecture</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Understand low-level OOP design, API rate limiting, PostgreSQL indexes, and Redis caching layers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-blue-700">Phase 3: Behavioral & STAR</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prepare STAR (Situation, Task, Action, Result) stories for leadership principles and teamwork rounds.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
