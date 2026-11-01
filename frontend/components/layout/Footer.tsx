import Link from "next/link";
import { GraduationCap, Building2, Briefcase, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
              <GraduationCap size={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-extrabold text-white tracking-tight">
                JoinSchooling
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Learn • Upskill • Grow
              </span>
            </div>
          </Link>
          <p className="max-w-sm text-xs text-slate-400 leading-relaxed">
            India's unified higher education and campus recruitment ecosystem. Connecting aspiring students with accredited colleges and top tech employers.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 size={13} className="text-blue-400" /> 12,500+ Colleges
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Briefcase size={13} className="text-emerald-400" /> 8,400+ Tech Drives
            </span>
          </div>
        </div>

        {/* For Students */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">For Students</div>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
            <li><Link href="/colleges" className="hover:text-white transition">Colleges & Cutoffs</Link></li>
            <li><Link href="/internships" className="hover:text-white transition">Internships & Hiring</Link></li>
            <li><Link href="/compare" className="hover:text-white transition">Compare Colleges</Link></li>
            <li><Link href="/career" className="hover:text-white transition">Salary Explorer</Link></li>
            <li><Link href="/scholarships" className="hover:text-white transition">Scholarships</Link></li>
            <li><Link href="/workshops" className="hover:text-white transition">Masterclasses</Link></li>
          </ul>
        </div>

        {/* For Colleges & Recruiters */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Portals</div>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
            <li><Link href="/dashboard/college" className="hover:text-white transition text-blue-400 font-semibold">Admissions Desk</Link></li>
            <li><Link href="/dashboard/recruiter" className="hover:text-white transition text-purple-400 font-semibold">Recruiter ATS Hub</Link></li>
            <li><Link href="/dashboard/mentor" className="hover:text-white transition text-emerald-400 font-semibold">Mentor Desk</Link></li>
            <li><Link href="/auth/register?role=college_rep" className="hover:text-white transition">Register College</Link></li>
            <li><Link href="/auth/register?role=recruiter" className="hover:text-white transition">Hire Student Talent</Link></li>
          </ul>
        </div>

        {/* Platform & Resources */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Resources</div>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
            <li><Link href="/roadmaps" className="hover:text-white transition">Career Roadmaps</Link></li>
            <li><Link href="/hackathons" className="hover:text-white transition">National Hackathons</Link></li>
            <li><Link href="/mentorship" className="hover:text-white transition">1:1 Mentorship</Link></li>
            <li><Link href="/auth/login" className="hover:text-white transition">Sign In</Link></li>
            <li><Link href="/admin" className="hover:text-white transition">Admin Console</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="container-page flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p>© 2026 JoinSchooling. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-400">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
