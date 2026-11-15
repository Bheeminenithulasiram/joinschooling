"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  PhoneCall,
  Mail,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

interface SlideData {
  id: number;
  staticPrefix: string;
  highlight: string;
  accentColor: string;
  accentClass: string;
  eyebrow: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  bgImage: string;
  badgeStat: string;
  tourTopic: string;
}

const HERO_SLIDES: SlideData[] = [
  {
    id: 0,
    staticPrefix: "Discover",
    highlight: "Top Colleges.",
    accentColor: "#38bdf8", // Sky 400
    accentClass: "text-sky-400 drop-shadow-[0_4px_16px_rgba(56,189,248,0.4)]",
    eyebrow: "Accredited Higher Education",
    description:
      "Explore 12,500+ verified universities, actual entrance cutoffs, NIRF rankings, and transparent fee structures across India.",
    primaryCta: { label: "Browse NIRF Colleges", href: "/colleges" },
    secondaryCta: { label: "Compare Cutoffs", href: "/compare" },
    bgImage:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop",
    badgeStat: "12,500+ Accredited Institutions",
    tourTopic: "Campus Discovery & Cutoffs Tour",
  },
  {
    id: 1,
    staticPrefix: "Secure",
    highlight: "Tech Internships.",
    accentColor: "#34d399", // Emerald 400
    accentClass: "text-emerald-400 drop-shadow-[0_4px_16px_rgba(52,211,153,0.4)]",
    eyebrow: "Verified Career Acceleration",
    description:
      "Access exclusive campus recruitment drives, verified high-stipend internships, and direct interview pipelines from 500+ tier-1 employers.",
    primaryCta: { label: "Browse Internships", href: "/internships" },
    secondaryCta: { label: "Salary Explorer", href: "/career" },
    bgImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop",
    badgeStat: "₹1.5L/mo Top Tech Stipends",
    tourTopic: "Internship Drives & Direct Apply",
  },
  {
    id: 2,
    staticPrefix: "Build",
    highlight: "Dream Careers.",
    accentColor: "#fbbf24", // Amber 400
    accentClass: "text-amber-400 drop-shadow-[0_4px_16px_rgba(251,191,36,0.4)]",
    eyebrow: "Placement & Outcome Driven",
    description:
      "Bridge the campus-to-corporate gap with verified salary benchmarks, role roadmaps, and interview preparation blueprints.",
    primaryCta: { label: "Explore Career Hub", href: "/career" },
    secondaryCta: { label: "View Hackathons", href: "/hackathons" },
    bgImage:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop",
    badgeStat: "100% Database Verified",
    tourTopic: "Placement & Salary Intelligence",
  },
  {
    id: 3,
    staticPrefix: "Connect with",
    highlight: "Alumni Mentors.",
    accentColor: "#c084fc", // Purple 400
    accentClass: "text-purple-400 drop-shadow-[0_4px_16px_rgba(192,132,252,0.4)]",
    eyebrow: "1:1 Industry Guidance",
    description:
      "Book 1-on-1 sessions for portfolio & resume reviews, mock coding interviews, and referral opportunities with engineers from FAANG.",
    primaryCta: { label: "Book 1:1 Mentorship", href: "/mentorship" },
    secondaryCta: { label: "Meet Top Alumni", href: "/alumni" },
    bgImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1920&auto=format&fit=crop",
    badgeStat: "500+ Verified Industry Mentors",
    tourTopic: "1:1 Mentorship Hub Walkthrough",
  },
];

const AUTOPLAY_INTERVAL = 4500; // ms

