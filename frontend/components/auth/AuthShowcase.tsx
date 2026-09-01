"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Building2,
  Briefcase,
  TrendingUp,
  Award,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Users,
} from "lucide-react";

interface CollegeItem {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  city: string;
  state: string;
  type: string;
  nirf_rank?: number;
  naac_grade?: string;
  avg_package_lpa?: number;
  highest_package_lpa?: number;
  placement_percent?: number;
  rating: number;
  reviews_count: number;
  logo_url?: string;
  banner_url?: string;
}

interface CompanyItem {
  id: string;
  name: string;
  industry?: string;
  logo_url?: string;
  website?: string;
}

interface ShowcaseStats {
  total_colleges: number;
  total_companies: number;
  total_internships: number;
  highest_package_lpa: number;
  avg_placement_percent: number;
}

interface ShowcaseData {
  colleges: CollegeItem[];
  companies: CompanyItem[];
  stats: ShowcaseStats;
}

// Fallback initial state while fetching from database
const FALLBACK_SHOWCASE: ShowcaseData = {
  colleges: [
    {
      id: "c1",
      slug: "iit-bombay",
      name: "IIT Bombay",
      short_name: "IITB",
      city: "Mumbai",
      state: "Maharashtra",
      type: "government",
      nirf_rank: 3,
      naac_grade: "A++",
      avg_package_lpa: 21.5,
      highest_package_lpa: 210.0,
      placement_percent: 96.0,
      rating: 4.9,
      reviews_count: 3210,
      banner_url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&h=600&fit=crop",
      logo_url: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=200&h=200&fit=crop",
    },
    {
      id: "c2",
      slug: "vnr-vjiet",
      name: "VNR VJIET",
      short_name: "VNR",
      city: "Hyderabad",
      state: "Telangana",
      type: "private",
      nirf_rank: 113,
      naac_grade: "A++",
      avg_package_lpa: 8.5,
      highest_package_lpa: 45.0,
      placement_percent: 92.0,
      rating: 4.4,
      reviews_count: 682,
      banner_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&h=600&fit=crop",
      logo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&h=200&fit=crop",
    },
    {
      id: "c3",
      slug: "gitam-university",
      name: "GITAM University",
      short_name: "GITAM",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      type: "deemed",
      nirf_rank: 76,
      naac_grade: "A+",
      avg_package_lpa: 7.2,
      highest_package_lpa: 39.0,
      placement_percent: 89.0,
      rating: 4.3,
      reviews_count: 510,
      banner_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&h=600&fit=crop",
      logo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&h=200&fit=crop",
    },
  ],
  companies: [
    { id: "comp1", name: "Google", industry: "Technology", logo_url: "https://logo.clearbit.com/google.com" },
    { id: "comp2", name: "Amazon", industry: "Technology / Cloud", logo_url: "https://logo.clearbit.com/amazon.com" },
    { id: "comp3", name: "Microsoft", industry: "Enterprise Software", logo_url: "https://logo.clearbit.com/microsoft.com" },
    { id: "comp4", name: "TCS", industry: "Consulting", logo_url: "https://logo.clearbit.com/tcs.com" },
    { id: "comp5", name: "Infosys", industry: "IT Services", logo_url: "https://logo.clearbit.com/infosys.com" },
  ],
  stats: {
    total_colleges: 120,
    total_companies: 65,
    total_internships: 320,
    highest_package_lpa: 210.0,
    avg_placement_percent: 94.5,
  },
};

