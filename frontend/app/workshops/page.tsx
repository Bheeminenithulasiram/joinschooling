"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { workshops } from "@/lib/mock";
import { Calendar, Users, Check } from "lucide-react";

export default function WorkshopsPage() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [filter, setFilter] = useState("All");

  const toggleEnroll = (id: string) => {
    if (enrolled.includes(id)) return;
    setEnrolled([...enrolled, id]);
    alert("Successfully enrolled in the workshop! Check your registered email for details.");
  };

  const categories = ["All", "AI/ML", "Web", "DSA", "PM", "Design", "Data"];
  
  const filtered = filter === "All" ? workshops : workshops.filter(w => {
    if (filter === "AI/ML") return w.category.toLowerCase().includes("ai") || w.category.toLowerCase().includes("machine");
    return w.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <>
      <PageHeader eyebrow="Skill up" title="Live Workshops" subtitle="Cohort-based live workshops taught by industry experts. Get certified and job-ready." />
      <div className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={filter === c ? "chip-brand" : "chip"}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => {
            const isEnrolled = enrolled.includes(w.id);
            return (
              <div key={w.id} className="card overflow-hidden transition hover:shadow-glow">
                <div className="relative h-32" style={{ background: w.hero }}>
                  <div className="absolute right-3 top-3"><Badge variant={w.mode === "online" ? "green" : "blue"}>{w.mode}</Badge></div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">{w.category}</div>
                  <div className="mt-1 font-display text-lg font-bold">{w.title}</div>
                  <div className="mt-1 text-xs text-ink-500">{w.provider}</div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(w.date).toDateString()}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {w.seats} seats</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-display text-xl font-extrabold">₹{w.price}</div>
                    <button
                      onClick={() => toggleEnroll(w.id)}
                      className={`btn-${isEnrolled ? "outline bg-emerald-50 text-emerald-700 border-emerald-200" : "primary"}`}
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? <><Check size={14} className="inline mr-1" /> Enrolled</> : "Enroll"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
