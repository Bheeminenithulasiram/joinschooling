import Link from "next/link";
import { GraduationCap, Building2, Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              <GraduationCap size={18} />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              JoinSchooling
            </span>
          </Link>
          <p className="max-w-sm text-xs text-slate-400 leading-relaxed">
            The national higher education and campus recruitment directory. Connecting aspiring students with accredited colleges and top tech employers.
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Building2 size={13} className="text-blue-400" /> 12,500+ Verified Colleges
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Briefcase size={13} className="text-emerald-400" /> 8,400+ Verified Jobs
            </span>
          </div>
        </div>

        {/* For Students */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">For Students</div>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
            <li><Link href="/colleges" className="hover:text-white transition">College Explorer & Cutoffs</Link></li>
            <li><Link href="/internships" className="hover:text-white transition">Internships & Hiring Drives</Link></li>
            <li><Link href="/compare" className="hover:text-white transition">Side-by-Side Comparison</Link></li>
            <li><Link href="/career" className="hover:text-white transition">Tech Salary Benchmarks</Link></li>
            <li><Link href="/scholarships" className="hover:text-white transition">Scholarships & Financial Aid</Link></li>
            <li><Link href="/workshops" className="hover:text-white transition">Technical Workshops</Link></li>
          </ul>
        </div>

        {/* For Colleges & Recruiters */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Institutional Portals</div>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
            <li><Link href="/dashboard/college" className="hover:text-white transition text-blue-400 font-medium">College Admissions Desk</Link></li>
            <li><Link href="/dashboard/recruiter" className="hover:text-white transition text-emerald-400 font-medium">Recruiter ATS Hub</Link></li>
            <li><Link href="/auth/register" className="hover:text-white transition">Register Your College</Link></li>
            <li><Link href="/auth/register" className="hover:text-white transition">Post Internship Drives</Link></li>
            <li><Link href="/alumni" className="hover:text-white transition">Alumni Mentorship Network</Link></li>
          </ul>
        </div>

        {/* Platform & Resources */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white">Platform</div>
          <ul className="mt-3.5 space-y-2 text-xs text-slate-400">
            <li><Link href="/roadmaps" className="hover:text-white transition">Career Preparation Guides</Link></li>
            <li><Link href="/hackathons" className="hover:text-white transition">National Hackathons</Link></li>
            <li><Link href="/auth/login" className="hover:text-white transition">Sign In to Account</Link></li>
            <li><Link href="/admin" className="hover:text-white transition">Admin Portal</Link></li>
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
