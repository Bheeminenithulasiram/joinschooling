"use client";

import React, { useState } from "react";
import { Send, Share2, Globe, CheckCircle2, Star, Building2, BookOpen, ShieldCheck, MapPin, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import SaveButton from "@/components/ui/SaveButton";
import { InquiryModal } from "@/components/ui/InquiryModal";
import { useToast } from "@/components/ui/Toast";

export function CollegeDetailClient({ college, initiallySaved = false }: { college: any; initiallySaved?: boolean }) {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "facilities">("overview");
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

      {/* Classic Dark Navy Institutional Banner */}
      <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="container-page space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
              NIRF #{college.nirf_rank || "Top Ranked"}
            </span>
            <span className="rounded bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white">
              {college.placement_percent}% Placement Rate
            </span>
            <span className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold capitalize border border-slate-700">
              {college.type} Institution
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {college.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-400" /> {college.city}, {college.state}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" /> <b>{college.rating}</b> ({college.reviews_count} verified reviews)
            </span>
            {college.website && (
              <>
                <span>•</span>
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <Globe size={13} /> Official Website
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container-page py-8 space-y-8">
        {/* KPI Action Header */}
        <div className="card p-6 flex flex-wrap items-center justify-between gap-4 -mt-8 relative z-10 shadow-sm border border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 flex-1">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Avg Package</div>
              <div className="font-display text-xl font-bold text-blue-700 mt-0.5">₹{college.avg_package_lpa} LPA</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Highest CTC</div>
              <div className="font-display text-xl font-bold text-emerald-700 mt-0.5">₹{college.highest_package_lpa || "—"} LPA</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Annual Tuition</div>
              <div className="font-display text-xl font-bold text-slate-900 mt-0.5">₹{college.fees_per_year_lpa || "—"}L / yr</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hostel Fee</div>
              <div className="font-display text-xl font-bold text-slate-900 mt-0.5">₹{college.hostel_fee_lpa || "0.6"}L / yr</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <SaveButton kind="college" targetId={college.id} initiallySaved={initiallySaved} />
            <button onClick={handleShare} className="btn-outline text-xs py-2 px-3">
              <Share2 size={14} /> Share
            </button>
            <button onClick={() => setInquiryOpen(true)} className="btn-primary text-xs py-2 px-4 font-semibold">
              <Send size={14} /> Direct Admissions Inquiry
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex gap-4 text-xs font-bold">
          {[
            { key: "overview", label: "Overview & Accreditation" },
            { key: "courses", label: `Programs & Cutoffs (${college.courses?.length || 0})` },
            { key: "placements", label: "Placement Statistics" },
            { key: "facilities", label: "Campus Facilities" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`pb-3 px-2 transition border-b-2 ${
                activeTab === t.key
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6 space-y-3">
                <h2 className="font-display text-base font-bold text-slate-900">About {college.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{college.about}</p>
              </div>

              <div className="card p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-slate-900">Admission Process & Eligibility</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{college.admission_process}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-5 space-y-3">
                <h3 className="font-display text-sm font-bold text-slate-900">Quick Institutional Facts</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Established</span>
                    <span className="font-bold text-slate-900">{college.established_year || "1958"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">NIRF Category</span>
                    <span className="font-bold text-blue-700">Engineering #{college.nirf_rank || "Top 10"}</span>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Hostel Accommodation</span>
                    <span className="font-bold text-slate-900">{college.hostel_available ? "Available (Boys & Girls)" : "Day Scholar Only"}</span>
                  </div>
                </div>
              </div>

              <div className="card p-5 bg-blue-50/50 border border-blue-200 space-y-3">
                <h3 className="font-display text-sm font-bold text-slate-900">Speak with Admissions Desk</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Have questions about seat allocation, management quotas, or branch change rules?
                </p>
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="btn-primary w-full text-xs py-2 font-semibold"
                >
                  Send Inquiry to Admissions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Courses & Cutoffs */}
        {activeTab === "courses" && (
          <div className="card overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900">Offered Programs & Entrance Cutoffs</h3>
                <p className="text-xs text-slate-500">Annual tuition fees, total seats, and opening/closing entrance ranks.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-3.5 text-left font-bold">Course / Specialization</th>
                    <th className="p-3.5 text-left font-bold">Degree & Duration</th>
                    <th className="p-3.5 text-left font-bold">Entrance Exams</th>
                    <th className="p-3.5 text-left font-bold">Cutoff Rank</th>
                    <th className="p-3.5 text-right font-bold">Tuition / yr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {college.courses?.map((crs: any) => (
                    <tr key={crs.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 font-bold text-slate-900">{crs.name}</td>
                      <td className="p-3.5 text-slate-600">{crs.degree_level} · {crs.duration_years} Years</td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {crs.entrance_exams?.map((ex: string) => (
                            <Badge key={ex} variant="brand" className="text-[10px]">{ex}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-blue-700">{crs.cutoff_rank || "Top 2,500"}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">₹{crs.fees_per_year_lpa || college.fees_per_year_lpa}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Placements */}
        {activeTab === "placements" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="card p-5 bg-slate-50 border border-slate-200">
                <div className="text-xs uppercase text-slate-400 font-bold">Placement Rate</div>
                <div className="font-display text-2xl font-bold text-emerald-700 mt-1">{college.placement_percent}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">2025-2026 Graduating Batch</div>
              </div>
              <div className="card p-5 bg-slate-50 border border-slate-200">
                <div className="text-xs uppercase text-slate-400 font-bold">Average CTC</div>
                <div className="font-display text-2xl font-bold text-blue-700 mt-1">₹{college.avg_package_lpa} LPA</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Across B.Tech specializations</div>
              </div>
              <div className="card p-5 bg-slate-50 border border-slate-200">
                <div className="text-xs uppercase text-slate-400 font-bold">Highest CTC Offered</div>
                <div className="font-display text-2xl font-bold text-slate-900 mt-1">₹{college.highest_package_lpa || "—"} LPA</div>
                <div className="text-[11px] text-slate-500 mt-0.5">International / Tier-1 Tech Offer</div>
              </div>
            </div>

            {college.placements && college.placements.length > 0 && (
              <div className="card p-6 border border-slate-200 space-y-4">
                <h3 className="font-display text-base font-bold text-slate-900">Annual Placement Track Record</h3>
                <div className="space-y-3">
                  {college.placements.map((p: any) => (
                    <div key={p.year} className="p-4 rounded-lg bg-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900">Academic Year {p.year}</span>
                        <div className="text-[11px] text-slate-500">Top Recruiters: {p.top_recruiters?.join(", ")}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-xs text-emerald-700">{p.placed_count} Offers</span>
                        <div className="text-[11px] text-slate-500">Avg: ₹{p.avg_package_lpa} LPA</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Facilities */}
        {activeTab === "facilities" && (
          <div className="card p-6 border border-slate-200 space-y-4">
            <h3 className="font-display text-base font-bold text-slate-900">Campus Infrastructure & Facilities</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {college.facilities?.map((f: string) => (
                <div key={f} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2.5 text-xs font-semibold text-slate-800">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
