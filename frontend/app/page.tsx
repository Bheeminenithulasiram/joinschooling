import Link from "next/link";
import { ArrowRight, Search, Sparkles, GraduationCap, Briefcase, Trophy, Award, BookOpen, Users, Compass, LineChart, ShieldCheck, Rocket, Star, TrendingUp, CheckCircle2, Zap } from "lucide-react";
import { colleges, internships, workshops, stats } from "@/lib/mock";
import { Badge } from "@/components/ui/Badge";

const modules = [
  { icon: GraduationCap, title: "Colleges", href: "/colleges", tint: "from-brand-500 to-brand-700", desc: "12,500+ colleges with placement stats & reviews" },
  { icon: Sparkles, title: "AI College Finder", href: "/ai-finder", tint: "from-fuchsia-500 to-pink-600", desc: "Get personalized recommendations in 30 seconds" },
  { icon: Briefcase, title: "Internships", href: "/internships", tint: "from-sky-500 to-blue-700", desc: "Apply to internships at top companies" },
  { icon: BookOpen, title: "Workshops", href: "/workshops", tint: "from-amber-500 to-orange-600", desc: "Live cohorts by top mentors" },
  { icon: Trophy, title: "Hackathons", href: "/hackathons", tint: "from-emerald-500 to-teal-600", desc: "Compete. Win prizes. Get hired." },
  { icon: Award, title: "Scholarships", href: "/scholarships", tint: "from-rose-500 to-red-600", desc: "Discover ₹cr+ in aid every year" },
  { icon: Compass, title: "Roadmaps", href: "/roadmaps", tint: "from-violet-500 to-indigo-600", desc: "Step-by-step guides to any career" },
  { icon: Users, title: "Alumni Network", href: "/alumni", tint: "from-cyan-500 to-sky-600", desc: "Connect with mentors from top companies" },
];

