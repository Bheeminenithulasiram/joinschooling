import Link from "next/link";
import {
  ArrowRight,
  Search,
  Sparkles,
  GraduationCap,
  Briefcase,
  Trophy,
  Award,
  BookOpen,
  Users,
  Compass,
  LineChart,
  ShieldCheck,
  Rocket,
  Star,
  TrendingUp,
  CheckCircle2,
  Zap,
  Building2,
  Layers,
  FileCheck,
  Coins
} from "lucide-react";
import { colleges, internships, workshops, hackathons, scholarships, stats } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";

const ecosystemPillars = [
  {
    role: "For Students",
    badge: "Student Hub",
    title: "Find Your Future & Dream Career",
    desc: "Discover 12,500+ colleges with authentic placement stats, apply to verified tech internships with ₹80k+ stipends, and get matched with our AI counselor in 30 seconds.",
    cta: "Explore Student Hub",
    href: "/colleges",
    color: "from-brand-600 to-indigo-600",
    features: ["NIRF & Placement Explorer", "AI College Recommendation", "1-Click Internship Applications", "Scholarships & Hackathons"],
  },
  {
    role: "For Colleges & Universities",
    badge: "Admissions Portal",
    title: "Attract Qualified Student Admissions",
    desc: "Showcase campus cutoffs, placement records, and fee structures to 4.5M+ active students. Manage prospective inquiries and convert top aspirants directly.",
    cta: "Open Admissions Portal",
    href: "/dashboard/college",
    color: "from-emerald-600 to-teal-600",
    features: ["Student Lead Management", "Course Cutoff Publisher", "Campus Placement Showcase", "Brochure Inquiry Tracking"],
  },
  {
    role: "For Companies & Recruiters",
    badge: "Recruiter ATS",
    title: "Hire Verified Campus Tech Talent",
    desc: "Publish internship drives, hackathon bounties, and screen pre-assessed candidates filterable by CGPA, skills, and coding batch.",
    cta: "Launch Recruiter ATS",
    href: "/dashboard/recruiter",
    color: "from-sky-600 to-blue-700",
    features: ["Job & Internship Posting", "Full Pipeline Kanban ATS", "Resume & CGPA Talent Filter", "Campus Drive Scheduling"],
  },
];

const modules = [
  { icon: GraduationCap, title: "Colleges Directory", href: "/colleges", tint: "from-brand-500 to-brand-700", desc: "12,500+ colleges with placement stats & cutoff scores" },
  { icon: Sparkles, title: "AI College Finder", href: "/ai-finder", tint: "from-fuchsia-500 to-pink-600", desc: "Multi-factor personalized match algorithm" },
  { icon: Briefcase, title: "Tech Internships", href: "/internships", tint: "from-sky-500 to-blue-700", desc: "Top companies offering ₹50k–₹1.4L/mo stipends" },
  { icon: Compass, title: "Compare Colleges", href: "/compare", tint: "from-indigo-500 to-purple-600", desc: "Side-by-side fees, package & NIRF benchmark" },
  { icon: BookOpen, title: "Live Workshops", href: "/workshops", tint: "from-amber-500 to-orange-600", desc: "Expert-led cohorts in AI, React 19 & DSA" },
  { icon: Trophy, title: "Hackathons", href: "/hackathons", tint: "from-emerald-500 to-teal-600", desc: "Win from ₹60L+ prize pools & get hired" },
  { icon: Award, title: "Scholarships", href: "/scholarships", tint: "from-rose-500 to-red-600", desc: "Discover ₹120Cr+ in student merit & need aid" },
  { icon: Users, title: "Alumni Network", href: "/alumni", tint: "from-cyan-500 to-sky-600", desc: "Connect with mentors at Amazon, Google, MS" },
];

