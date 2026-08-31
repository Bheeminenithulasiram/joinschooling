"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { hackathons } from "@/lib/mock";
import { Trophy, Users, Calendar, Check, ChevronDown, ChevronUp } from "lucide-react";

export default function HackathonsPage() {
  const [registered, setRegistered] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleRegister = (id: string, title: string) => {
    if (registered.includes(id)) return;
    setRegistered([...registered, id]);
    alert(`Successfully registered for ${title}! Check your email for team setup instructions.`);
  };

  const toggleDetails = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <>
      <PageHeader eyebrow="Compete & win" title="Hackathons" subtitle="Build, ship, and win prizes. Get hired by top companies through hackathons." />
      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {hackathons.map((h) => {
            const isReg = registered.includes(h.id);
            const isExp = expanded === h.id;
            return (
              <div key={h.id} className="card overflow-hidden transition hover:shadow-glow">
                <div className="relative h-40" style={{ background: h.hero }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <Badge variant={h.mode === "online" ? "green" : h.mode === "hybrid" ? "amber" : "blue"}>{h.mode}</Badge>
                    <Badge variant="brand">Live</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="font-display text-xl font-extrabold">{h.title}</div>
                    <div className="text-xs opacity-90">by {h.org}</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-sm text-ink-700">{h.theme}</div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <Stat icon={Trophy} k="Prize Pool" v={`₹${(h.prize_pool / 100000).toFixed(1)}L`} />
                    <Stat icon={Calendar} k="Starts" v={new Date(h.start).toLocaleDateString()} />
                    <Stat icon={Users} k="Team Size" v="1–4" />
                  </div>
                  {isExp && (
                    <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-ink-500">
                      <h4 className="font-semibold text-ink-800">Hackathon Details:</h4>
                      <p className="mt-1 text-xs">Join other innovators to solve industry challenges. Prizes will be distributed among the top 3 teams. Recruiting partners will review your GitHub submissions directly.</p>
                      <ul className="mt-2 list-disc pl-4 space-y-1 text-xs">
                        <li>Timeline: Starts on {new Date(h.start).toDateString()}</li>
                        <li>Venue: {h.mode === "online" ? "Virtual Workspace" : "Host Campus Venue"}</li>
                        <li>Format: 1-4 players per team</li>
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => toggleRegister(h.id, h.title)}
                      className={`btn-${isReg ? "outline bg-emerald-50 text-emerald-700 border-emerald-200" : "primary"} flex-1`}
                      disabled={isReg}
                    >
                      {isReg ? <><Check size={14} className="inline mr-1" /> Registered</> : "Register"}
                    </button>
                    <button
                      onClick={() => toggleDetails(h.id)}
                      className="btn-outline flex items-center gap-1"
                    >
                      {isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Details
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

function Stat({ icon: I, k, v }: { icon: any; k: string; v: string }) {
  return (
    <div className="rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-ink-500"><I size={12} /> {k}</div>
      <div className="mt-1 font-display text-base font-bold">{v}</div>
    </div>
  );
}
