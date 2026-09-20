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
  FileText,
  Bookmark,
  Sparkles,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { UserOut, PagedColleges, PagedInternships } from "@/lib/types";
import { colleges as fallbackColleges, internships as fallbackInternships } from "@/lib/mock";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user: UserOut | null = null;
  let topColleges: any[] = fallbackColleges.slice(0, 6);
  let topInternships: any[] = fallbackInternships.slice(0, 6);

  try {
    const [u, cRes, iRes] = await Promise.all([
      api<UserOut>("/api/v1/me").catch(() => null),
      api<PagedColleges>("/api/v1/colleges?page_size=6").catch(() => null),
      api<PagedInternships>("/api/v1/internships?page_size=6").catch(() => null),
    ]);
    user = u;
    if (cRes && cRes.items && cRes.items.length > 0) topColleges = cRes.items;
    if (iRes && iRes.items && iRes.items.length > 0) topInternships = iRes.items;
  } catch {}

  const displayName = user?.student?.first_name || user?.college_rep?.first_name || user?.recruiter_profile?.first_name || user?.profile?.first_name || "User";

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Dynamic Role-Tailored Hero Section */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 text-white py-14 md:py-18">
        <div className="container-page text-center max-w-4xl space-y-6">
          {/* Guest Badge vs Student/Role Badge */}
          {!user ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <ShieldCheck size={14} /> National Higher Education & Campus Hiring Directory
            </div>
          ) : user.role === "student" ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <GraduationCap size={15} /> Student Admissions & Placement Command Center
            </div>
          ) : user.role === "college_rep" ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Building2 size={15} /> Institutional Admissions Management Desk
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <Briefcase size={15} /> Corporate Recruitment & Talent Acquisition Hub
            </div>
          )}

          {/* Heading */}
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {!user
              ? "Connecting Students, Accredited Colleges & Top Employers"
              : user.role === "student"
              ? `Welcome back, ${displayName}`
              : user.role === "college_rep"
              ? `Admissions Desk: ${user.college_rep?.college_name || "Institution"}`
              : `Hiring Hub: ${user.recruiter_profile?.company_name || "Company"}`}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {!user
              ? "Discover verified college cutoffs, fee structures, and genuine placement reports — or apply directly to vetted tech internships and campus recruitment drives."
              : user.role === "student"
              ? "Track your college applications, explore top tech internships with verified stipends, and connect 1:1 with alumni mentors."
              : user.role === "college_rep"
              ? "Manage incoming student counseling inquiries, update cutoffs for 2026/2027 admissions, and monitor campus lead conversions."
              : "Review applicants in your ATS pipeline, manage active internship listings, and discover verified campus engineering talent."}
          </p>

          {/* Quick Action Strip for Logged-In Users */}
          {user && user.role === "student" && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Link href="/dashboard" className="btn-primary text-xs py-2 px-4 font-bold shadow-sm flex items-center gap-1.5">
                <GraduationCap size={14} /> Student Desk
              </Link>
              <Link href="/profile" className="btn bg-white hover:bg-slate-100 text-slate-900 text-xs py-2 px-3.5 font-bold shadow-sm flex items-center gap-1.5">
                <Award size={14} className="text-blue-600" /> My Profile
              </Link>
              <Link href="/applications" className="btn bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 px-3.5 font-semibold border border-slate-700 flex items-center gap-1.5">
                <FileText size={13} /> Applications
              </Link>
              <Link href="/mentorship" className="btn bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 px-3.5 font-semibold border border-slate-700 flex items-center gap-1.5">
                <Users size={13} /> 1:1 Mentorship
              </Link>
              <Link href="/ai-finder" className="btn bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 px-3.5 font-semibold border border-slate-700 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" /> AI Matcher
              </Link>
            </div>
          )}

          {user && user.role === "college_rep" && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/dashboard/college" className="btn-primary text-xs py-2.5 px-5 font-bold shadow-sm flex items-center gap-1.5">
                <Building2 size={15} /> Open Admissions CRM & Leads
              </Link>
            </div>
          )}

          {user && user.role === "recruiter" && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/dashboard/recruiter" className="btn-primary text-xs py-2.5 px-5 font-bold shadow-sm flex items-center gap-1.5">
                <Briefcase size={15} /> Open Recruiter ATS Hub
              </Link>
            </div>
          )}

          {/* Clean Search Bar */}
          <div className="pt-2 max-w-2xl mx-auto">
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
                  className="btn-primary flex-1 sm:flex-none text-xs py-2.5 px-4 font-bold whitespace-nowrap"
                >
                  Find Colleges
                </Link>
                <Link
                  href="/internships"
                  className="btn-accent flex-1 sm:flex-none text-xs py-2.5 px-4 font-bold whitespace-nowrap"
                >
                  Find Internships
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
              <span>Popular:</span>
              <Link href="/colleges?q=IIT" className="text-blue-300 hover:underline">IIT Bombay</Link>
              <span>•</span>
              <Link href="/colleges?q=VNR" className="text-blue-300 hover:underline">VNR VJIET</Link>
              <span>•</span>
              <Link href="/internships?q=SDE" className="text-blue-300 hover:underline">Amazon SDE Intern</Link>
              <span>•</span>
              <Link href="/compare" className="text-blue-300 hover:underline">Compare Rankings</Link>
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
              ₹1.5 L/mo
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Top Tech Stipend</div>
          </div>

          <div className="text-center p-3">
            <div className="font-display text-2xl md:text-3xl font-bold text-slate-900">
              100%
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">Database Verified</div>
          </div>
        </div>
      </section>

      {/* 3. Role-Tailored Highlights */}
      {!user ? (
        /* Guest 3-Sided Ecosystem Portals */
        <section className="container-page space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <Badge variant="blue">Ecosystem Portals</Badge>
            <h2 className="section-title mt-2">Built for the Entire Higher Education Ecosystem</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your path to access tailored discovery and recruitment tools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Student Card */}
            <div className="card p-6 flex flex-col justify-between border-slate-200 hover:border-blue-400 transition shadow-sm">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 mb-4">
                  <GraduationCap size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">For Students</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Search NIRF-ranked institutions, compare fees, and apply directly to verified tech internships with genuine stipends.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                    <span>Real-time college cutoffs & placement reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                    <span>1:1 Alumni mentorship booking</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href="/auth/register?role=student" className="btn-primary w-full text-xs font-bold py-2.5">
                  Register as Student
                </Link>
              </div>
            </div>

            {/* College Card */}
            <div className="card p-6 flex flex-col justify-between border-slate-200 hover:border-blue-400 transition shadow-sm">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
                  <Building2 size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">For Colleges</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Showcase campus infrastructure, publish official cutoff benchmarks, and manage incoming counseling inquiries.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>Dedicated admissions lead CRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                    <span>Accreditation & cutoff management</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href="/auth/register?role=college_rep" className="btn-outline w-full text-xs font-bold py-2.5">
                  Register as College Rep
                </Link>
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="card p-6 flex flex-col justify-between border-slate-200 hover:border-blue-400 transition shadow-sm">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white mb-4">
                  <Briefcase size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">For Recruiters</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  Post internship openings, screen verified candidates, and run streamlined campus recruitment drives.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-slate-800 shrink-0" />
                    <span>Publish hiring drives across 500+ campuses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-slate-800 shrink-0" />
                    <span>Interactive ATS candidate pipeline</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link href="/auth/register?role=recruiter" className="btn-outline w-full text-xs font-bold py-2.5">
                  Register as Recruiter
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : user.role === "student" ? (
        /* Student Personalized Acceleration Strip */
        <section className="container-page">
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[11px] font-bold">
                  <Sparkles size={13} /> Personalized Career Recommendations
                </div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Accelerate Your Campus Placement & Higher Education
                </h3>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  Discover matching courses based on your board marks, apply to verified tech internships, or book 1:1 mock interview sessions with verified alumni engineers.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/ai-finder" className="btn-primary text-xs py-2.5 px-4 font-bold shadow-sm">
                  Run AI Course Matcher →
                </Link>
                <Link href="/mentorship" className="btn bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs py-2.5 px-4 font-bold shadow-xs">
                  Book 1:1 Mentor
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 4. Top Accredited Colleges Showcase */}
      <section className="container-page space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <Badge variant="brand">Institutions</Badge>
            <h2 className="section-title mt-1.5">Top Accredited Colleges & Universities</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore NIRF ranked institutions with verified placements and course cutoffs.</p>
          </div>
          <Link href="/colleges" className="btn-outline text-xs py-2 px-3 flex items-center gap-1 shrink-0 font-semibold">
            View All Colleges <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topColleges.map((c) => (
            <div key={c.id} className="card p-5 hover:border-blue-400 transition flex flex-col justify-between shadow-xs">
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
                    {c.nirf_rank ? `NIRF #${c.nirf_rank}` : `★ ${c.rating || "4.5"}`}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Package</span>
                    <span className="font-bold text-slate-900">₹{c.avg_package_lpa || c.avg_package || "8.5"} LPA</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Highest CTC</span>
                    <span className="font-bold text-emerald-700">₹{c.highest_package_lpa || c.highest_package || "45"} LPA</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Ranked #{c.nirf_rank || "Top"} in India</span>
                <Link href={`/colleges/${c.slug}`} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View Programs <ArrowRight size={12} />
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
            <p className="text-xs text-slate-500 mt-0.5">Apply directly to software, data science, and AI internships with verified stipends.</p>
          </div>
          <Link href="/internships" className="btn-outline text-xs py-2 px-3 flex items-center gap-1 shrink-0 font-semibold">
            View All Drives <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topInternships.map((job) => {
            const companyName = job.company?.name || job.company || "Tech Corp";
            const cityName = job.location_city || job.city || "Bangalore";
            return (
              <div key={job.id} className="card p-5 hover:border-blue-400 transition flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">{companyName}</span>
                      <Link
                        href={`/internships/${job.slug}`}
                        className="font-display text-sm font-bold text-slate-900 hover:text-blue-600 transition block mt-0.5"
                      >
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{cityName}</span>
                        <span>•</span>
                        <span className="capitalize">{job.work_mode}</span>
                      </div>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-800 text-xs">
                      {companyName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {(job.skills || ["Java", "DSA"]).slice(0, 3).map((s: string) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-emerald-700">₹{(job.stipend_min || 80000).toLocaleString()}/mo</span>
                    <span className="text-[10px] text-slate-400 block">Stipend</span>
                  </div>
                  <Link
                    href={`/internships/${job.slug}`}
                    className="btn-primary text-xs py-1.5 px-3 font-bold"
                  >
                    View Role
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Guest Only Institutional Banner */}
      {!user && (
        <section className="container-page">
          <div className="rounded-xl bg-slate-900 p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-md">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Institutional Access</span>
              <h3 className="font-display text-2xl font-bold">Are you an Accredited College or Hiring Employer?</h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                List your campus programs, publish cutoffs, or register as an employer partner to post hiring drives and manage candidates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/auth/register?role=college_rep"
                className="btn bg-white hover:bg-slate-100 text-slate-900 font-bold px-4 py-2.5 rounded-lg text-xs"
              >
                Register as College
              </Link>
              <Link
                href="/auth/register?role=recruiter"
                className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-lg text-xs"
              >
                Register as Employer
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
