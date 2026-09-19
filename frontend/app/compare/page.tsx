"use client";
import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { colleges } from "@/lib/mock";
import { CheckCircle2, XCircle, Plus, X, ArrowRight, Sparkles, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const metrics = [
  { label: "NIRF Ranking", get: (c: typeof colleges[number]) => c.nirf_rank ? `#${c.nirf_rank}` : "Unranked / NA" },
  { label: "City & State", get: (c: typeof colleges[number]) => `${c.city}, ${c.state}` },
  { label: "Institution Type", get: (c: typeof colleges[number]) => <span className="capitalize font-semibold">{c.type}</span> },
  { label: "Average Package (CTC)", get: (c: typeof colleges[number]) => <span className="font-extrabold text-brand-700">₹{c.avg_package_lpa} LPA</span> },
  { label: "Highest Package (CTC)", get: (c: typeof colleges[number]) => <span className="font-bold text-emerald-600">₹{c.highest_package_lpa} LPA</span> },
  { label: "Placement Percentage", get: (c: typeof colleges[number]) => `${c.placement_percent}%` },
  { label: "Annual Tuition Fee", get: (c: typeof colleges[number]) => `₹${c.fees_per_year_lpa} Lakh / yr` },
  { label: "Hostel Available", get: (c: typeof colleges[number]) => c.hostel_available ? <span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 size={16} /> Yes (₹{c.hostel_fee_lpa}L/yr)</span> : <span className="text-rose-500 font-semibold flex items-center gap-1"><XCircle size={16} /> No</span> },
  { label: "Rating & Reviews", get: (c: typeof colleges[number]) => `${c.rating} ★ (${c.reviews_count} reviews)` },
  { label: "Degree Programs", get: (c: typeof colleges[number]) => `${c.courses?.length || 4} Undergrad Courses` },
  { label: "Campus Facilities", get: (c: typeof colleges[number]) => c.facilities.slice(0, 4).join(", ") },
];

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([colleges[0].id, colleges[1].id, colleges[2].id]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedColleges = colleges.filter((c) => selectedIds.includes(c.id));

  const addCollege = (id: string) => {
    if (selectedIds.length >= 4) {
      alert("You can compare up to 4 colleges simultaneously.");
      return;
    }
    if (selectedIds.includes(id)) return;
    setSelectedIds([...selectedIds, id]);
    setSearch("");
    setShowDropdown(false);
  };

  const removeCollege = (id: string) => {
    if (selectedIds.length <= 2) {
      alert("Please keep at least 2 colleges to compare side-by-side.");
      return;
    }
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  const availableColleges = colleges.filter(
    (c) =>
      !selectedIds.includes(c.id) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.short_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <PageHeader
        eyebrow="Side-by-Side Matrix"
        title="Compare Colleges"
        subtitle="Benchmark up to 4 colleges across NIRF ranking, placement CTC packages, annual tuition fees, and campus amenities."
      />

      <div className="container-page py-10 space-y-8" onClick={() => setShowDropdown(false)}>
        {/* Search & Selector */}
        <div className="card p-6 flex flex-wrap items-center justify-between gap-4 shadow-sm" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-1">
            <h3 className="font-display text-base font-bold text-slate-900">Add College to Comparison</h3>
            <p className="text-xs text-slate-500">Currently comparing {selectedColleges.length} of 4 maximum institutions.</p>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search college to add (e.g. BITS, VNR)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="input text-xs"
            />
            {showDropdown && search && (
              <div className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                {availableColleges.length === 0 ? (
                  <div className="p-3 text-xs text-slate-400">No additional colleges match</div>
                ) : (
                  availableColleges.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => addCollege(c.id)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-brand-50 hover:text-brand-700 transition"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{c.short_name || c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.city}, {c.state} · NIRF #{c.nirf_rank || "—"}</div>
                      </div>
                      <Plus size={15} className="text-brand-600 shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="card overflow-x-auto shadow-md">
          <div className="min-w-[700px]">
            {/* Header Columns */}
            <div
              className="grid border-b border-slate-200 bg-slate-900 text-white"
              style={{ gridTemplateColumns: `200px repeat(${selectedColleges.length}, minmax(0, 1fr))` }}
            >
              <div className="p-5 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center">
                Institution
              </div>
              {selectedColleges.map((c) => (
                <div key={c.id} className="relative p-5 space-y-2 border-l border-slate-800">
                  <button
                    onClick={() => removeCollege(c.id)}
                    className="absolute right-3 top-3 rounded-full bg-white/10 p-1 text-slate-400 hover:bg-rose-600 hover:text-white transition"
                    title="Remove college"
                  >
                    <X size={14} />
                  </button>
                  <div className="font-display text-lg font-bold text-white pr-6">
                    {c.short_name || c.name}
                  </div>
                  <div className="text-xs text-slate-400">{c.city}, {c.state}</div>
                  <Link
                    href={`/colleges/${c.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:underline pt-1"
                  >
                    View Profile →
                  </Link>
                </div>
              ))}
            </div>

            {/* Metric Rows */}
            {metrics.map((m, idx) => (
              <div
                key={m.label}
                className={`grid border-b border-slate-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}`}
                style={{ gridTemplateColumns: `200px repeat(${selectedColleges.length}, minmax(0, 1fr))` }}
              >
                <div className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                  {m.label}
                </div>
                {selectedColleges.map((c) => (
                  <div key={c.id} className="p-4 text-xs sm:text-sm text-slate-800 border-l border-slate-100 flex items-center">
                    {m.get(c)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
