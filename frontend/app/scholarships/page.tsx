"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { scholarships } from "@/lib/mock";
import { Award, Calendar, IndianRupee, CheckCircle2, ShieldCheck, X, FileCheck, Search, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

const catVariant = { merit: "brand", need: "green", minority: "amber", sports: "blue" } as const;

export default function ScholarshipsPage() {
  const { success, info } = useToast();
  const [selectedScholarship, setSelectedScholarship] = useState<any>(null);
  const [savedScholarships, setSavedScholarships] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const handleSave = (id: string, title: string) => {
    if (savedScholarships.includes(id)) {
      setSavedScholarships(savedScholarships.filter((s) => s !== id));
      info(`Removed "${title}" from saved scholarships.`);
    } else {
      setSavedScholarships([...savedScholarships, id]);
      success(`Saved "${title}" to your dashboard!`);
    }
  };

  const filtered = activeCategory === "all"
    ? scholarships
    : scholarships.filter((s) => s.category === activeCategory);

  return (
    <>
      <PageHeader
        eyebrow="₹120Cr+ Discovered Annually"
        title="Scholarships & Financial Aid"
        subtitle="Discover government, corporate, and merit-based financial aid for undergraduate & postgraduate engineering students."
      />

      <div className="container-page py-10 space-y-8">
        {/* Eligibility Modal */}
        {selectedScholarship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
              <button
                onClick={() => setSelectedScholarship(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <div className="space-y-1">
                <Badge variant={catVariant[selectedScholarship.category as keyof typeof catVariant]}>
                  {selectedScholarship.category} scholarship
                </Badge>
                <h3 className="font-display text-xl font-bold text-slate-900 pt-1">{selectedScholarship.title}</h3>
                <p className="text-xs text-slate-500">Offered by {selectedScholarship.provider}</p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-emerald-900 text-sm">
                  <span>Aid Amount</span>
                  <span>₹{selectedScholarship.amount_lpa} Lakhs / year</span>
                </div>
                <div className="text-slate-700">Minimum Cutoff: <b>{selectedScholarship.min_percentage}% in Class 12th</b></div>
                {selectedScholarship.max_annual_income_lpa && (
                  <div className="text-slate-700">Family Income Cap: <b>&lt; ₹{selectedScholarship.max_annual_income_lpa} LPA</b></div>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">Required Documents</span>
                <ul className="space-y-1.5">
                  {selectedScholarship.documents_required?.map((doc: string) => (
                    <li key={doc} className="flex items-center gap-2 text-slate-700">
                      <FileCheck size={14} className="text-brand-600 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  success("Application portal link opened in new tab!");
                  setSelectedScholarship(null);
                }}
                className="btn-primary w-full py-3 text-xs font-bold shadow-sm"
              >
                Proceed to Official Application Portal →
              </button>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2">Category:</span>
          {["all", "merit", "need", "minority"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={activeCategory === cat ? "chip-brand" : "chip"}
            >
              {cat === "all" ? "All Scholarships" : `${cat.toUpperCase()} Based`}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((s) => {
            const isSaved = savedScholarships.includes(s.id);
            return (
              <div
                key={s.id}
                className="card p-6 sm:p-7 space-y-4 hover:border-brand-300 hover:shadow-xl transition duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
                        <Award size={22} />
                      </div>
                      <div>
                        <Badge variant={catVariant[s.category]}>{s.category}</Badge>
                        <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-700 transition leading-snug pt-1">
                          {s.title}
                        </h3>
                        <p className="text-xs text-slate-500">{s.provider}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-0.5 font-display text-2xl font-extrabold text-brand-700">
                        <IndianRupee size={16} /> {s.amount_lpa}L
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">per year</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {s.eligibility}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <Calendar size={13} className="text-slate-400" />
                    <span>Deadline: <b className="text-slate-900">{new Date(s.deadline).toDateString()}</b></span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedScholarship(s)}
                    className="btn-primary flex-1 text-xs py-2.5 font-bold shadow-xs"
                  >
                    Check Eligibility & Apply
                  </button>
                  <button
                    onClick={() => handleSave(s.id, s.title)}
                    className={`btn-outline text-xs py-2.5 px-4 ${isSaved ? "bg-brand-50 text-brand-700 border-brand-300 font-bold" : ""}`}
                  >
                    {isSaved ? "Saved" : "Save"}
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