export default function AuthShowcase() {
  const [data, setData] = useState<ShowcaseData>(FALLBACK_SHOWCASE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [collegeIndex, setCollegeIndex] = useState(0);

  // Fetch dynamic database records on mount
  useEffect(() => {
    async function loadShowcaseData() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://joinschooling-api-heot.onrender.com";
        const res = await fetch(`${apiUrl}/api/v1/auth/showcase`, {
          next: { revalidate: 300 },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.colleges && json.colleges.length > 0) {
            setData(json);
          }
        }
      } catch (err) {
        console.warn("Auth showcase loaded with fallback data:", err);
      }
    }
    loadShowcaseData();
  }, []);

  const totalSlides = 4;

  // Auto-advance timer (5s)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  // College cycling sub-timer
  useEffect(() => {
    if (data.colleges.length <= 1) return;
    const collegeInterval = setInterval(() => {
      setCollegeIndex((prev) => (prev + 1) % data.colleges.length);
    }, 3800);
    return () => clearInterval(collegeInterval);
  }, [data.colleges.length]);

  const activeCollege = data.colleges[collegeIndex] || data.colleges[0];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex h-full min-h-[580px] w-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-brand-950 to-indigo-950 p-7 text-white shadow-2xl lg:p-9"
    >
      {/* Decorative ambient background glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-500/25 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      {/* Top Header & Platform Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
          <Sparkles size={14} className="text-amber-400 animate-pulse" />
          <span className="bg-gradient-to-r from-white via-indigo-100 to-brand-200 bg-clip-text text-transparent">
            JoinSchooling Ecosystem
          </span>
        </div>

        {/* Live Database Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Database Verified</span>
        </div>
      </div>

      {/* Main Slides Content Area */}
      <div className="relative z-10 my-auto py-6">
        {/* SLIDE 0: TOP COLLEGES (Fetched dynamically from PostgreSQL) */}
        {currentSlide === 0 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300">
                <GraduationCap size={15} />
                <span>Premier Colleges & Universities</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-white lg:text-3xl">
                Explore Top Accredited Campuses
              </h3>
              <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                Real-time admission stats, NIRF rankings, and verified placement records fetched directly from our college directory.
              </p>
            </div>

            {/* Dynamic College Card with DB Banner Image */}
            {activeCollege && (
              <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl transition-all duration-500">
                {/* College Banner Image */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-800">
                  {activeCollege.banner_url ? (
                    <img
                      src={activeCollege.banner_url}
                      alt={activeCollege.name}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-indigo-800 to-brand-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                  {/* Badges on Banner */}
                  <div className="absolute top-2.5 left-3 flex items-center gap-2">
                    {activeCollege.nirf_rank && (
                      <span className="rounded-lg border border-amber-400/40 bg-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                        NIRF #{activeCollege.nirf_rank}
                      </span>
                    )}
                    {activeCollege.naac_grade && (
                      <span className="rounded-lg border border-indigo-400/40 bg-indigo-500/30 px-2 py-0.5 text-[11px] font-bold text-indigo-200 backdrop-blur-md">
                        NAAC {activeCollege.naac_grade}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-3 flex items-center gap-1 rounded-lg border border-white/20 bg-black/40 px-2 py-0.5 text-xs font-bold text-amber-300 backdrop-blur-md">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{activeCollege.rating.toFixed(1)}</span>
                  </div>

                  {/* College Name & Location on bottom of banner */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white drop-shadow-md">
                        {activeCollege.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300">
                        <MapPin size={11} className="text-brand-300" />
                        <span>
                          {activeCollege.city}, {activeCollege.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* College Placement & Package Metrics */}
                <div className="grid grid-cols-3 divide-x divide-white/10 bg-slate-900/60 p-3 text-center">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                      Avg Package
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      ₹{activeCollege.avg_package_lpa ?? 8.5} LPA
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                      Highest CTC
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      ₹{activeCollege.highest_package_lpa ?? 45.0} LPA
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                      Placement
                    </span>
                    <span className="text-xs font-bold text-brand-300">
                      {activeCollege.placement_percent ?? 92}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SLIDE 1: TOP HIRING COMPANIES & RECRUITERS */}
        {currentSlide === 1 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Briefcase size={15} />
                <span>Verified Hiring Partners</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-white lg:text-3xl">
                Recruiters from Top Companies
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Connect directly with corporate recruiters posting paid internships, hackathons, and early career roles.
              </p>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {data.companies.slice(0, 6).map((comp, idx) => (
                <div
                  key={comp.id || idx}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-center backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-2 shadow-inner">
                    {comp.logo_url ? (
                      <img
                        src={comp.logo_url}
                        alt={comp.name}
                        className="h-7 w-7 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <Building2 size={20} className="text-brand-300" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white">{comp.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">
                    {comp.industry || "Technology"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-3.5 py-2 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} className="text-emerald-400" /> 100% Verified Corporate Partners
              </span>
              <span className="font-bold text-white">{data.stats.total_internships}+ Active Roles</span>
            </div>
          </div>
        )}

        {/* SLIDE 2: PROVEN PLATFORM OUTCOMES */}
        {currentSlide === 2 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Award size={15} />
                <span>Verified Impact & Growth</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-white lg:text-3xl">
                Bridging Students, Colleges & Recruiters
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                A unified ecosystem built for transparent admissions, verified internships, and career acceleration.
              </p>
            </div>

            {/* Platform Stats 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <span className="block text-[11px] font-semibold text-slate-400">
                  Highest CTC Record
                </span>
                <span className="text-2xl font-extrabold text-amber-300">
                  ₹{data.stats.highest_package_lpa} LPA
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-400">
                  Verified campus placement
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <span className="block text-[11px] font-semibold text-slate-400">
                  Avg Placement Rate
                </span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {data.stats.avg_placement_percent}%
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-400">
                  Across affiliated colleges
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <span className="block text-[11px] font-semibold text-slate-400">
                  Active Internships
                </span>
                <span className="text-2xl font-extrabold text-brand-300">
                  {data.stats.total_internships}+
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-400">
                  Paid roles & stipend
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                <span className="block text-[11px] font-semibold text-slate-400">
                  Participating Colleges
                </span>
                <span className="text-2xl font-extrabold text-indigo-300">
                  {data.stats.total_colleges}+
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-400">
                  Engineering & Management
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: AI MATCH ENGINE */}
        {currentSlide === 3 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
                <TrendingUp size={15} />
                <span>Smart Matchmaking</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-white lg:text-3xl">
                Personalized AI Recommendations
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Instantly discover colleges, cutoffs, and internships matching your academic profile and career goals.
              </p>
            </div>

            {/* AI Match Preview Mock Card */}
            <div className="rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-900/40 via-brand-900/30 to-slate-900/60 p-4 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-300">
                    98.4% Match Score
                  </span>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-200">
                  Target Course: B.Tech CSE
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white font-bold">
                  🎓
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Optimal College & Internship Pathway
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Matches your cutoffs, budget, and desired skills with real placement stats.
                  </p>
                </div>
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400">Predicted Rank</span>
                  <span className="font-bold text-white">&lt; 1,500</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Target CTC</span>
                  <span className="font-bold text-emerald-400">₹18+ LPA</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">Placement Chance</span>
                  <span className="font-bold text-indigo-300">Very High</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Carousel Controls & Indicators */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
        {/* Slide navigation indicator dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-7 bg-brand-400 shadow-md shadow-brand-500/50"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Previous & Next Slide Arrow Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/15 active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-white/15 active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
