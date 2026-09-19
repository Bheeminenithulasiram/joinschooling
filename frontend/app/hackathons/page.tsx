"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { hackathons } from "@/lib/mock";
import { Trophy, Users, Calendar, Check, ChevronDown, ChevronUp, Sparkles, MapPin, Award, X, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function HackathonsPage() {
  const { success, info } = useToast();
  const [registered, setRegistered] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [registerModalHackathon, setRegisterModalHackathon] = useState<any>(null);
  const [teamName, setTeamName] = useState("Team AlphaCoders");

  const handleRegister = (h: any) => {
    if (registered.includes(h.id)) {
      info(`You have already registered for ${h.title}.`);
      return;
    }
    setRegisterModalHackathon(h);
  };

  const confirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerModalHackathon) return;
    setRegistered([...registered, registerModalHackathon.id]);
    success(`Registered team "${teamName}" for ${registerModalHackathon.title}!`);
    setRegisterModalHackathon(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="Compete & Win Big"
        title="Engineering & AI Hackathons"
        subtitle="Build prototypes for nation-scale challenges and top product companies. Win from ₹70 Lakhs+ in bounties and earn direct job offers."
      />

      <div className="container-page py-10 space-y-8">
        {/* Team Register Modal */}
        {registerModalHackathon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4">
              <button
                onClick={() => setRegisterModalHackathon(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <Trophy size={13} /> Official Hackathon Registration
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mt-2">{registerModalHackathon.title}</h3>
                <p className="text-xs text-slate-500">Organized by {registerModalHackathon.org}</p>
              </div>

              <form onSubmit={confirmRegistration} className="space-y-4 pt-1">
                <div>
                  <label className="label">Team Name</label>
                  <input
                    required
                    className="input text-xs"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Team Leader Email</label>
                  <input
                    required
                    type="email"
                    className="input text-xs"
                    defaultValue="kiran.k@educonnect.dev"
                  />
                </div>
                <div>
                  <label className="label">Selected Track</label>
                  <select className="input text-xs">
                    {registerModalHackathon.tracks?.map((t: string) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary w-full py-3 text-xs font-bold shadow-glow">
                  Confirm Team Registration
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {hackathons.map((h) => {
            const isReg = registered.includes(h.id);
            const isExp = expanded === h.id;
            return (
              <div
                key={h.id}
                className="card overflow-hidden hover:border-brand-400 hover:shadow-xl transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="relative h-44 p-5 text-white flex flex-col justify-between"
                    style={{ background: h.hero }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant={h.mode === "online" ? "green" : h.mode === "hybrid" ? "amber" : "blue"}>
                          {h.mode}
                        </Badge>
                        <span className="rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-bold">
                          Team: {h.team_size}
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-1">
                        ₹{(h.prize_pool / 100000).toFixed(0)} Lakhs Pool
                      </span>
                    </div>

                    <div>
                      <h3 className="font-display text-2xl font-extrabold text-white leading-tight">
                        {h.title}
                      </h3>
                      <p className="text-xs text-white/80 font-medium">By {h.org} · {h.location || "Virtual"}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Theme: <b>{h.theme}</b>
                    </p>

                    <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                      <div className="rounded-xl bg-slate-50 p-2">
                        <div className="text-xs font-bold text-brand-700">₹{(h.prize_pool / 100000).toFixed(0)}L</div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Prize Cash</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <div className="text-xs font-bold text-slate-800">{new Date(h.start).toLocaleDateString()}</div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Starts On</div>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-2">
                        <div className="text-xs font-bold text-emerald-600">PPO Offers</div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Hiring</div>
                      </div>
                    </div>

                    {/* Tracks & Perks */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hackathon Tracks</div>
                      <div className="flex flex-wrap gap-1.5">
                        {h.tracks?.map((track) => (
                          <span key={track} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                            {track}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isExp && (
                      <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs border border-slate-200">
                        <div className="font-bold text-slate-900">Perks & Recognition:</div>
                        <ul className="space-y-1 text-slate-600">
                          {h.perks?.map((p) => (
                            <li key={p} className="flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-50 flex items-center gap-3">
                  <button
                    onClick={() => handleRegister(h)}
                    disabled={isReg}
                    className={`flex-1 text-xs py-2.5 px-4 font-bold rounded-xl transition ${
                      isReg
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                        : "btn-primary shadow-xs hover:shadow-md"
                    }`}
                  >
                    {isReg ? <span className="flex items-center justify-center gap-1"><Check size={14} /> Registered</span> : "Register Team Free"}
                  </button>
                  <button
                    onClick={() => setExpanded(isExp ? null : h.id)}
                    className="btn-outline text-xs py-2.5 px-3 flex items-center gap-1"
                  >
                    {isExp ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Details
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
