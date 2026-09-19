"use client";

import React, { useState } from "react";
import { Send, MapPin, Clock, Briefcase, CheckCircle2, ShieldCheck, Share2, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import SaveButton from "@/components/ui/SaveButton";
import { ApplyModal } from "@/components/ui/ApplyModal";
import { useToast } from "@/components/ui/Toast";

export function InternshipDetailClient({ internship, initiallySaved = false }: { internship: any; initiallySaved?: boolean }) {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const { success } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Internship link copied to clipboard!");
    }
  };

  return (
    <>
      <ApplyModal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} internship={internship} />

      {/* Classic Dark Navy Header */}
      <div className="bg-slate-900 py-10 text-white border-b border-slate-800">
        <div className="container-page space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white font-bold text-lg border border-slate-700">
                {(internship.company?.name || internship.company || "CO").substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {internship.title}
                  </h1>
                  <Badge variant={internship.work_mode === "remote" ? "green" : "blue"}>
                    {internship.work_mode}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {internship.company?.name || internship.company} · {internship.location_city || internship.city || "Pan India"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <SaveButton kind="internship" targetId={internship.id} initiallySaved={initiallySaved} />
              <button onClick={handleShare} className="btn-outline text-xs py-2 px-3">
                <Share2 size={14} /> Share
              </button>
              <button
                onClick={() => setApplyModalOpen(true)}
                className="btn-primary text-xs py-2 px-4 font-semibold"
              >
                <Send size={14} /> Apply Now
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-5 text-xs">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Monthly Stipend</div>
              <div className="font-display text-lg font-bold text-blue-400 mt-0.5">
                ₹{internship.stipend_min?.toLocaleString()}–{internship.stipend_max?.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Duration</div>
              <div className="font-display text-lg font-bold text-white mt-0.5">
                {internship.duration_months} Months
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Open Positions</div>
              <div className="font-display text-lg font-bold text-emerald-400 mt-0.5">
                {internship.openings || 10} Openings
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Apply Deadline</div>
              <div className="font-display text-sm font-semibold text-slate-300 mt-0.5">
                {internship.apply_deadline ? new Date(internship.apply_deadline).toLocaleDateString() : "Rolling Basis"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main Details */}
          <div className="space-y-6">
            <section className="card p-6 space-y-3">
              <h2 className="font-display text-base font-bold text-slate-900">About the Role</h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </section>

            {internship.responsibilities && internship.responsibilities.length > 0 && (
              <section className="card p-6 space-y-3">
                <h2 className="font-display text-base font-bold text-slate-900">Key Responsibilities</h2>
                <ul className="space-y-2">
                  {internship.responsibilities.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {internship.requirements && internship.requirements.length > 0 && (
              <section className="card p-6 space-y-3">
                <h2 className="font-display text-base font-bold text-slate-900">Eligibility & Requirements</h2>
                <ul className="space-y-2">
                  {internship.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <ShieldCheck size={14} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {internship.skills && internship.skills.length > 0 && (
              <section className="card p-6 space-y-3">
                <h2 className="font-display text-base font-bold text-slate-900">Required Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {internship.skills.map((s: string) => (
                    <span key={s} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card p-5 space-y-3 border-blue-200 bg-blue-50/40">
              <h3 className="font-display text-sm font-bold text-slate-900">Ready to Submit?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct submission to the {internship.company?.name || internship.company} campus hiring team.
              </p>
              <button
                onClick={() => setApplyModalOpen(true)}
                className="btn-primary w-full py-2.5 text-xs font-semibold"
              >
                <Send size={13} /> Submit 1-Click Application
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
