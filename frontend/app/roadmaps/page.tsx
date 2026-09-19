"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { roadmaps } from "@/lib/mock";
import { ArrowRight, Clock, CheckCircle2, ChevronDown, ChevronUp, Sparkles, BookOpen, Layers, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const levelVariant = { beginner: "green", intermediate: "amber", advanced: "accent" } as const;

export default function RoadmapsPage() {
  const { success } = useToast();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(roadmaps[0].id);

  const toggleStep = (stepKey: string) => {
    if (completedSteps.includes(stepKey)) {
      setCompletedSteps(completedSteps.filter((k) => k !== stepKey));
    } else {
      setCompletedSteps([...completedSteps, stepKey]);
      success("Step completed! Great progress.");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Step-by-Step Curriculum"
        title="Career Roadmaps & Skill Guides"
        subtitle="Curated step-by-step engineering and AI paths designed by tech leads. Track your progress from zero to job offer."
      />

      <div className="container-page py-10 space-y-8">
        <div className="space-y-6">
          {roadmaps.map((r) => {
            const isExpanded = expandedRoadmap === r.id;
            return (
              <div
                key={r.id}
                className="card overflow-hidden border-slate-200/80 hover:border-brand-300 shadow-md transition duration-200"
              >
                <div
                  className="p-6 sm:p-8 text-white cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ background: r.hero }}
                  onClick={() => setExpandedRoadmap(isExpanded ? null : r.id)}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
                        {r.level} Level
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-white/90">
                        <Clock size={13} /> {r.duration_weeks} Weeks
                      </span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold">{r.title}</h3>
                    <p className="text-xs text-white/80 max-w-xl">{r.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold">Salary Range</div>
                      <div className="font-display text-lg sm:text-xl font-extrabold">{r.salary_range_lpa}</div>
                    </div>
                    <button className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-6 sm:p-8 space-y-6 bg-slate-50/40">
                    <div className="grid gap-6 md:grid-cols-2">
                      {r.steps.map((step, idx) => {
                        const stepKey = `${r.id}-${idx}`;
                        const isDone = completedSteps.includes(stepKey);
                        return (
                          <div
                            key={step.title}
                            className={`rounded-2xl border p-5 space-y-3 transition ${
                              isDone
                                ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
                                : "bg-white border-slate-200 shadow-2xs"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <h4 className="font-display text-base font-bold text-slate-900">{step.title}</h4>
                              <button
                                onClick={() => toggleStep(stepKey)}
                                className={`rounded-lg p-1.5 transition ${
                                  isDone
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-100 text-slate-400 hover:bg-emerald-100 hover:text-emerald-700"
                                }`}
                                title={isDone ? "Mark incomplete" : "Mark as completed"}
                              >
                                <CheckCircle2 size={18} />
                              </button>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>

                            <div className="space-y-1 pt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Topics</span>
                              <div className="flex flex-wrap gap-1">
                                {step.topics.map((t) => (
                                  <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-slate-100 pt-2 text-xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">Recommended Projects:</span>
                              <div className="text-slate-600 mt-0.5 font-medium">{step.recommended_projects.join(" · ")}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
