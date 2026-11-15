"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  Users,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

interface DashboardHeroProps {
  displayName: string;
}

const DASH_SLIDES = [
  {
    prefix: "Track your",
    highlight: "Admissions Inquiries.",
    accentClass: "text-sky-400 drop-shadow-[0_4px_16px_rgba(56,189,248,0.4)]",
    sub: "Real-time counselor status notes, entrance cutoffs, and seat confirmations.",
    bgImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    prefix: "Discover",
    highlight: "New Tech Drives.",
    accentClass: "text-emerald-400 drop-shadow-[0_4px_16px_rgba(52,211,153,0.4)]",
    sub: "Verified internships with up to ₹1.5L/month stipends and direct PPO offers.",
    bgImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    prefix: "Prepare for",
    highlight: "Campus Placements.",
    accentClass: "text-amber-400 drop-shadow-[0_4px_16px_rgba(251,191,36,0.4)]",
    sub: "Salary benchmarks, role compensation data, and interview question guides.",
    bgImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
  },
  {
    prefix: "Connect with",
    highlight: "FAANG Mentors.",
    accentClass: "text-purple-400 drop-shadow-[0_4px_16px_rgba(192,132,252,0.4)]",
    sub: "1-on-1 resume reviews and technical mock interviews with top alumni engineers.",
    bgImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop",
  },
];

export function DashboardHero({ displayName }: DashboardHeroProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % DASH_SLIDES.length);
      setTimeout(() => setPrev(null), 600);
    }, 4500);

    return () => clearInterval(timer);
  }, [current]);

  const activeSlide = DASH_SLIDES[current];
  const prevSlide = prev !== null ? DASH_SLIDES[prev] : null;

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#101A32] p-7 sm:p-9 text-white shadow-2xl relative overflow-hidden">
      {/* Background Image Crossfade & Ken-Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {DASH_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? "opacity-35 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.bgImage}
              alt="Dashboard Hero Background"
              className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ${
                idx === current ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        ))}
        {/* Dark Navy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101A32] via-[#101A32]/90 to-[#101A32]/70 z-20" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
            <GraduationCap size={14} className="text-blue-300" /> Student Admissions &amp; Career Workspace
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            <span>Welcome back, {displayName} — </span>
            <span className="block sm:inline">
              <span>{activeSlide.prefix} </span>
              {/* Vertical Text Transition */}
              <span className="relative inline-flex overflow-hidden h-[1.25em] align-bottom pb-1">
                {prevSlide && (
                  <span
                    key={`prev-${prev}`}
                    className={`absolute left-0 top-0 whitespace-nowrap animate-hero-slide-out ${prevSlide.accentClass}`}
                  >
                    {prevSlide.highlight}
                  </span>
                )}
                <span
                  key={`curr-${current}`}
                  className={`inline-block whitespace-nowrap ${
                    prevSlide ? "animate-hero-slide-in" : ""
                  } ${activeSlide.accentClass}`}
                >
                  {activeSlide.highlight}
                </span>
              </span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed transition-opacity duration-500">
            {activeSlide.sub}
          </p>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2 pt-1">
            {DASH_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPrev(current);
                  setCurrent(i);
                  setTimeout(() => setPrev(null), 600);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/profile"
            className="btn bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Award size={14} className="text-blue-600" /> Profile &amp; Skills
          </Link>
          <Link
            href="/mentorship"
            className="btn bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Users size={14} /> 1:1 Mentorship
          </Link>
          <form action={logoutAction}>
            <button className="btn bg-white/10 hover:bg-white/20 text-white text-xs py-2.5 px-4 rounded-xl transition font-semibold">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

