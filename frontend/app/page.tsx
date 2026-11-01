import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  Check,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Users,
  Flame,
  Trophy,
  Rocket,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import type { UserOut, PagedColleges, PagedInternships } from "@/lib/types";
import { colleges as fallbackColleges, internships as fallbackInternships } from "@/lib/mock";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user: UserOut | null = null;
  let topColleges: any[] = fallbackColleges.slice(0, 5);
  let topInternships: any[] = fallbackInternships.slice(0, 4);

  try {
    const [u, cRes, iRes] = await Promise.all([
      api<UserOut>("/api/v1/me").catch(() => null),
      api<PagedColleges>("/api/v1/colleges?page_size=5").catch(() => null),
      api<PagedInternships>("/api/v1/internships?page_size=4").catch(() => null),
    ]);
    user = u;
    if (cRes && cRes.items && cRes.items.length > 0) topColleges = cRes.items.slice(0, 5);
    if (iRes && iRes.items && iRes.items.length > 0) topInternships = iRes.items.slice(0, 4);
  } catch {}

  // 5 Template Colleges fallback list with exact rank numbers
  const displayColleges = [
    {
      rank: 1,
      name: "IIT Bombay",
      location: "Mumbai, Maharashtra",
      rating: "4.9",
      reviews: "12k+",
      slug: "iit-bombay",
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 2,
      name: "VNR VJIET",
      location: "Hyderabad, Telangana",
      rating: "4.8",
      reviews: "8k+",
      slug: "vnr-vjiet",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 3,
      name: "GITAM University",
      location: "Visakhapatnam, AP",
      rating: "4.7",
      reviews: "6k+",
      slug: "gitam-university",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 4,
      name: "KL University",
      location: "Vijayawada, AP",
      rating: "4.7",
      reviews: "5k+",
      slug: "kl-university",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 5,
      name: "BVRIT Hyderabad",
      location: "Hyderabad, Telangana",
      rating: "4.6",
      reviews: "4k+",
      slug: "bvrit-hyderabad",
      image: "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=300&auto=format&fit=crop",
    },
  ];

  // 4 Template Tech Internships
  const displayInternships = [
    {
      company: "Amazon",
      role: "Software Development Intern",
      tags: ["Java", "DSA", "System Design"],
      stipend: "₹30,000/mo",
      slug: "software-engineering-intern-amazon",
      logoBg: "bg-amber-50 text-amber-700",
      letter: "a",
    },
    {
      company: "Microsoft",
      role: "Software Engineering Intern",
      tags: ["Java", "DSA", "Cloud"],
      stipend: "₹120,000/mo",
      slug: "software-engineering-intern-microsoft",
      logoBg: "bg-blue-50 text-blue-600",
      letter: "MS",
    },
    {
      company: "TCS",
      role: "Data Science Intern",
      tags: ["Python", "ML", "SQL"],
      stipend: "₹25,000/mo",
      slug: "data-science-intern-tcs",
      logoBg: "bg-rose-50 text-rose-600",
      letter: "tcs",
    },
    {
      company: "ZS Associates",
      role: "Business Analytics Associate",
      tags: ["Java", "SQL", "Analytics"],
      stipend: "₹30,000/mo",
      slug: "business-analytics-associate-zs-associates",
      logoBg: "bg-slate-100 text-slate-800",
      letter: "ZS",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-hidden">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (2-Column with Student Illustration)     */}
      {/* ========================================================= */}
      <section className="relative pt-6 sm:pt-10">
        <div className="container-page">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold shadow-2xs">
                <Flame size={14} className="text-amber-500 fill-amber-500" />
                <span>India's Trusted Education & Career Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Discover Colleges, Internships <br />
                <span className="text-blue-600">&amp; Career Opportunities</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Explore verified colleges, real cutoffs, internship drives, and direct recruitment from top employers — all in one trusted platform.
              </p>

              {/* Search Bar */}
              <div className="pt-2 max-w-xl">
                <form
                  action="/colleges"
                  method="GET"
                  className="bg-white rounded-full p-2 pl-5 border border-slate-200/90 shadow-xl shadow-slate-200/40 flex items-center gap-2 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/50"
                >
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    name="q"
                    type="text"
                    placeholder="Search for colleges, courses, internships, or companies..."
                    className="flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-md transition flex items-center gap-1.5 shrink-0"
                  >
                    Search <ArrowRight size={13} />
                  </button>
                </form>

                {/* Popular Keywords Chips */}
                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                  <span className="font-bold text-slate-700 mr-1">Popular:</span>
                  {[
                    { label: "IIT Bombay", href: "/colleges/iit-bombay" },
                    { label: "VNR VJIET", href: "/colleges/vnr-vjiet" },
                    { label: "Amazon SDE Intern", href: "/internships/software-engineering-intern-amazon" },
                    { label: "Data Science Intern", href: "/internships?q=Data+Science" },
                    { label: "Compare Colleges", href: "/compare" },
                  ].map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200/70 px-3 py-1 text-[11px] font-medium text-slate-600 transition"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[480px]">
                {/* Soft Gradient Background Curved Shape */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 via-sky-50 to-indigo-100 rounded-3xl transform -rotate-1 scale-102" />

                {/* Main Hero Student Image */}
                <div className="relative rounded-3xl overflow-hidden border border-white/80 shadow-2xl bg-slate-100 aspect-4/5 sm:aspect-auto sm:h-[430px]">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop"
                    alt="Student discovering campus and career opportunities on JoinSchooling"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle Image Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>

                {/* Handwritten Floating Text Callout: "Build Your Dream Career" */}
                <div className="absolute -top-3 left-4 sm:-top-5 sm:left-6 z-10 bg-white/95 backdrop-blur-md border border-blue-100 px-4 py-2 rounded-2xl shadow-lg -rotate-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black italic text-blue-700 text-sm sm:text-base">
                      Build Your Dream Career
                    </span>
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9l6 6-6 6" />
                      <path d="M4 4v7a4 4 0 0 0 4 4h11" />
                    </svg>
                  </div>
                </div>

                {/* Floating Checklist Card on Bottom-Right */}
                <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 space-y-2.5 min-w-[170px] sm:min-w-[190px]">
                  {[
                    "Find Colleges",
                    "Get Internships",
                    "Apply for Jobs",
                    "Grow with Us",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. METRIC COUNTER STRIP (Horizontal Stat Bar)            */}
      {/* ========================================================= */}
      <section className="container-page">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-4 sm:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Stat 1 */}
          <div className="flex items-center gap-3.5 pt-2 md:pt-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold shrink-0">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-black text-slate-900 leading-tight">12,500+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Accredited Colleges</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 font-bold shrink-0">
              <Briefcase size={22} />
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-black text-slate-900 leading-tight">8,400+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Active Internship Drives</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold shrink-0">
              <IndianRupee size={22} />
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-black text-slate-900 leading-tight">₹1.5 L/mo</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Top Tech Stipend</div>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 font-bold shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-black text-slate-900 leading-tight">100%</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Database Verified</div>
            </div>
          </div>

          {/* Stat 5 */}
          <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-5 col-span-2 md:col-span-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold shrink-0">
              <Users size={22} />
            </div>
            <div>
              <div className="font-display text-lg sm:text-xl font-black text-slate-900 leading-tight">500+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">Hiring Employers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. "EXPLORE OUR ECOSYSTEM" (3-Sided Audience Cards)      */}
      {/* ========================================================= */}
      <section className="container-page space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-indigo-600 tracking-wide uppercase flex items-center gap-2">
              <span className="w-4 h-0.5 bg-indigo-600 inline-block" /> Explore Our Ecosystem
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              A Complete <span className="text-blue-600">Higher Education &amp; Career</span> Platform
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-slate-500 max-w-sm">
              Everything you need — whether you're a student, a college, or a recruiter.
            </p>
            <Link
              href="/colleges"
              className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shrink-0"
            >
              Explore All →
            </Link>
          </div>
        </div>

        {/* 3 Audience Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1: For Students */}
          <div className="relative rounded-3xl p-7 bg-gradient-to-br from-blue-50/90 to-sky-100/70 border border-blue-200/70 shadow-xs flex flex-col justify-between overflow-hidden min-h-[280px]">
            <div className="space-y-3 z-10 max-w-[65%]">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
                  <GraduationCap size={18} />
                </div>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                </div>
              </div>

              <h3 className="font-display text-xl font-extrabold text-slate-900">For Students</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Find and compare colleges, check cutoffs &amp; placements, and apply for verified internships.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  Register as Student →
                </Link>
              </div>
            </div>

            {/* Cutout Corner Image */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[85%] pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
                alt="Student Profile"
                className="w-full h-full object-cover object-top rounded-tl-3xl opacity-90 mix-blend-multiply"
              />
            </div>
          </div>

          {/* Card 2: For Colleges */}
          <div className="relative rounded-3xl p-7 bg-gradient-to-br from-emerald-50/90 to-teal-100/70 border border-emerald-200/70 shadow-xs flex flex-col justify-between overflow-hidden min-h-[280px]">
            <div className="space-y-3 z-10 max-w-[65%]">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
                  <Building2 size={18} />
                </div>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                </div>
              </div>

              <h3 className="font-display text-xl font-extrabold text-slate-900">For Colleges</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Showcase programs, publish cutoffs, manage internships &amp; hiring drives.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth/register?role=college_rep"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  Register as College Rep →
                </Link>
              </div>
            </div>

            {/* Cutout Corner Image */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[85%] pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=500&auto=format&fit=crop"
                alt="Colleges Campus"
                className="w-full h-full object-cover object-center rounded-tl-3xl opacity-85 mix-blend-multiply"
              />
            </div>
          </div>

          {/* Card 3: For Recruiters */}
          <div className="relative rounded-3xl p-7 bg-gradient-to-br from-purple-50/90 to-indigo-100/70 border border-purple-200/70 shadow-xs flex flex-col justify-between overflow-hidden min-h-[280px]">
            <div className="space-y-3 z-10 max-w-[65%]">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white font-bold shadow-xs">
                  <Briefcase size={18} />
                </div>
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </div>
              </div>

              <h3 className="font-display text-xl font-extrabold text-slate-900">For Recruiters</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Post openings, screen candidates, and run campus recruitment drives.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth/register?role=recruiter"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 shadow-sm transition"
                >
                  Register as Recruiter →
                </Link>
              </div>
            </div>

            {/* Cutout Corner Image */}
            <div className="absolute right-0 bottom-0 w-[45%] h-[85%] pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=500&auto=format&fit=crop"
                alt="Recruiter Handshake"
                className="w-full h-full object-cover object-center rounded-tl-3xl opacity-85 mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. "TOP ACCREDITED COLLEGES & UNIVERSITIES" (Row of 5)   */}
      {/* ========================================================= */}
      <section className="container-page space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Top Accredited Colleges &amp; Universities
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Carousel Arrow Controls */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                aria-label="Previous colleges"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                aria-label="Next colleges"
              >
                <ChevronRight size={15} />
              </button>
            </div>
            <Link
              href="/colleges"
              className="text-xs font-bold text-slate-700 hover:text-blue-600 transition"
            >
              View All Colleges →
            </Link>
          </div>
        </div>

        {/* 5 Compact Horizontal College Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {displayColleges.map((col) => (
            <Link
              key={col.slug}
              href={`/colleges/${col.slug}`}
              className="group bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition flex items-center gap-3"
            >
              <div className="relative w-13 h-13 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-amber-500">#{col.rank}</span>
                  <h4 className="font-display text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition">
                    {col.name}
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{col.location}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-800">{col.rating}</span>
                  <span className="text-slate-400">({col.reviews})</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. "LATEST VERIFIED TECH INTERNSHIPS" (4 Clean Cards)    */}
      {/* ========================================================= */}
      <section className="container-page space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Latest Verified Tech Internships
            </h2>
          </div>
          <Link
            href="/internships"
            className="text-xs font-bold text-slate-700 hover:text-blue-600 transition"
          >
            View All Internships →
          </Link>
        </div>

        {/* 4 Clean Internship Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayInternships.map((job) => (
            <div
              key={job.company}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Header: Company & Monogram Logo */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-400">{job.company}</span>
                    <h4 className="font-display text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {job.role}
                    </h4>
                  </div>
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${job.logoBg}`}>
                    {job.letter}
                  </div>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Stipend + View Details Button */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-display font-extrabold text-xs text-emerald-600">
                    {job.stipend}
                  </span>
                </div>
                <Link
                  href={`/internships/${job.slug}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-2xs transition"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. BOTTOM CALL-TO-ACTION BANNER                          */}
      {/* ========================================================= */}
      <section className="container-page">
        <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden">
          {/* Subtle Background Pattern Accent */}
          <div className="absolute left-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text with Rocket */}
          <div className="flex items-center gap-4 z-10 text-center md:text-left">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold shadow-lg shrink-0">
              <Rocket size={24} />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                Ready to Start Your Journey?
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Join thousands of students, colleges, and employers already on JoinSchooling.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 z-10 shrink-0">
            <Link
              href="/auth/register?role=college_rep"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold py-2.5 px-5 rounded-full backdrop-blur-xs transition"
            >
              Register as College
            </Link>
            <Link
              href="/auth/register?role=recruiter"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-lg transition flex items-center gap-1.5"
            >
              Register as Employer →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
