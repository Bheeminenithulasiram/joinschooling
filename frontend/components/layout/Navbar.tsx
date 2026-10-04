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
  User,
  ChevronDown,
  Sparkles,
  Users,
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

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "JS";
  };

  const navLinks = [
    { href: "/colleges", label: "Colleges & Cutoffs" },
    { href: "/internships", label: "Internships & Jobs" },
    { href: "/compare", label: "Compare Colleges" },
    { href: "/mentorship", label: "1:1 Mentorship" },
    { href: "/ai-finder", label: "AI Matcher" },
  ];

  const displayName = currentUser?.name || currentUser?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href={currentUser ? getDashboardUrl(currentUser.role) : "/"}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs group-hover:scale-105 transition">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-bold text-slate-900 leading-tight tracking-tight">
              JoinSchooling
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Education & Career Platform
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Guest Links or User Dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          {!currentUser ? (
            <>
              <div className="flex items-center gap-1 border-r border-slate-200 pr-3">
                <Link
                  href="/auth/register?role=college_rep"
                  className="text-xs font-semibold text-slate-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
                >
                  For Colleges
                </Link>
                <Link
                  href="/auth/register?role=recruiter"
                  className="text-xs font-semibold text-slate-600 hover:text-blue-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
                >
                  For Recruiters
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-xs transition"
                >
                  Register Free
                </Link>
              </div>
            </>
          ) : (
            /* User Dropdown */
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
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold leading-tight capitalize">
                    {currentUser.role.replace("_", " ")}
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
                <div className="absolute right-0 top-full mt-1.5 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-0 zoom-in-95 z-50">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">{displayName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  </div>

                  <div className="space-y-0.5 text-xs">
                    <Link
                      href={getDashboardUrl(currentUser.role)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                    >
                      <GraduationCap size={15} className="text-blue-600 shrink-0" />
                      <span>{getDashboardLabel(currentUser.role)}</span>
                    </Link>

                    {currentUser.role === "student" && (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <User size={15} className="text-slate-400 shrink-0" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/applications"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <FileText size={15} className="text-slate-400 shrink-0" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          href="/colleges/saved"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Building2 size={15} className="text-slate-400 shrink-0" />
                          <span>Saved Colleges</span>
                        </Link>
                        <Link
                          href="/internships/saved"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-semibold transition"
                        >
                          <Bookmark size={15} className="text-slate-400 shrink-0" />
                          <span>Saved Internships</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold text-xs transition cursor-pointer"
                      >
                        <LogOut size={14} />
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

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page py-4 space-y-3">
            <div className="grid gap-1">
              {navLinks.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    pathname === n.href ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </div>

            {!currentUser ? (
              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline flex-1 text-center text-xs font-semibold py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary flex-1 text-center text-xs font-bold py-2"
                >
                  Register Free
                </Link>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-center text-xs text-rose-600 font-bold py-2 hover:bg-rose-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
