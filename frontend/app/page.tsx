import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Users,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { colleges, internships, stats } from "@/lib/mock";

export default function HomePage() {
  const topColleges = colleges.slice(0, 6);
  const topInternships = internships.slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Classic Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-20">
        <div className="container-page text-center max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <ShieldCheck size={14} /> National Higher Education & Campus Hiring Directory
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Connecting Students, Accredited Colleges & Top Employers
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover verified college cutoffs, fee structures, and genuine placement reports — or apply directly to vetted tech internships and campus recruitment drives.
          </p>

          {/* Clean Dual-Action Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-2 shadow-lg flex flex-col sm:flex-row items-center gap-2 border border-slate-200">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by college name, course, or internship role..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/colleges"
                  className="btn-primary flex-1 sm:flex-none text-xs py-2.5 px-4 font-semibold whitespace-nowrap"
                >
                  Find Colleges
                </Link>
                <Link
                  href="/internships"
                  className="btn-accent flex-1 sm:flex-none text-xs py-2.5 px-4 font-semibold whitespace-nowrap"
                >
                  Find Jobs
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span>Popular searches:</span>
              <Link href="/colleges?q=IIT" className="text-blue-300 hover:underline">IIT Bombay</Link>
              <span>•</span>
              <Link href="/colleges?q=VNR" className="text-blue-300 hover:underline">VNR VJIET</Link>
              <span>•</span>
              <Link href="/internships?q=SDE" className="text-blue-300 hover:underline">Amazon SDE Intern</Link>
              <span>•</span>
              <Link href="/compare" className="text-blue-300 hover:underline">Compare NIRF Tiers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Ecosystem Metrics */}
      <section className="container-page -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="text-center p-3 border-r border-slate-100 last:border-0">
            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              12,500+
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Accredited Colleges</div>
          </div>

          <div className="text-center p-3 border-r border-slate-100 last:border-0">
            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              8,400+
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Active Internship Drives</div>
          </div>

          <div className="text-center p-3 border-r border-slate-100 last:border-0">
            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              ₹1.2 Cr
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Highest Campus Package</div>
          </div>

          <div className="text-center p-3">
            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              42,000+
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Alumni & Industry Mentors</div>
          </div>
        </div>
      </section>

      {/* 3. The 3-Sided Ecosystem Portals */}
      <section className="container-page space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="section-title">One Ecosystem, Three Dedicated Portals</h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Designed to bring transparency and direct connection to students, universities, and corporate hiring teams.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Students Portal Card */}
          <div className="card p-6 border border-slate-200 hover:border-blue-500 transition flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold mb-4">
                <GraduationCap size={22} />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900">For Aspiring Students</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Access genuine college cutoff ranks, verified tuition fees, hostel statistics, placement track records, and 1-click internship applications.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>NIRF ranking & cutoff rank benchmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>Direct admissions counseling inquiries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>1-on-1 mentorship with verified alumni</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/colleges" className="btn-primary w-full text-xs font-semibold py-2">
                Explore College Directory
              </Link>
            </div>
          </div>

          {/* Colleges Portal Card */}
          <div className="card p-6 border border-slate-200 hover:border-emerald-500 transition flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold mb-4">
                <Building2 size={22} />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900">For Higher Ed Institutions</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Attract qualified student applications, showcase campus placement records, publish updated cutoffs, and manage prospective counseling inquiries.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Centralized student inquiry lead management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Verified course, seat, & cutoff listings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>Direct corporate placement drive access</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/college" className="btn-outline w-full text-xs font-semibold py-2">
                Open College Portal
              </Link>
            </div>
          </div>

          {/* Recruiters Portal Card */}
          <div className="card p-6 border border-slate-200 hover:border-slate-800 transition flex flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-800 font-bold mb-4">
                <Briefcase size={22} />
              </div>
              <h3 className="font-display text-base font-bold text-slate-900">For Corporate Recruiters</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Post verified internship drives, screen campus talent by CGPA and tech skills, and manage candidates through an integrated Kanban ATS.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-800 shrink-0" />
                  <span>Publish hiring drives across 500+ campuses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-800 shrink-0" />
                  <span>Interactive Kanban applicant review pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-slate-800 shrink-0" />
                  <span>Pre-screened engineering & tech candidates</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/dashboard/recruiter" className="btn-outline w-full text-xs font-semibold py-2">
                Open Recruiter ATS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Accredited Colleges Showcase */}
      <section className="container-page space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <Badge variant="brand">Institutions</Badge>
            <h2 className="section-title mt-1.5">Top Accredited Colleges & Universities</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore NIRF ranked institutions with verified placements and course cutoffs.</p>
          </div>
          <Link href="/colleges" className="btn-outline text-xs py-2 px-3 flex items-center gap-1 shrink-0">
            View All Colleges <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topColleges.map((c) => (
            <div key={c.id} className="card p-5 hover:border-blue-400 transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/colleges/${c.slug}`}
                      className="font-display text-sm font-bold text-slate-900 hover:text-blue-600 transition"
                    >
                      {c.name}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{c.city}, {c.state}</span>
                    </div>
                  </div>
                  <Badge variant="brand">
                    {c.nirf_rank ? `NIRF #${c.nirf_rank}` : `★ ${c.rating}`}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Package</span>
                    <span className="font-bold text-slate-900">₹{c.avg_package_lpa} LPA</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Highest CTC</span>
                    <span className="font-bold text-emerald-700">₹{c.highest_package_lpa} LPA</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Fees: ₹{c.fees_per_year_lpa}L / yr</span>
                <Link href={`/colleges/${c.slug}`} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View Cutoffs <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Active Corporate Hiring Drives */}
      <section className="container-page space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <Badge variant="green">Recruitment Drives</Badge>
            <h2 className="section-title mt-1.5">Latest Verified Tech Internships</h2>
            <p className="text-xs text-slate-500 mt-0.5">Apply directly to software, data science, and product internships for 2026/2027 graduates.</p>
          </div>
          <Link href="/internships" className="btn-outline text-xs py-2 px-3 flex items-center gap-1 shrink-0">
            View All Drives <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topInternships.map((job) => (
            <div key={job.id} className="card p-5 hover:border-blue-400 transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">{job.company}</span>
                    <Link
                      href={`/internships/${job.slug}`}
                      className="font-display text-sm font-bold text-slate-900 hover:text-blue-600 transition block mt-0.5"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{job.city}</span>
                      <span>•</span>
                      <span className="capitalize">{job.work_mode}</span>
                    </div>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-800 text-xs">
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-emerald-700">₹{job.stipend_min?.toLocaleString()}/mo</span>
                  <span className="text-[10px] text-slate-400 block">Stipend</span>
                </div>
                <Link
                  href={`/internships/${job.slug}`}
                  className="btn-primary text-xs py-1.5 px-3 font-semibold"
                >
                  View Role
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Institutional Partner Inquiry Banner */}
      <section className="container-page">
        <div className="rounded-xl bg-slate-900 p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Institutional Access</span>
            <h3 className="font-display text-2xl font-bold">Are you an Accredited College or Hiring Employer?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              List your campus programs, publish cutoffs, or register as an employer partner to post hiring drives and manage candidates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/dashboard/college"
              className="btn bg-white hover:bg-slate-100 text-slate-900 font-semibold px-4 py-2.5 rounded-lg text-xs"
            >
              College Admissions Portal
            </Link>
            <Link
              href="/dashboard/recruiter"
              className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-xs"
            >
              Recruiter ATS Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