export default function LandingPage() {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[650px] w-[650px] rounded-full bg-brand-600/25 blur-[140px]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-accent-500/20 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-900/25 blur-[100px]" />

        {/* Dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="container-page relative grid gap-12 py-20 lg:grid-cols-12 lg:py-28 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-700/60 bg-brand-950/60 px-4 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur-md shadow-xs">
              <Sparkles size={13} className="text-brand-400" />
              <span>The 3-Sided Education & Career Ecosystem</span>
              <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                LIVE
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
              Where Students Find,
              <br />
              Colleges Admit &
              <br />
              <span className="gradient-text">
                Companies Hire.
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
              One unified platform empowering students to discover colleges & internships, assisting institutions with admissions, and connecting top recruiters with verified talent.
            </p>

            {/* Quick Search Bar */}
            <form action="/colleges" method="GET" className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-2xl backdrop-blur p-1.5 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20 transition duration-300 gap-2">
              <div className="flex items-center pl-3.5 text-slate-400 flex-1">
                <Search size={18} className="shrink-0" />
                <input
                  name="q"
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-400"
                  placeholder="Search IITs, NITs, Amazon SDE, Scholarships..."
                />
              </div>
              <button
                type="submit"
                className="btn-primary py-3 px-6 text-sm font-bold shrink-0"
              >
                Search Now <ArrowRight size={15} />
              </button>
            </form>

            {/* Quick Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Quick find:</span>
              {[
                { href: "/ai-finder", label: "🎯 AI College Matcher" },
                { href: "/internships", label: "💼 Amazon SDE (₹1.1L)" },
                { href: "/compare", label: "⚖️ Compare Colleges" },
                { href: "/scholarships", label: "💸 INSPIRE Scholarship" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 font-medium text-slate-300 transition hover:border-brand-500 hover:bg-brand-950 hover:text-white"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            {/* Live Ecosystem Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-8">
              {[
                { label: "Colleges Listed", val: `${(stats.colleges / 1000).toFixed(1)}k+` },
                { label: "Verified Internships", val: `${(stats.internships / 1000).toFixed(1)}k+` },
                { label: "Active Students", val: "4.5M+" },
                { label: "Recruiter Partners", val: "520+" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">{s.val}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Live Interactive Preview */}
          <div className="lg:col-span-5 relative">
            <div className="overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/90 shadow-2xl backdrop-blur-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-400 ml-2">Live Matching Engine</span>
                </div>
                <Badge variant="green">Active</Badge>
              </div>

              {/* Sample AI Matched Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400">98% Match Probability</span>
                    <h2 className="font-display text-lg font-bold text-white">IIT Bombay</h2>
                    <p className="text-xs text-slate-400">B.Tech Computer Science</p>
                  </div>
                  <span className="rounded-lg bg-brand-900/80 text-brand-300 text-xs px-2.5 py-1 font-bold">
                    NIRF #3
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-2.5 text-center">
                  <div className="rounded-xl bg-slate-900 p-2">
                    <div className="text-xs font-bold text-brand-300">₹21.8 LPA</div>
                    <div className="text-[9px] uppercase text-slate-500">Avg Pkg</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2">
                    <div className="text-xs font-bold text-emerald-400">98%</div>
                    <div className="text-[9px] uppercase text-slate-500">Placed</div>
                  </div>
                  <div className="rounded-xl bg-slate-900 p-2">
                    <div className="text-xs font-bold text-amber-300">4.9 ★</div>
                    <div className="text-[9px] uppercase text-slate-500">Rating</div>
                  </div>
                </div>
              </div>

              {/* Hot Internship Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-lg">
                      🟠
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">SDE Intern</div>
                      <div className="text-xs text-slate-400">Amazon · Hyderabad</div>
                    </div>
                  </div>
                  <Badge variant="blue">Hybrid</Badge>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                  <span className="font-bold text-brand-400">₹80,000–₹1,10,000 / mo</span>
                  <Link href="/internships/amazon-sde-intern" className="text-xs text-white font-semibold hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>

              <Link
                href="/ai-finder"
                className="btn-primary w-full py-2.5 text-xs font-bold text-center"
              >
                <Sparkles size={14} /> Run Your AI Match Analysis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3-SIDED ECOSYSTEM PILLARS ─── */}
      <section className="container-page">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <Badge variant="brand">Three-Sided Marketplace</Badge>
          <h2 className="section-title">Built for Everyone in Higher Education</h2>
          <p className="text-slate-600 text-sm sm:text-base">
            JoinSchooling connects the entire education loop — empowering students, facilitating college admissions, and automating corporate hiring.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {ecosystemPillars.map((p) => (
            <div
              key={p.role}
              className="card p-7 flex flex-col justify-between hover:border-brand-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-400">{p.role}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-slate-900 group-hover:text-brand-700 transition">
                  {p.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.desc}
                </p>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Included Features</span>
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={p.href}
                  className="btn-outline w-full text-xs font-bold py-2.5 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition"
                >
                  {p.cta} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MODULES GRID ─── */}
      <section className="container-page">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="accent">Complete Toolkit</Badge>
            <h2 className="section-title mt-2">Explore Every Dimension</h2>
            <p className="mt-1 text-sm text-slate-500">
              Everything you need across discovery, admission, skill development, and placements.
            </p>
          </div>
          <Link href="/dashboard" className="btn-outline text-xs">
            Open Dashboard <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group card p-5 hover:border-brand-300 hover:shadow-lg transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${m.tint} text-white shadow-sm transition group-hover:scale-110 duration-200`}>
                  <m.icon size={20} />
                </div>
                <div className="font-display text-base font-bold text-slate-900 group-hover:text-brand-700 transition">
                  {m.title}
                </div>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-brand-700 transition-all group-hover:gap-2">
                Explore <ArrowRight size={13} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED TOP COLLEGES ─── */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/80">
        <div className="container-page space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge variant="green">Verified Institutions</Badge>
              <h2 className="section-title mt-2">Featured Top Colleges</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Explore campus fees, NIRF rankings, highest CTC, and verified alumni reviews.
              </p>
            </div>
            <Link href="/colleges" className="btn-primary text-xs py-2 px-4">
              View All 12,500+ Colleges <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {colleges.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/colleges/${c.slug}`}
                className="group card overflow-hidden hover:border-brand-400 hover:shadow-xl transition duration-300"
              >
                <div className="relative h-36 bg-gradient-to-br from-brand-700 via-indigo-800 to-slate-900 p-4 text-white flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="rounded-lg bg-white/20 backdrop-blur-md px-2.5 py-1 text-xs font-bold">
                      NIRF #{c.nirf_rank || "—"}
                    </span>
                    {c.tag && (
                      <span className="rounded-lg bg-amber-400 text-slate-950 px-2 py-0.5 text-[11px] font-extrabold">
                        ⭐ {c.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span>{c.rating}</span>
                    <span className="text-white/70 font-normal">({c.reviews_count} reviews)</span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-brand-700 transition">
                      {c.short_name || c.name}
                    </h3>
                    <p className="text-xs text-slate-500">{c.city}, {c.state} · <span className="capitalize">{c.type}</span></p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
                    <div>
                      <div className="text-sm font-bold text-brand-700">₹{c.avg_package_lpa} LPA</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Avg Pkg</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-600">{c.placement_percent}%</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Placed</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-700">₹{c.fees_per_year_lpa}L</div>
                      <div className="text-[10px] uppercase text-slate-400 font-semibold">Fee / yr</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOT INTERNSHIPS STRIP ─── */}
      <section className="container-page space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="blue">Recruiting Now</Badge>
            <h2 className="section-title mt-2">Hot Internships & Jobs</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Apply directly with 1-click to top engineering, AI, and product internships.
            </p>
          </div>
          <Link href="/internships" className="btn-outline text-xs">
            Browse All Internships <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {internships.slice(0, 6).map((i) => (
            <Link
              key={i.id}
              href={`/internships/${i.slug}`}
              className="card p-5 hover:border-brand-400 hover:shadow-lg transition duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-2xl">
                    {i.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-700 transition truncate">
                      {i.title}
                    </h3>
                    <p className="text-xs text-slate-500">{i.company} · {i.city || "Remote"}</p>
                  </div>
                  <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>
                    {i.work_mode}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {i.skills.slice(0, 3).map((s) => (
                    <span key={s} className="chip text-[11px] py-0.5 px-2">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-brand-700">₹{i.stipend_min.toLocaleString()}–{i.stipend_max.toLocaleString()}</span>
                  <span className="text-slate-400"> / mo</span>
                </div>
                <span className="text-slate-500 font-medium">{i.duration_months} months</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── AI COLLEGE FINDER CTA ─── */}
      <section className="container-page">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="grid gap-8 lg:grid-cols-2 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-900/60 border border-brand-700 px-3.5 py-1 text-xs font-bold text-brand-300">
                <Sparkles size={14} /> AI Recommendation Algorithm
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
                Not sure which college or career fits your profile?
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                Input your 10th/12th percentages, CGPA, target budget, and career goals. Our multi-factor weighted rubric calculates admission probability and match scores across 12,500+ colleges instantly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/ai-finder" className="btn-primary text-sm font-bold py-3 px-6 shadow-glow">
                  <Sparkles size={16} /> Launch AI College Matcher
                </Link>
                <Link href="/compare" className="btn bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-3 px-5 rounded-xl transition">
                  Compare Colleges Side-by-Side
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-400">Deterministic Scoring</div>
                <div className="font-display text-2xl font-extrabold text-white">5 Dimensions</div>
                <p className="text-xs text-slate-400">Academics 30%, Budget 20%, Placements 25%, Location 10%, Facilities 15%</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Admit Probability</div>
                <div className="font-display text-2xl font-extrabold text-white">85%+ Precision</div>
                <p className="text-xs text-slate-400">Based on verified 5-year historic closing cutoffs and rank trends</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-400">Instant Execution</div>
                <div className="font-display text-2xl font-extrabold text-white">30 Seconds</div>
                <p className="text-xs text-slate-400">No waiting. Instant shortlist with strengths, weaknesses, and package projections</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">100% Free</div>
                <div className="font-display text-2xl font-extrabold text-white">Zero Fees</div>
                <p className="text-xs text-slate-400">Accessible for all students without paywalls or mandatory sales calls</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
