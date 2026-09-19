"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { workshops } from "@/lib/mock";
import { Calendar, Users, Check, Sparkles, Clock, CheckCircle2, Ticket, X, Award, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function WorkshopsPage() {
  const { success, info } = useToast();
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);

  const categories = ["All", "AI/ML", "Web", "DSA", "PM"];

  const filtered = activeCategory === "All"
    ? workshops
    : workshops.filter((w) => w.category.toLowerCase() === activeCategory.toLowerCase());

  const handleEnroll = (w: any) => {
    if (enrolled.includes(w.id)) {
      info(`You are already enrolled in ${w.title}.`);
      return;
    }
    setEnrolled([...enrolled, w.id]);
    setSelectedWorkshop(w);
    success(`Successfully enrolled in "${w.title}"!`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Cohort-Based Learning"
        title="Live Interactive Workshops"
        subtitle="Learn directly from Principal Engineers and AI Researchers at Google, Amazon, and Swiggy. Earn verified certificates."
      />

      <div className="container-page py-10 space-y-8">
        {/* Ticket Modal */}
        {selectedWorkshop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
              <button
                onClick={() => setSelectedWorkshop(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Ticket size={28} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">Registration Confirmed!</h3>
                <p className="text-xs text-slate-500">Your live cohort seat pass has been generated.</p>
              </div>

              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 space-y-2 text-xs">
                <div className="font-bold text-brand-900 text-sm">{selectedWorkshop.title}</div>
                <div className="text-slate-600">Instructor: <b>{selectedWorkshop.instructor}</b> ({selectedWorkshop.instructor_role})</div>
                <div className="text-slate-600">Date: <b>{new Date(selectedWorkshop.date).toDateString()}</b> ({selectedWorkshop.duration})</div>
                <div className="text-slate-600">Format: <b className="capitalize">{selectedWorkshop.mode} Live Stream</b></div>
              </div>

              <button
                onClick={() => setSelectedWorkshop(null)}
                className="btn-primary w-full py-2.5 text-xs font-bold"
              >
                Done / View Workshop Hub
              </button>
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={activeCategory === c ? "chip-brand" : "chip"}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Workshops Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => {
            const isEnrolled = enrolled.includes(w.id);
            return (
              <div
                key={w.id}
                className="card overflow-hidden hover:border-brand-400 hover:shadow-xl transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="relative h-36 p-4 text-white flex flex-col justify-between"
                    style={{ background: w.hero }}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={w.mode === "online" ? "green" : "blue"}>{w.mode}</Badge>
                      <span className="rounded-lg bg-black/40 backdrop-blur-md px-2 py-0.5 text-xs font-bold">
                        {w.seats_left} seats left
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white/90">
                      {w.duration} · {new Date(w.date).toDateString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                        {w.category}
                      </span>
                      <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug pt-1">
                        {w.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        By <b>{w.instructor}</b> ({w.instructor_role})
                      </p>
                    </div>

                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curriculum Highlights</div>
                      {w.curriculum.slice(0, 3).map((item: string) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-2xl font-extrabold text-slate-900">₹{w.price}</span>
                      <span className="text-xs text-slate-400 line-through font-medium">₹{w.original_price}</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">Verified Certificate Included</div>
                  </div>

                  <button
                    onClick={() => handleEnroll(w)}
                    disabled={isEnrolled}
                    className={`text-xs py-2.5 px-4 font-bold rounded-xl transition ${
                      isEnrolled
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                        : "btn-primary shadow-xs hover:shadow-md"
                    }`}
                  >
                    {isEnrolled ? (
                      <span className="flex items-center gap-1"><Check size={14} /> Enrolled</span>
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
