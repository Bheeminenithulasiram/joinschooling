"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  Check,
} from "lucide-react";

interface PersonaCard {
  id: number;
  tag: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  themeBg: string;
  themeBorder: string;
  scrimGradient: string;
  image: string;
  imageAlt: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const CARDS: PersonaCard[] = [
  {
    id: 0,
    tag: "STUDENT PLATFORM",
    title: "For Students",
    shortDesc: "Compare colleges, check cutoffs & apply for internships.",
    fullDesc:
      "Find and compare colleges, check verified cutoffs & placements, and apply for paid internships in one place.",
    icon: GraduationCap,
    themeBg: "bg-blue-50/70",
    themeBorder: "border-blue-200/80",
    scrimGradient:
      "bg-gradient-to-r from-slate-950/95 via-blue-950/85 to-blue-900/40",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "University students collaborating on campus",
    features: [
      "Compare 5,000+ colleges by branch cutoffs & ROI",
      "Direct 1-click applications to verified internships",
    ],
    ctaLabel: "Register as Student",
    ctaHref: "/auth/register",
  },
  {
    id: 1,
    tag: "COLLEGES & INSTITUTES",
    title: "For Colleges",
    shortDesc: "Showcase programs, publish cutoffs & manage hiring drives.",
    fullDesc:
      "Showcase academic programs, publish official cutoffs, and manage campus internships & hiring drives effortlessly.",
    icon: Building2,
    themeBg: "bg-emerald-50/70",
    themeBorder: "border-emerald-200/70",
    scrimGradient:
      "bg-gradient-to-r from-slate-950/95 via-emerald-950/85 to-emerald-900/40",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Historic university campus architecture",
    features: [
      "Verified campus profile with official admission cutoffs",
      "End-to-end placement drive & recruiter scheduling",
    ],
    ctaLabel: "Partner with Us",
    ctaHref: "/auth/register?role=college_rep",
  },
  {
    id: 2,
    tag: "RECRUITERS & CORPORATE",
    title: "For Recruiters",
    shortDesc: "Post openings, screen candidates & run campus drives.",
    fullDesc:
      "Post openings, screen pre-verified candidates, and run seamless virtual or on-campus recruitment drives.",
    icon: Briefcase,
    themeBg: "bg-purple-50/70",
    themeBorder: "border-purple-200/70",
    scrimGradient:
      "bg-gradient-to-r from-slate-950/95 via-purple-950/85 to-purple-900/40",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Recruiters welcoming new graduate hires",
    features: [
      "Filter candidates by verified CGPA, skills & projects",
      "Coordinate multi-campus hiring from one dashboard",
    ],
    ctaLabel: "Register as Recruiter",
    ctaHref: "/auth/register?role=recruiter",
  },
];

export function EcosystemSection() {
  const [activeCard, setActiveCard] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-preview runs iteratively by default
  // Pauses immediately when user hovers on cards, resumes when unhovered
  useEffect(() => {
    if (isHovered) {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % CARDS.length);
    }, 3200);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isHovered]);

  return (
    <section className="w-full py-8 sm:py-12">
      <div className="container-page w-full">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 lg:mb-10">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="w-6 h-[2px] bg-blue-600 rounded-full" />
            <span className="text-xs font-bold tracking-[0.14em] uppercase text-blue-600">
              Explore Our Ecosystem
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.65rem] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            A Complete <span className="text-blue-600">Higher Education &amp; Career</span> Platform
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Everything you need — whether you&apos;re a student, a college, or a recruiter.
          </p>
        </div>

        {/* 3 Interactive Hover-Expand Accordion Cards (Filling Left to Right seamlessly) */}
        <div
          className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full lg:h-[460px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {CARDS.map((card) => {
            const isActive = activeCard === card.id;
            const Icon = card.icon;

            return (
              <article
                key={card.id}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setActiveCard(card.id);
                }}
                onClick={() => {
                  setActiveCard(card.id);
                }}
                className={`eco-card group relative rounded-2xl sm:rounded-3xl ${card.themeBg} border ${
                  card.themeBorder
                } overflow-hidden cursor-pointer flex flex-col justify-between p-6 sm:p-8 transition-all ${
                  isActive
                    ? "is-active shadow-xl min-h-[340px] lg:min-h-0"
                    : "min-h-[200px] lg:min-h-0 hover:shadow-md"
                }`}
              >
                {/* Background 4K Image (Smooth Ken-Burns reveal on active) */}
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="eco-bg-img absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />

                {/* Directional Scrim Gradient Overlay for Contrast */}
                <div
                  className={`eco-scrim absolute inset-0 ${card.scrimGradient} pointer-events-none`}
                />

                {/* Top Row: Clean Minimal Persona Label & Arrow (No Capsule Pill) */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-white/20 text-white backdrop-blur-md border border-white/30"
                          : "bg-blue-600 text-white shadow-xs"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      className={`text-xs font-extrabold tracking-wider uppercase transition-colors ${
                        isActive ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Arrow Indicator without pill capsule */}
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white/20 text-white backdrop-blur-md border border-white/25 scale-105"
                        : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                    }`}
                  >
                    <ArrowRight size={14} className={isActive ? "translate-x-0.5" : ""} />
                  </div>
                </div>

                {/* Middle / Expanded Content Area */}
                <div className="relative z-10 mt-auto pt-6">
                  <div className="eco-expanded-inner">
                    {/* Title */}
                    <h3
                      className={`text-2xl sm:text-[1.75rem] font-black tracking-tight transition-colors duration-300 ${
                        isActive ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {card.title}
                    </h3>

                    {/* Staggered Paragraph */}
                    <p className="stagger-item stagger-1 mt-2.5 text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-normal max-w-md">
                      {card.fullDesc}
                    </p>

                    {/* Staggered Feature List */}
                    <ul className="stagger-item stagger-2 mt-4 space-y-2 text-xs sm:text-sm text-white/95">
                      {card.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5 font-medium">
                          <span className="flex h-4 w-4 sm:h-5 sm:w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Solid White Action CTA (Matching Habitline style) */}
                    <div className="stagger-item stagger-3 mt-6">
                      <Link
                        href={card.ctaHref}
                        prefetch={true}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
                      >
                        <span>{card.ctaLabel}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Collapsed State Footer Teaser (Visible only when collapsed) */}
                <div className="eco-collapsed-footer absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-10">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 font-medium">
                    {card.shortDesc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
