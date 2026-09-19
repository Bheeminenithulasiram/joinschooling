"use client";
import React, { useState } from "react";
import { Send, Share2, Globe, Sparkles, CheckCircle2, Star, TrendingUp, Building2, BookOpen, ShieldCheck, MapPin, Calendar, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import SaveButton from "@/components/ui/SaveButton";
import { InquiryModal } from "@/components/ui/InquiryModal";
import { useToast } from "@/components/ui/Toast";

export function CollegeDetailClient({ college, initiallySaved = false }: { college: any; initiallySaved?: boolean }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews">("overview");
  const { success } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("College profile link copied to clipboard!");
    }
  };

  return (
    <>
      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} college={college} />

      {/* Header Banner Section */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
        <div className="container-page relative h-full flex flex-col justify-end pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded-full bg-brand-500/30 border border-brand-400/40 px-3 py-1 text-xs font-bold backdrop-blur-md">
              NIRF Rank #{college.nirf_rank || "Top Ranked"}
            </span>
            <span className="rounded-full bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 text-xs font-bold backdrop-blur-md">
              {college.placement_percent}% Placed
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold capitalize">
              {college.type} Institution
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {college.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-brand-400" /> {college.city}, {college.state}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Star size={15} className="text-amber-400 fill-amber-400" /> <b>{college.rating}</b> ({college.reviews_count} reviews)</span>
          </div>
        </div>
      </div>

      <div className="container-page py-8 space-y-8">
        {/* Action Header Card */}
        <div className="card p-6 flex flex-wrap items-center justify-between gap-4 -mt-14 relative z-10 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Avg Package</div>
              <div className="font-display text-2xl font-extrabold text-brand-700 mt-0.5">₹{college.avg_package_lpa} LPA</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Highest CTC</div>
              <div className="font-display text-2xl font-extrabold text-emerald-600 mt-0.5">₹{college.highest_package_lpa || "—"} LPA</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Annual Tuition</div>
              <div className="font-display text-2xl font-extrabold text-slate-900 mt-0.5">₹{college.fees_per_year_lpa || "—"}L / yr</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Hostel Fee</div>
              <div className="font-display text-2xl font-extrabold text-slate-900 mt-0.5">₹{college.hostel_fee_lpa || "0.6"}L / yr</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <SaveButton kind="college" targetId={college.id} initiallySaved={initiallySaved} />
            <button onClick={handleShare} className="btn-outline text-xs py-2.5">
              <Share2 size={15} /> Share
            </button>
            <button onClick={() => setInquiryOpen(true)} className="btn-primary text-xs py-2.5 px-5 font-bold shadow-glow">
              <Send size={15} /> Direct Admission Inquiry
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-4 text-sm font-bold">
          {[
            { key: "overview", label: "Overview & Campus" },
            { key: "courses", label: `Programs (${college.courses?.length || 0})` },
            { key: "placements", label: "Placement Statistics" },
            { key: "reviews", label: `Student Reviews (${college.reviews_count || 0})` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`pb-3 px-2 transition border-b-2 ${
                activeTab === t.key
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                <section className="card p-6 sm:p-8 space-y-4">
                  <h2 className="font-display text-xl font-bold text-slate-900">About {college.short_name || college.name}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {college.about || "Established institution offering accredited higher education programs with modern labs and placement support."}
                  </p>
                </section>

                <section className="card p-6 sm:p-8 space-y-4">
                  <h2 className="font-display text-xl font-bold text-slate-900">Campus Facilities & Infrastructure</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {college.facilities?.map((f: string) => (
                      <div key={f} className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs font-semibold text-slate-800">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeTab === "courses" && (
              <section className="card p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-xl font-bold text-slate-900">Offered Degree Programs & Cutoffs</h2>
                <div className="divide-y divide-slate-100">
                  {college.courses?.map((c: any) => (
                    <div key={c.id || c.name} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">{c.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {c.degree_level} · {c.duration_years} Years · Seats: {c.total_seats || 120}
                        </p>
                        {c.cutoff_rank && (
                          <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            Cutoff: {c.cutoff_rank}
                          </div>
                        )}
                      </div>
                      <div className="text-right sm:text-right">
                        <div className="text-base font-extrabold text-brand-700">₹{c.fees_per_year_lpa}L <span className="text-xs font-normal text-slate-500">/ yr</span></div>
                        <button onClick={() => setInquiryOpen(true)} className="btn-outline text-xs mt-2 py-1.5 px-3">
                          Check Eligibility
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "placements" && (
              <section className="card p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">Campus Recruitment & Hiring Partners</h2>
                  <p className="text-xs text-slate-500 mt-1">Placement track records from recent batches</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
                    <div className="font-display text-2xl font-extrabold text-brand-700">₹{college.avg_package_lpa} LPA</div>
                    <div className="text-xs font-bold text-slate-500 uppercase mt-1">Average CTC</div>
                  </div>
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <div className="font-display text-2xl font-extrabold text-emerald-600">₹{college.highest_package_lpa} LPA</div>
                    <div className="text-xs font-bold text-slate-500 uppercase mt-1">Highest Domestic CTC</div>
                  </div>
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                    <div className="font-display text-2xl font-extrabold text-sky-700">{college.placement_percent}%</div>
                    <div className="text-xs font-bold text-slate-500 uppercase mt-1">Placement Ratio</div>
                  </div>
                </div>

                {college.placements?.[0]?.top_recruiters && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Hiring Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {college.placements[0].top_recruiters.map((r: string) => (
                        <span key={r} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
                          💼 {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeTab === "reviews" && (
              <section className="card p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900">Student & Alumni Experiences</h2>
                    <p className="text-xs text-slate-500">Verified insights on campus culture, hostel, and academics</p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-900 font-bold text-sm">
                    <Star size={16} className="fill-amber-400 text-amber-400" /> {college.rating} / 5.0
                  </div>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {college.reviews?.map((r: any) => (
                    <div key={r.id} className="pt-4 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-900">{r.title}</div>
                        <div className="text-xs text-amber-600 font-bold">{r.rating} ★</div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
                      <div className="text-[11px] text-slate-400 font-medium">
                        By {r.author} · Batch of {r.batch}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Direct Admissions Box */}
            <div className="card p-6 space-y-4 border-brand-200 bg-gradient-to-br from-white to-brand-50/40 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                <ShieldCheck size={16} className="text-brand-600" /> Admissions Desk
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">Admissions & Counseling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {college.admission_process || "Admissions are granted based on entrance test ranks and centralized counseling."}
              </p>
              <button
                onClick={() => setInquiryOpen(true)}
                className="btn-primary w-full py-3 text-xs font-bold shadow-glow"
              >
                <Send size={14} /> Send Admission Inquiry
              </button>
            </div>

            {/* Official Website Link */}
            {college.website && (
              <div className="card p-5 space-y-2 text-center">
                <div className="text-xs font-bold text-slate-500">Official Institution Website</div>
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full text-xs font-bold py-2.5 inline-flex items-center justify-center gap-2"
                >
                  <Globe size={14} className="text-brand-600" /> Visit Official Site
                </a>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
