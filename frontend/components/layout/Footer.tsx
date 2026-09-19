import Link from "next/link";
import { Sparkles, GraduationCap, Building2, Briefcase, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
              <Sparkles size={20} />
            </div>
            <span className="font-display text-xl font-extrabold text-white">
              Join<span className="text-brand-400">Schooling</span>
            </span>
          </Link>
          <p className="max-w-sm text-sm text-slate-400 leading-relaxed">
            The unified 3-sided education & career ecosystem. Empowering students to find ideal institutions, helping colleges drive admissions, and enabling top tech companies to recruit verified campus talent.
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><GraduationCap size={14} className="text-brand-400" /> 12,500+ Colleges</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Briefcase size={14} className="text-sky-400" /> 8,400+ Internships</span>
          </div>
        </div>

        {/* For Students */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">For Students</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/colleges" className="hover:text-white transition">College Explorer</Link></li>
            <li><Link href="/ai-finder" className="hover:text-white transition text-brand-400 font-medium">🎯 AI College Matcher</Link></li>
            <li><Link href="/internships" className="hover:text-white transition">Tech Internships</Link></li>
            <li><Link href="/compare" className="hover:text-white transition">Compare Colleges</Link></li>
            <li><Link href="/scholarships" className="hover:text-white transition">Scholarships & Aid</Link></li>
            <li><Link href="/workshops" className="hover:text-white transition">Live Cohort Workshops</Link></li>
          </ul>
        </div>

        {/* For Colleges & Recruiters */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Admissions & Hiring</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/dashboard/college" className="hover:text-white transition text-emerald-400">🏫 College Admissions Portal</Link></li>
            <li><Link href="/dashboard/recruiter" className="hover:text-white transition text-sky-400">💼 Recruiter ATS Portal</Link></li>
            <li><Link href="/auth/register" className="hover:text-white transition">List Your Institution</Link></li>
            <li><Link href="/auth/register" className="hover:text-white transition">Post Internship Drives</Link></li>
            <li><Link href="/alumni" className="hover:text-white transition">Alumni Mentorship</Link></li>
            <li><Link href="/hackathons" className="hover:text-white transition">Host Hackathons</Link></li>
          </ul>
        </div>

        {/* Platform & Resources */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Resources</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/roadmaps" className="hover:text-white transition">Career Roadmaps</Link></li>
            <li><Link href="/career" className="hover:text-white transition">Salary Explorer</Link></li>
            <li><Link href="/auth/login" className="hover:text-white transition">Member Sign In</Link></li>
            <li><Link href="/admin" className="hover:text-white transition text-purple-400">Admin Console</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 JoinSchooling Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span> <Heart size={12} className="text-rose-500 fill-rose-500 inline" /> <span>for the future of education.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
