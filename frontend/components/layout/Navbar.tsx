"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  User,
  ChevronDown,
  ExternalLink,
  Layers,
  Settings,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    role: string;
    name?: string;
    student?: any;
    college_rep?: any;
    recruiter_profile?: any;
    mentor_profile?: any;
  } | null>(null);

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

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setUserDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 200);
  };

  const getDashboardUrl = (role?: string) => {
    if (role === "college_rep") return "/dashboard/college";
    if (role === "recruiter") return "/dashboard/recruiter";
    if (role === "mentor") return "/dashboard/mentor";
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  const getDashboardLabel = (role?: string) => {
    if (role === "college_rep") return "Admissions CRM";
    if (role === "recruiter") return "Recruiter ATS";
    if (role === "mentor") return "Mentor Desk";
    if (role === "admin") return "Admin Console";
    return "Student Career Desk";
  };

  const getRoleBadgeLabel = (role?: string) => {
    if (role === "college_rep") return "College Rep";
    if (role === "recruiter") return "Recruiter";
    if (role === "mentor") return "Mentor";
    if (role === "admin") return "Admin";
    return "Student";
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

  // Clean, focused center navigation links (no duplicate Desk/Profile/Application buttons)
  const getNavLinks = (role?: string) => {
    if (role === "student") {
      return [
        { href: "/colleges", label: "Colleges & Cutoffs" },
        { href: "/internships", label: "Internships & Jobs" },
        { href: "/mentorship", label: "1:1 Mentorship" },
        { href: "/compare", label: "Compare Colleges" },
        { href: "/ai-finder", label: "AI Matcher" },
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
  const displayName = currentUser?.name || currentUser?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand Logo - Redirects to Student Desk / Role Dashboard if logged in */}
        <Link
          href={currentUser ? getDashboardUrl(currentUser.role) : "/"}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-sm group-hover:scale-105 transition">
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
                ? "Admissions Management"
                : currentUser?.role === "recruiter"
                ? "Campus Recruitment"
                : currentUser?.role === "mentor"
                ? "Mentorship Desk"
                : "Higher Education Portal"}
            </span>
          </div>
        </Link>

        {/* Clean Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
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

        {/* Right Section: Guest links or Interactive User Profile Dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          {!currentUser ? (
            <>
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
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="btn-ghost text-xs py-2 px-3 font-semibold">
                  Log in
                </Link>
                <Link href="/auth/register" className="btn-primary text-xs py-2 px-4 shadow-sm font-bold">
                  Register Free
                </Link>
              </div>
            </>
          ) : (
            /* Interactive User Profile Hover/Click Dropdown */
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setUserDropdownOpen((v) => !v)}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition text-left cursor-pointer ${
                  userDropdownOpen
                    ? "bg-blue-50 border-blue-400 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                }`}
                aria-expanded={userDropdownOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold leading-tight">
                    {getRoleBadgeLabel(currentUser.role)}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-0 zoom-in-95 z-50">
                  {/* Dropdown User Info Header */}
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                        {getInitials(currentUser.name, currentUser.email)}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {displayName}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </span>
                        <span className="inline-block mt-1 self-start px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                          {currentUser.role.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-0.5 text-xs">
                    {/* Primary Role Desk */}
                    <Link
                      href={getDashboardUrl(currentUser.role)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                    >
                      <GraduationCap size={15} className="text-blue-600 shrink-0" />
                      <span>{getDashboardLabel(currentUser.role)}</span>
                    </Link>

                    {/* Student-specific options */}
                    {currentUser.role === "student" && (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <User size={15} className="text-slate-500 shrink-0" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/applications"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <FileText size={15} className="text-slate-500 shrink-0" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          href="/colleges/saved"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Building2 size={15} className="text-slate-500 shrink-0" />
                          <span>Saved Colleges</span>
                        </Link>
                        <Link
                          href="/internships/saved"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Bookmark size={15} className="text-slate-500 shrink-0" />
                          <span>Saved Internships</span>
                        </Link>
                      </>
                    )}

                    {/* Recruiter-specific options */}
                    {currentUser.role === "recruiter" && (
                      <>
                        <Link
                          href="/dashboard/recruiter"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Briefcase size={15} className="text-slate-500 shrink-0" />
                          <span>Candidate ATS Pipeline</span>
                        </Link>
                        <Link
                          href="/internships"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Layers size={15} className="text-slate-500 shrink-0" />
                          <span>Live Campus Postings</span>
                        </Link>
                      </>
                    )}

                    {/* College Rep specific options */}
                    {currentUser.role === "college_rep" && (
                      <>
                        <Link
                          href="/dashboard/college"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Building2 size={15} className="text-slate-500 shrink-0" />
                          <span>Admissions & Inquiries</span>
                        </Link>
                        <Link
                          href="/colleges"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Layers size={15} className="text-slate-500 shrink-0" />
                          <span>Accredited Institutions</span>
                        </Link>
                      </>
                    )}

                    {/* Mentor-specific options */}
                    {currentUser.role === "mentor" && (
                      <>
                        <Link
                          href="/dashboard/mentor"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Users size={15} className="text-slate-500 shrink-0" />
                          <span>Assigned Mentees & Bookings</span>
                        </Link>
                        <Link
                          href="/mentorship"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Compass size={15} className="text-slate-500 shrink-0" />
                          <span>1:1 Mentorship Hub</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Divider & Sign Out */}
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition text-left cursor-pointer"
                      >
                        <LogOut size={15} className="shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}
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
            {/* Logged in User Badge on Mobile */}
            {currentUser && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                    {getInitials(currentUser.name, currentUser.email)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{displayName}</div>
                    <div className="text-[10px] text-blue-700 font-semibold">{getRoleBadgeLabel(currentUser.role)}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-1">
              {currentUser && (
                <Link
                  href={getDashboardUrl(currentUser.role)}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold bg-blue-50 text-blue-700"
                >
                  <GraduationCap size={15} /> {getDashboardLabel(currentUser.role)}
                </Link>
              )}
              {currentUser?.role === "student" && (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link
                    href="/applications"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FileText size={15} /> My Applications
                  </Link>
                  <Link
                    href="/colleges/saved"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Building2 size={15} /> Saved Colleges
                  </Link>
                  <Link
                    href="/internships/saved"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Bookmark size={15} /> Saved Internships
                  </Link>
                </>
              )}

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
                <form action={logoutAction} className="w-full">
                  <button
                    type="submit"
                    className="btn-outline w-full text-xs text-rose-600 py-2.5 flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </form>
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