export default function LandingPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background glows */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-accent-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-brand-800/20 blur-[80px]" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="container-page relative grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
          {/* Left: Copy */}
          <div className="lg:col-span-6 lg:flex lg:flex-col lg:justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-800/60 bg-brand-900/40 px-4 py-1.5 text-xs font-medium text-brand-300 backdrop-blur">
              <Sparkles size={12} className="text-brand-400" />
              New: AI College Finder v2 is live
              <span className="ml-1 rounded-full bg-brand-700 px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Find your college.
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-fuchsia-400 to-accent-400 bg-clip-text text-transparent">
                Land your dream.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-400">
              One vibrant platform for students to discover colleges, apply to internships, join workshops, and grow with mentors — all in one place.
            </p>

            {/* Search */}
            <div className="mt-8 flex overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/60 shadow-lg backdrop-blur focus-within:border-brand-600/60 focus-within:ring-4 focus-within:ring-brand-500/20 transition-all duration-300">
              <div className="flex items-center pl-4 text-slate-500">
                <Search size={18} />
              </div>
              <input
                className="w-full bg-transparent px-3 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Search colleges, internships, workshops…"
              />
              <Link
                href="/colleges"
                className="m-1.5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-700 transition active:scale-[0.98]"
              >
                Search <ArrowRight size={14} />
              </Link>
            </div>

            {/* Quick tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { href: "/ai-finder", label: "🎯 AI Finder" },
                { href: "/internships", label: "💼 Amazon SDE" },
                { href: "/scholarships", label: "💸 INSPIRE" },
                { href: "/hackathons", label: "🏆 Smart India Hackathon" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="rounded-full border border-slate-700/60 bg-slate-800/40 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-600/60 hover:bg-brand-900/40 hover:text-brand-300 backdrop-blur"
                >
                  {tag.label}
                </Link>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-10 grid max-w-lg grid-cols-4 gap-4 border-t border-slate-800/60 pt-8">
              {[
                { v: stats.colleges, l: "Colleges" },
                { v: stats.internships, l: "Internships" },
                { v: stats.workshops, l: "Workshops" },
                { v: stats.alumni, l: "Alumni" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-2xl font-extrabold text-white">{s.v.toLocaleString()}+</div>
                  <div className="mt-0.5 text-xs text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: College cards preview */}
          <div className="relative lg:col-span-6">
            <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-br from-brand-600/10 to-accent-500/10 blur-2xl" />
            <div className="overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/50 shadow-2xl backdrop-blur">
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-slate-800/60 px-4 py-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Rocket size={14} className="text-brand-400" />
                  Top Colleges for You
                </div>
                <Badge variant="brand">
                  <Sparkles size={10} /> AI Matched
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4">
                {colleges.slice(0, 4).map((c, i) => (
                  <div
                    key={c.id}
                    className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 transition hover:border-brand-700/60 hover:bg-slate-800/60"
                  >
                    {/* Match badge */}
                    <div className="absolute right-2 top-2 rounded-full bg-emerald-900/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      {98 - i * 4}% match
                    </div>
                    <div className="h-20 rounded-xl" style={{ background: c.banner }} />
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white">{c.short_name}</div>
                        <span className="text-xs font-semibold text-slate-500">#{c.nirf_rank}</span>
                      </div>
                      <div className="text-xs text-slate-500">{c.city}</div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-brand-400">
                        <TrendingUp size={11} /> ₹{c.avg_package_lpa} LPA avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trending tags */}
              <div className="border-t border-slate-800/60 bg-gradient-to-r from-brand-900/20 to-transparent p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Zap size={13} className="text-amber-400" /> Trending near you
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Hyderabad", "IIT", "AI/ML", "Product", "Design"].map((t) => (
                    <span key={t} className="rounded-full border border-slate-700/60 bg-slate-800/60 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF STRIP ─── */}
      <section className="border-y border-slate-100 bg-slate-50 py-5">
        <div className="container-page flex flex-wrap items-center justify-center gap-8 text-sm text-ink-500">
          {[
            "🏆 #1 Student Platform 2025",
            "⭐ 4.9/5 from 50k+ reviews",
            "🎓 4M+ Students",
            "🏫 12,500+ Colleges",
            "💼 500+ Hiring Partners",
          ].map((item) => (
            <span key={item} className="font-medium">{item}</span>
          ))}
        </div>
      </section>

      {/* ─── MODULES GRID ─── */}
      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <Badge variant="accent">Everything, one place</Badge>
            <h2 className="section-title mt-2">Your entire student journey</h2>
            <p className="mt-2 max-w-xl text-ink-500">
              From discovery to placement — we cover every step of your academic and professional journey.
            </p>
          </div>
          <Link href="/dashboard" className="btn-outline hidden sm:flex">
            Open dashboard <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group card p-5 transition duration-300 hover:shadow-glow hover:-translate-y-0.5"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.tint} text-white shadow-sm transition group-hover:scale-110 duration-300`}>
                <m.icon size={20} />
              </div>
              <div className="font-display text-base font-bold">{m.title}</div>
              <p className="mt-1 text-sm text-ink-500 leading-relaxed">{m.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700 transition-all duration-200 group-hover:gap-2">
                Explore <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED COLLEGES ─── */}
      <section className="bg-slate-50/70 py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Badge variant="green">Trending</Badge>
              <h2 className="section-title mt-2">Featured colleges</h2>
            </div>
            <Link href="/colleges" className="btn-outline">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {colleges.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/colleges/${c.slug}`} className="group card overflow-hidden transition duration-300 hover:shadow-glow hover:-translate-y-0.5">
                <div className="relative h-36" style={{ background: c.banner }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {c.tag && (
                    <div className="absolute right-3 top-3">
                      <Badge variant="amber">⭐ {c.tag}</Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white">
                    <Star size={11} fill="currentColor" className="text-amber-400" /> {c.rating}
                    <span className="text-white/70 ml-1">({c.reviews_count.toLocaleString()})</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-lg font-bold group-hover:text-brand-700 transition">{c.short_name}</div>
                      <div className="mt-0.5 text-sm text-ink-500">{c.city}, {c.state}</div>
                    </div>
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-ink-500">
                      NIRF #{c.nirf_rank}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <div>
                      <div className="text-base font-bold text-brand-700">₹{c.avg_package_lpa}L</div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-500">Avg pkg</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-emerald-600">{c.placement_percent}%</div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-500">Placed</div>
                    </div>
                    <div>
                      <div className="text-base font-bold text-amber-500">{c.rating}★</div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-500">Rating</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOT INTERNSHIPS ─── */}
      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <Badge variant="blue">Hiring now</Badge>
            <h2 className="section-title mt-2">Hot internships this week</h2>
          </div>
          <Link href="/internships" className="btn-outline">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {internships.slice(0, 6).map((i) => (
            <Link key={i.id} href={`/internships/${i.slug}`} className="card p-5 transition duration-300 hover:shadow-glow hover:-translate-y-0.5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-2xl shadow-sm">{i.logo}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base font-bold truncate">{i.title}</div>
                  <div className="text-sm text-ink-500">{i.company}</div>
                </div>
                <Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>
                  {i.work_mode}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {i.skills.slice(0, 3).map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="font-semibold text-brand-700">₹{i.stipend_min?.toLocaleString()}–{i.stipend_max?.toLocaleString()}<span className="text-xs text-ink-500 font-normal">/mo</span></div>
                <div className="text-sm text-ink-500">{i.duration_months} months</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── AI FINDER CTA ─── */}
      <section className="container-page py-10">
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 text-white shadow-2xl lg:p-14">
          {/* Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-[80px]" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent-500/15 blur-[80px]" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-800/60 bg-brand-900/40 px-3.5 py-1.5 text-xs font-medium text-brand-300">
                <Sparkles size={12} /> AI-Powered Matching
              </div>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight lg:text-5xl">
                Not sure which college fits you?
              </h2>
              <p className="mt-3 max-w-lg text-slate-400 leading-relaxed">
                Answer 8 quick questions. Get a personalized shortlist ranked by academics, budget, placement, location & facilities — with admission probability for each.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/ai-finder" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700 transition active:scale-[0.98]">
                  Try the AI Finder <ArrowRight size={16} />
                </Link>
                <Link href="/colleges" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-[0.98]">
                  Browse colleges
                </Link>
              </div>
            </div>
            <div className="grid gap-3">
              {[
                { icon: LineChart, k: "Match Score", v: "94%", d: "Weighted rubric across 5 dimensions" },
                { icon: ShieldCheck, k: "Admission Probability", v: "82%", d: "Based on your 10th/12th/CGPA" },
                { icon: Sparkles, k: "Personalized", v: "30s", d: "Takes just 8 questions" },
              ].map((c) => (
                <div key={c.k} className="rounded-2xl border border-slate-800/60 bg-slate-900/50 p-4 backdrop-blur transition hover:border-brand-800/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-900/60 text-brand-400">
                      <c.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-slate-500">{c.k}</div>
                      <div className="font-display text-xl font-extrabold text-white">{c.v}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-slate-500">{c.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── WORKSHOPS STRIP ─── */}
      <section className="container-page py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <Badge variant="amber">Skill up</Badge>
            <h2 className="section-title mt-2">Live workshops</h2>
          </div>
          <Link href="/workshops" className="btn-outline">All workshops <ArrowRight size={16} /></Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {workshops.map((w) => (
            <Link key={w.id} href="/workshops" className="card overflow-hidden transition duration-300 hover:shadow-glow hover:-translate-y-0.5">
              <div className="relative h-28" style={{ background: w.hero }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute right-2 top-2">
                  <Badge variant={w.mode === "online" ? "green" : "blue"}>{w.mode}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">{w.category}</div>
                <div className="mt-1 font-display text-base font-bold leading-snug">{w.title}</div>
                <div className="mt-1 text-xs text-ink-500">{w.provider} · {new Date(w.date).toDateString()}</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm font-bold text-ink-900">₹{w.price}</div>
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={11} /> Enroll
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── AUDIENCE CTAs ─── */}
      <section className="bg-slate-50/70 py-20">
        <div className="container-page">
          <div className="mb-10 text-center">
            <h2 className="section-title">Built for everyone in education</h2>
            <p className="mt-3 mx-auto max-w-lg text-ink-500">
              Whether you are a student, recruiter, or institution — EduConnect is built to serve you.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: GraduationCap, t: "For Students", d: "Discover, apply and grow — all in one place.", color: "text-brand-600", bg: "bg-brand-50 border-brand-100" },
              { icon: Briefcase, t: "For Recruiters", d: "Reach 4M+ verified student profiles.", color: "text-sky-600", bg: "bg-sky-50 border-sky-100" },
              { icon: BookOpen, t: "For Colleges", d: "Showcase your programs & attract great students.", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
            ].map((c) => (
              <div key={c.t} className="card p-7 transition hover:shadow-glow">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${c.bg} ${c.color}`}>
                  <c.icon size={22} />
                </div>
                <div className="mt-5 font-display text-xl font-bold">{c.t}</div>
                <div className="mt-2 text-sm text-ink-500 leading-relaxed">{c.d}</div>
                <Link
                  href="/auth/register"
                  className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${c.color} hover:gap-2.5 transition-all duration-200`}
                >
                  Get started <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
