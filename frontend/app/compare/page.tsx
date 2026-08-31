"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { colleges } from "@/lib/mock";
import { CheckCircle2, XCircle, Plus, X } from "lucide-react";

const rows: { k: string; get: (c: typeof colleges[number]) => React.ReactNode }[] = [
  { k: "NIRF Rank", get: (c) => c.nirf_rank ? `#${c.nirf_rank}` : "N/A" },
  { k: "Location", get: (c) => `${c.city}, ${c.state}` },
  { k: "Type", get: (c) => c.type },
  { k: "Avg Package", get: (c) => `₹${c.avg_package_lpa} LPA` },
  { k: "Placement %", get: (c) => `${c.placement_percent}%` },
  { k: "Rating", get: (c) => `${c.rating}★` },
  { k: "Hostel", get: (c) => c.hostel_available ? <CheckCircle2 className="text-emerald-600" size={18} /> : <XCircle className="text-rose-500" size={18} /> },
  { k: "Facilities", get: (c) => c.facilities.join(", ") },
];

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([colleges[0].id, colleges[1].id]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedColleges = colleges.filter((c) => selectedIds.includes(c.id));

  const addCollege = (id: string) => {
    if (selectedIds.length >= 4) {
      alert("You can compare up to 4 colleges.");
      return;
    }
    if (selectedIds.includes(id)) return;
    setSelectedIds([...selectedIds, id]);
    setSearch("");
    setShowDropdown(false);
  };

  const removeCollege = (id: string) => {
    if (selectedIds.length <= 1) {
      alert("Keep at least one college for comparison.");
      return;
    }
    setSelectedIds(selectedIds.filter((x) => x !== id));
  };

  const availableColleges = colleges.filter(
    (c) => !selectedIds.includes(c.id) && c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader eyebrow="Side-by-side" title="Compare Colleges" subtitle="Compare up to 4 colleges across ranking, placement, fees and facilities." />
      <div className="container-page py-10" onClick={() => setShowDropdown(false)}>
        
        {/* Selector Input */}
        <div className="relative mb-8 max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search college to add..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="input w-full"
            />
            {search && (
              <button onClick={() => setSearch("")} className="btn-ghost p-2">
                <X size={16} />
              </button>
            )}
          </div>
          {showDropdown && search && (
            <div className="absolute left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              {availableColleges.length === 0 ? (
                <div className="p-3 text-sm text-ink-400">No colleges found</div>
              ) : (
                availableColleges.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => addCollege(c.id)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50"
                  >
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-ink-400">{c.city}, {c.state}</div>
                    </div>
                    <Plus size={14} className="text-brand-600" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Comparison Grid */}
        <div className="card overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid border-b border-slate-200 bg-slate-50" style={{ gridTemplateColumns: `150px repeat(${selectedColleges.length}, minmax(0, 1fr))` }}>
              <div className="p-4 text-xs font-bold uppercase tracking-wider text-ink-500">Metric</div>
              {selectedColleges.map((c) => (
                <div key={c.id} className="relative p-4">
                  <button
                    onClick={() => removeCollege(c.id)}
                    className="absolute right-2 top-2 rounded-full bg-white/85 p-1 text-ink-500 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Remove college"
                  >
                    <X size={14} />
                  </button>
                  <div className="h-14 rounded-lg" style={{ background: c.banner }} />
                  <div className="mt-2 font-display text-base font-bold">{c.short_name ?? c.name}</div>
                  <div className="text-xs text-ink-500">{c.city}</div>
                </div>
              ))}
            </div>
            {rows.map((r, i) => (
              <div key={r.k} className={`grid border-b border-slate-100 last:border-0 ${i % 2 ? "bg-slate-50/60" : ""}`} style={{ gridTemplateColumns: `150px repeat(${selectedColleges.length}, minmax(0, 1fr))` }}>
                <div className="p-4 text-sm font-semibold text-ink-500">{r.k}</div>
                {selectedColleges.map((c) => (
                  <div key={c.id} className="p-4 text-sm">{r.get(c)}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
