"use client";
import React, { useState } from "react";
import { Send, MapPin, Clock, Briefcase, CheckCircle2, ShieldCheck, Share2, Sparkles, Building2 } from "lucide-react";
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

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 py-12 text-white border-b border-slate-800">
        <div className="container-page space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl border border-white/20 backdrop-blur-md">
                {internship.company?.name === "Amazon" || internship.company === "Amazon" ? "🟠" : "💼"}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {internship.title}
                  </h1>
                  <Badge variant={internship.work_mode === "remote" ? "green" : "blue"}>
                    {internship.work_mode}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 font-medium">
                  {internship.company?.name || internship.company} · {internship.location_city || internship.city || "Pan India"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SaveButton kind="internship" targetId={internship.id} initiallySaved={initiallySaved} />
              <button onClick={handleShare} className="btn bg-white/10 hover:bg-white/20 text-white text-xs py-2.5 px-3.5 rounded-xl transition">
                <Share2 size={15} /> Share
              </button>
              <button
                onClick={() => setApplyModalOpen(true)}
                className="btn-primary text-xs py-2.5 px-6 font-bold shadow-glow"
              >
                <Send size={15} /> Apply with 1-Click
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Monthly Stipend</div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-brand-400 mt-0.5">
                ₹{internship.stipend_min?.toLocaleString()}–{internship.stipend_max?.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Duration</div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {internship.duration_months} Months
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Open Positions</div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-emerald-400 mt-0.5">
                {internship.openings || 10} Openings
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Apply Deadline</div>
              <div className="font-display text-sm sm:text-base font-bold text-slate-300 mt-1">
                {internship.apply_deadline ? new Date(internship.apply_deadline).toLocaleDateString() : "Rolling Basis"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main Details */}
          <div className="space-y-8">
            <section className="card p-6 sm:p-8 space-y-4">
              <h2 className="font-display text-xl font-bold text-slate-900">About the Role</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {internship.description}
              </p>
            </section>

            {internship.responsibilities && internship.responsibilities.length > 0 && (
              <section className="card p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Key Responsibilities</h2>
                <ul className="space-y-2.5">
                  {internship.responsibilities.map((r: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {internship.requirements && internship.requirements.length > 0 && (
              <section className="card p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Eligibility & Requirements</h2>
                <ul className="space-y-2.5">
                  {internship.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <ShieldCheck size={16} className="text-brand-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {internship.skills && internship.skills.length > 0 && (
              <section className="card p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Required Skills & Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((s: string) => (
                    <span key={s} className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card p-6 space-y-4 border-brand-200 bg-gradient-to-br from-white to-brand-50/40 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                <Sparkles size={16} className="text-brand-600" /> Fast-Track Apply
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">Ready to submit your application?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Applications are reviewed by the {internship.company?.name || internship.company} campus hiring team on a rolling basis.
              </p>
              <button
                onClick={() => setApplyModalOpen(true)}
                className="btn-primary w-full py-3 text-xs font-bold shadow-glow"
              >
                <Send size={14} /> Submit Application Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
