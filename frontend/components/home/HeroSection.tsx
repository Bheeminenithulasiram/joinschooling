"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  Users,
} from "lucide-react";

// 4K Ultra-High-Resolution Education & Campus Visuals for Hero Slideshow
const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=85&w=2560&auto=format&fit=crop",
    title: "University Architecture & Campus Excellence",
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=85&w=2560&auto=format&fit=crop",
    title: "Students Collaborating in Higher Education",
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=85&w=2560&auto=format&fit=crop",
    title: "Modern Tech Labs & Student Engineering",
  },
];

// 5 Ecosystem Metric Items with 100% Unique, Non-Repeated 4K Images for 3D Flip Card
const STATS = [
  {
    id: "colleges",
    target: 12500,
    format: (v: number) => `${Math.round(v).toLocaleString()}+`,
    label: "Accredited Colleges",
    icon: GraduationCap,
    iconBg: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=85&w=1200&auto=format&fit=crop",
    caption: "12,500+ Accredited Campuses",
    tag: "NIRF Tier-1",
  },
  {
    id: "internships",
    target: 8400,
    format: (v: number) => `${Math.round(v).toLocaleString()}+`,
    label: "Active Internship Drives",
    icon: Briefcase,
    iconBg: "bg-purple-500/20 text-purple-400 border border-purple-400/30",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=85&w=1200&auto=format&fit=crop",
    caption: "8,400+ Live Tech Drives",
    tag: "Hiring Now",
  },
  {
    id: "stipend",
    target: 1.5,
    format: (v: number) => `₹${v.toFixed(1)} L/mo`,
    label: "Top Tech Stipend",
    icon: IndianRupee,
    iconBg: "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=85&w=1200&auto=format&fit=crop",
    caption: "₹1.5L/mo Peak Stipends",
    tag: "Highest Pay",
  },
  {
    id: "verified",
    target: 100,
    format: (v: number) => `${Math.round(v)}%`,
    label: "Database Verified",
    icon: ShieldCheck,
    iconBg: "bg-sky-500/20 text-sky-400 border border-sky-400/30",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=85&w=1200&auto=format&fit=crop",
    caption: "Official JoSAA & NIRF Audits",
    tag: "100% Verified",
  },
  {
    id: "employers",
    target: 500,
    format: (v: number) => `${Math.round(v).toLocaleString()}+`,
    label: "Hiring Employers",
    icon: Users,
    iconBg: "bg-indigo-500/20 text-indigo-400 border border-indigo-400/30",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=85&w=1200&auto=format&fit=crop",
    caption: "Tier-1 Product Companies",
    tag: "500+ Recruiters",
  },
];

export function HeroSection() {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Dynamic Scroll/In-View Count-Up Animation
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const stripRef = useRef<HTMLDivElement | null>(null);

  // Background 4K Image Crossfade (Transitions every 6 seconds, untouched by card hover)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for Dynamic Scroll Trigger
  useEffect(() => {
    setIsClient(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (stripRef.current) {
      observer.observe(stripRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth Ease-Out Cubic Count-Up
  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    const duration = 1800; // 1.8 seconds

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased);

      if (rawProgress < 1) {
        requestAnimationFrame(step);
      }
    };

    const frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [inView]);

  return (
    <section
      data-theme="dark"
      className="relative w-full overflow-hidden bg-[#0A0F1D] text-white flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 select-none"
    >
      
      {/* Full-Bleed 4K Background Images with Smooth Crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {HERO_IMAGES.map((img, idx) => {
          const isActive = idx === activeImgIndex;
          return (
            <div
              key={img.url}
              className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                isActive ? "opacity-75 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className={`w-full h-full object-cover object-center brightness-105 contrast-105 transition-transform duration-[8000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              />
            </div>
          );
        })}

        {/* Atmospheric Lighting Overlays */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/25 rounded-full blur-[130px] pointer-events-none z-10" />
        <div className="absolute top-1/3 left-1/5 w-[520px] h-[520px] bg-blue-600/30 rounded-full blur-[140px] pointer-events-none z-10" />

        {/* Softened Vignette Gradients for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1D]/50 via-[#0A0F1D]/30 to-[#0A0F1D]/95 z-10" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#0A0F1D]/55 z-10" />
      </div>

      {/* Hero Foreground Content */}
      <div className="container-page relative z-20 text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto px-4 my-auto pb-14 sm:pb-20">
        
        {/* Monumental Centered Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-[76px] font-black tracking-tight leading-[1.06] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]">
          Build careers that <br />
          <span className="text-white drop-shadow-[0_4px_32px_rgba(255,255,255,0.3)]">
            actually happen
          </span>
        </h1>

        {/* Short, Meaningful Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-100 max-w-md mx-auto leading-relaxed font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Verified cutoffs, top tier-1 placements, and direct internship drives.
        </p>

        {/* Single Centered Solid White Action Button with Hover Animation */}
        <div className="flex items-center justify-center pt-2">
          <Link
            href="/colleges"
            prefetch={true}
            className="group bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm py-3.5 px-8 rounded-full shadow-2xl transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Explore Top Colleges</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200 ease-out" />
          </Link>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ATTACHED FULL-WIDTH METRIC STRIP: Fits Left to Right with Thin Dividing Lines */}
      {/* 3D Flip Card Effect: Hovering Flips the Card to Reveal Unique 4K Image     */}
      {/* ========================================================================= */}
      <div
        ref={stripRef}
        className="relative z-20 w-full border-t border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all"
      >
        <div className="w-full grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {STATS.map((stat, idx) => {
            // Dynamic count-up value
            const displayedValue = isClient
              ? inView
                ? stat.format(stat.target * progress)
                : stat.format(0)
              : stat.format(stat.target);

            return (
              <div
                key={stat.id}
                className={`group relative h-28 sm:h-32 lg:h-36 w-full [perspective:1000px] cursor-pointer ${
                  idx === 4 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                {/* 3D Flipping Card Body */}
                <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  
                  {/* FRONT FACE: Icon + Count-Up Number + Label */}
                  <div className="absolute inset-0 h-full w-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] flex items-center gap-3 sm:gap-3.5 px-3.5 sm:px-5 lg:px-6 bg-slate-900/40 group-hover:bg-slate-900/70 transition-colors">
                    <div
                      className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105 ${stat.iconBg}`}
                    >
                      <stat.icon size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-display text-base sm:text-lg lg:text-xl font-black text-white tracking-tight leading-tight group-hover:text-sky-300 transition-colors duration-200">
                        {displayedValue}
                      </div>
                      <div className="text-[11px] sm:text-xs text-slate-300 font-medium mt-0.5 group-hover:text-white transition-colors duration-200">
                        {stat.label}
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE: 100% Unique 4K Image (Revealed on 180deg Flip) */}
                  <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] overflow-hidden shadow-inner">
                    <img
                      src={stat.image}
                      alt={stat.caption}
                      className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Vignette Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/20" />
                    <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end text-left">
                      <span className="self-start px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[9px] font-extrabold uppercase tracking-wider mb-1 backdrop-blur-xs shadow-xs">
                        {stat.tag}
                      </span>
                      <p className="font-display text-xs sm:text-[13px] font-bold text-white leading-tight drop-shadow-md">
                        {stat.caption}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
