"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  Briefcase,
  Building2,
  LogOut,
  Bookmark,
  FileText,
  Sparkles,
  Users,
  Compass,
  PlusCircle,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string; name?: string; student?: any; college_rep?: any; recruiter_profile?: any } | null>(null);

  useEffect(() => {
    // Check client session via Next.js Route Handler
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

  const getDashboardUrl = (role?: string) => {
    if (role === "college_rep") return "/dashboard/college";
    if (role === "recruiter") return "/dashboard/recruiter";
    if (role === "mentor") return "/dashboard/mentor";
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  const getRoleBadgeLabel = (role?: string) => {
    if (role === "college_rep") return "College Admissions";
    if (role === "recruiter") return "Corporate Recruiter";
    if (role === "mentor") return "Industry Mentor";
    if (role === "admin") return "Administrator";
    return "Student Career";
  };

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "JS";
  };

  // 100% Role-Tailored Navigation Links
  const getNavLinks = (role?: string) => {
    if (role === "student") {
      return [
        { href: "/dashboard", label: "Student Desk" },
        { href: "/profile", label: "Profile" },
        { href: "/colleges", label: "Colleges & Cutoffs" },
        { href: "/internships", label: "Internships & Jobs" },
        { href: "/mentorship", label: "1:1 Mentorship" },
        { href: "/compare", label: "Compare" },
        { href: "/ai-finder", label: "AI Matcher" },
        { href: "/applications", label: "Applications" },
      ];
    }
    if (role === "college_rep") {
      return [
        { href: "/dashboard/college", label: "Admissions CRM & Leads" },
        { href: "/colleges", label: "Accredited Colleges" },
        { href: "/compare", label: "Benchmark Rankings" },
      ];
    }
    if (role === "recruiter") {
      return [
        { href: "/dashboard/recruiter", label: "Hiring Hub & ATS" },
        { href: "/internships", label: "Live Postings" },
        { href: "/mentorship", label: "Campus Mentors" },
      ];
    }
    if (role === "mentor") {
      return [
        { href: "/dashboard/mentor", label: "Mentor Desk" },
        { href: "/mentorship", label: "1:1 Sessions" },
        { href: "/colleges", label: "Accredited Colleges" },
      ];
    }
    if (role === "admin") {
      return [
        { href: "/admin", label: "Admin Console" },
        { href: "/colleges", label: "Colleges" },
        { href: "/internships", label: "Internships" },
        { href: "/dashboard", label: "Student Desk" },
        { href: "/dashboard/college", label: "College Desk" },
        { href: "/dashboard/recruiter", label: "Recruiter Hub" },
        { href: "/dashboard/mentor", label: "Mentor Desk" },
      ];
    }
    // Guest (unauthenticated)
    return [
      { href: "/colleges", label: "Colleges & Cutoffs" },
      { href: "/internships", label: "Internships & Jobs" },
      { href: "/compare", label: "Compare Colleges" },
      { href: "/mentorship", label: "1:1 Mentorship" },
      { href: "/ai-finder", label: "AI Matcher" },
    ];
  };

  const navLinks = getNavLinks(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href={currentUser ? getDashboardUrl(currentUser.role) : "/"} className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-sm">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-slate-900 leading-none tracking-tight">
              JoinSchooling
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              {currentUser?.role === "student"
                ? "Student Career Portal"
                : currentUser?.role === "college_rep"
                ? "Institutional Admissions Portal"
                : currentUser?.role === "recruiter"
                ? "Campus Recruitment Hub"
                : "Higher Education & Placement Portal"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Role-Tailored Controls & Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Guest Only: Portal Information Links */}
          {!currentUser && (
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
              <Link
                href="/auth/register?role=college_rep"
                className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 transition"
              >
                <Building2 size={13} className="text-slate-400" /> For Colleges
              </Link>
              <Link
                href="/auth/register?role=recruiter"
                className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 transition"
              >
                <Briefcase size={13} className="text-slate-400" /> For Recruiters
              </Link>
            </div>
          )}

          {/* Student Logged In: Quick Shortcuts */}
          {currentUser && currentUser.role === "student" && (
            <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2">
              <Link
                href="/internships/saved"
                title="Saved Items"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
              >
                <Bookmark size={16} />
              </Link>
              <Link
                href="/applications"
                title="My Applications"
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
              >
                <FileText size={16} />
              </Link>
            </div>
          )}

          {/* Recruiter Logged In: Post Job Shortcut */}
          {currentUser && currentUser.role === "recruiter" && (
            <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
              <Link
                href="/dashboard/recruiter"
                className="btn bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 px-3 rounded-lg font-bold flex items-center gap-1 shadow-xs"
              >
                <PlusCircle size={13} /> Post Internship
              </Link>
            </div>
          )}

          {/* User Auth Profile Badge */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardUrl(currentUser.role)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition border border-slate-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
                <div className="hidden md:flex flex-col text-left pr-1">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name || currentUser.email?.split("@")[0]}
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold leading-tight">
                    {getRoleBadgeLabel(currentUser.role)} Desk →
                  </span>
                </div>
              </Link>
              <button
                onClick={async () => await logoutAction()}
                title="Log out"
                className="btn-outline p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn-ghost text-xs py-2 px-3 font-semibold">
                Log in
              </Link>
              <Link href="/auth/register" className="btn-primary text-xs py-2 px-4 shadow-sm font-bold">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden animate-in slide-in-from-top-2">
          <div className="container-page py-4 space-y-3">
            <div className="grid gap-1">
              {navLinks.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    pathname === n.href ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </div>

            {/* Mobile Guest Links */}
            {!currentUser && (
              <div className="border-t border-slate-100 pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                  Ecosystem Portals
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/register?role=college_rep"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <Building2 size={13} className="text-blue-600" /> For Colleges
                  </Link>
                  <Link
                    href="/auth/register?role=recruiter"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                  >
                    <Briefcase size={13} className="text-blue-600" /> For Recruiters
                  </Link>
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 pt-3 flex gap-2">
              {currentUser ? (
                <>
                  <Link
                    href={getDashboardUrl(currentUser.role)}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-center text-xs font-bold"
                  >
                    Open {getRoleBadgeLabel(currentUser.role)}
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await logoutAction();
                    }}
                    className="btn-outline text-xs text-rose-600"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline flex-1 text-center text-xs font-semibold"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-center text-xs font-bold"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