export function AnimatedHero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Transition handler
  const goToSlide = (nextIndex: number) => {
    if (isTransitioning || nextIndex === current) return;
    setIsTransitioning(true);
    setPrev(current);
    setCurrent(nextIndex);

    setTimeout(() => {
      setPrev(null);
      setIsTransitioning(false);
    }, 600);
  };

  const nextSlide = () => {
    const next = (current + 1) % HERO_SLIDES.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const next = (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToSlide(next);
  };

  // Autoplay effect with pause on hover
  useEffect(() => {
    if (isPaused || videoModalOpen) return;

    timerRef.current = setInterval(() => {
      goToSlide((current + 1) % HERO_SLIDES.length);
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused, videoModalOpen, isTransitioning]);

  const activeSlide = HERO_SLIDES[current];
  const prevSlideData = prev !== null ? HERO_SLIDES[prev] : null;

  return (
    <>
      {/* ========================================================= */}
      {/* ANIMATED CINEMATIC HERO SECTION                           */}
      {/* ========================================================= */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden bg-[#101A32] text-white min-h-[580px] sm:min-h-[640px] lg:min-h-[690px] flex items-center select-none"
      >
        {/* Background Images with Crossfade & Subtle Ken-Burns Scale */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === current;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={slide.bgImage}
                  alt={slide.highlight}
                  className={`w-full h-full object-cover object-center transition-transform duration-[6000ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
            );
          })}

          {/* Cinematic Navy Gradient Overlays for High Contrast & Text Legibility */}
          {/* Horizontal Gradient: Deep solid navy on left fading into transparent on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#101A32] via-[#101A32]/90 md:via-[#101A32]/85 to-[#101A32]/40 z-20" />
          {/* Vertical Vignette Gradient: Seamless top & bottom blends */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101A32] via-transparent to-[#101A32]/70 z-20" />
          {/* Subtle Radial Lighting Spotlight */}
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl z-20 pointer-events-none" />
        </div>

        {/* Foreground Content Container */}
        <div className="container-page relative z-30 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-7">
              {/* Trust Badge / Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-sm transition-all duration-300">
                <Flame size={14} className="text-amber-400 fill-amber-400 animate-pulse" />
                <span className="text-slate-200">India&apos;s Trusted Higher Education &amp; Career Ecosystem</span>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="hidden sm:inline text-sky-300 font-bold">{activeSlide.eyebrow}</span>
              </div>

              {/* Dynamic Animated Headline with Vertical Word Slider */}
              <div className="space-y-1">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-black tracking-tight leading-[1.08] text-white">
                  <span>{activeSlide.staticPrefix} </span>
                  {/* Vertical Text Transition Container */}
                  <span className="relative inline-flex overflow-hidden h-[1.2em] align-bottom pb-1">
                    {/* Outgoing Word Sliding Up & Fading Out */}
                    {prevSlideData && (
                      <span
                        key={`prev-${prevSlideData.id}`}
                        className={`absolute left-0 top-0 whitespace-nowrap animate-hero-slide-out ${prevSlideData.accentClass}`}
                      >
                        {prevSlideData.highlight}
                      </span>
                    )}
                    {/* Incoming Word Sliding Up From Below */}
                    <span
                      key={`curr-${activeSlide.id}`}
                      className={`inline-block whitespace-nowrap ${
                        prevSlideData ? "animate-hero-slide-in" : ""
                      } ${activeSlide.accentClass}`}
                    >
                      {activeSlide.highlight}
                    </span>
                  </span>
                </h1>
              </div>

              {/* Description / Subtitle with Crossfade */}
              <p
                key={`desc-${current}`}
                className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal transition-opacity duration-500"
              >
                {activeSlide.description}
              </p>

              {/* Integrated Search Bar with Quick Filter Pills */}
              <div className="pt-1 max-w-2xl space-y-3">
                <form
                  action="/colleges"
                  method="GET"
                  className="bg-white rounded-full p-2 pl-5 shadow-2xl flex items-center gap-2 border border-white/20 transition-all focus-within:ring-4 focus-within:ring-blue-400/40"
                >
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    name="q"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for colleges, entrance cutoffs, internships, or companies..."
                    className="flex-1 bg-transparent py-2 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full shadow-md transition flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    Search <ArrowRight size={14} />
                  </button>
                </form>

                {/* Popular Keywords Chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-300 text-[11px] mr-1">Popular:</span>
                  {[
                    { label: "IIT Bombay", href: "/colleges/iit-bombay" },
                    { label: "VNR VJIET", href: "/colleges/vnr-vjiet" },
                    { label: "Amazon SDE Intern", href: "/internships/software-engineering-intern-amazon" },
                    { label: "Data Science", href: "/internships?q=Data+Science" },
                    { label: "Compare Colleges", href: "/compare" },
                  ].map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 px-3 py-1 text-[11px] font-medium transition backdrop-blur-xs"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={activeSlide.primaryCta.href}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95"
                >
                  {activeSlide.primaryCta.label} <ArrowRight size={15} />
                </Link>

                <Link
                  href={activeSlide.secondaryCta.href}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl transition backdrop-blur-md"
                >
                  {activeSlide.secondaryCta.label}
                </Link>

                {/* Mobile/Tablet Tour Trigger Pill */}
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-300 text-xs font-bold border border-sky-400/30 transition"
                >
                  <Play size={13} className="fill-sky-300 text-sky-300" /> Watch Tour
                </button>
              </div>
            </div>

            {/* Right Interactive Play / Tour Column (Inspired by reference video!) */}
            <div className="lg:col-span-4 hidden lg:flex flex-col items-center justify-center relative">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Circular Play Button with Pulsing Glowing Outer Ring */}
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="group relative flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
                  aria-label="Watch Platform Tour Video"
                >
                  {/* Pulsing Ripple Effect */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ripple pointer-events-none" />

                  {/* Outer Circular Ring Border */}
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-white/80 bg-slate-900/60 backdrop-blur-md shadow-2xl transition duration-300 group-hover:border-sky-400 group-hover:bg-slate-900/80">
                    <Play
                      size={42}
                      className="ml-1.5 text-white fill-white transition duration-300 group-hover:text-sky-400 group-hover:fill-sky-400"
                    />
                  </div>
                </button>

                {/* Tour Caption */}
                <div className="space-y-1">
                  <div className="font-display text-base font-bold text-white tracking-wide">
                    Watch Platform Tour
                  </div>
                  <div className="text-xs text-slate-300 flex items-center justify-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>2-min Guided Walkthrough</span>
                  </div>
                </div>

                {/* Live Active Slide Pill */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] text-slate-200 font-semibold backdrop-blur-md">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    {activeSlide.badgeStat}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Slide Navigation & Floating Counseling Assistance */}
          <div className="mt-10 sm:mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Slide Navigation Progress Indicators */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90 border border-white/10"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90 border border-white/10"
                  aria-label="Next Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Numbered Indicator */}
              <span className="text-xs font-mono font-bold text-slate-400">
                0{current + 1} <span className="text-slate-600">/</span> 0{HERO_SLIDES.length}
              </span>

              {/* Progress Bars for Each Slide */}
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === current;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => goToSlide(idx)}
                      className="group flex flex-col items-center py-2 cursor-pointer focus:outline-none"
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-10 sm:w-14 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"
                            : "w-5 sm:w-8 bg-white/20 group-hover:bg-white/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Floating Assistance Card (Inspired by reference video bottom-right badge!) */}
            <div className="w-full md:w-auto flex items-center justify-end">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0b1329]/90 border border-white/15 backdrop-blur-md shadow-xl text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 size={18} />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    Free Admissions &amp; Career Counseling
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-3 pt-0.5">
                    <span className="flex items-center gap-1 hover:text-white transition">
                      <Mail size={11} className="text-sky-400" /> admissions@joinschooling.com
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">1800-JOIN-SCH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* VIDEO TOUR MODAL                                         */}
      {/* ========================================================= */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-[#101A32] p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <button
              onClick={() => setVideoModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close tour"
            >
              <X size={20} />
            </button>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <Sparkles size={13} /> Interactive Platform Walkthrough
              </div>
              <h3 className="font-display text-2xl font-bold">Discover JoinSchooling</h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Explore how students, colleges, and recruiters connect on India&apos;s trusted higher education and placement platform.
              </p>
            </div>

            {/* Video Player / Interactive Feature Showcase */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 relative flex items-center justify-center">
              <img
                src={activeSlide.bgImage}
                alt="Platform Preview"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101A32] via-transparent to-transparent" />
              <div className="absolute text-center space-y-3 p-6 max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg animate-pulse">
                  <Play size={24} className="ml-1" />
                </div>
                <div className="font-display text-lg font-bold text-white">
                  JoinSchooling Ecosystem Demo
                </div>
                <p className="text-xs text-slate-300">
                  Instant search across 12,500+ verified colleges, transparent cutoff benchmarks, and direct corporate recruitment pipelines.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/colleges"
                    onClick={() => setVideoModalOpen(false)}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    Explore Colleges Now
                  </Link>
                  <Link
                    href="/internships"
                    onClick={() => setVideoModalOpen(false)}
                    className="btn bg-white/10 hover:bg-white/20 text-white text-xs py-2 px-4 rounded-xl"
                  >
                    View Tech Internships
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Featuring accredited universities &amp; tier-1 companies</span>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="font-semibold text-slate-300 hover:text-white underline cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

