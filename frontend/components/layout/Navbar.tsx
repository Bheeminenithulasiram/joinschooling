"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Building2,
  LogOut,
  User,
  Compass,
  Users,
  Award,
} from "lucide-react";
import { logoutAction, quickDemoLoginAction } from "@/lib/actions/auth";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string; name?: string } | null>(null);

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
    if (role === "admin") return "/admin";
    return "/dashboard";
  };

  const getRoleBadgeLabel = (role?: string) => {
    if (role === "college_rep") return "College Rep";
    if (role === "recruiter") return "Recruiter";
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

  const navLinks = [
    { href: "/colleges", label: "Colleges & Cutoffs" },
    { href: "/internships", label: "Internships & Jobs" },
    { href: "/compare", label: "Compare Colleges" },
    { href: "/career", label: "Career & Salaries" },
    { href: "/alumni", label: "Mentorship" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold text-slate-900 leading-none tracking-tight">
              JoinSchooling
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Higher Education & Placement Portal
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
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Institutional Links & Auth */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Institution & Recruiter Quick Portals */}
          <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
            <Link
              href="/dashboard/college"
              className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 transition"
            >
              <Building2 size={13} className="text-slate-400" /> For Colleges
            </Link>
            <Link
              href="/dashboard/recruiter"
              className="text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-slate-50 transition"
            >
              <Briefcase size={13} className="text-slate-400" /> For Recruiters
            </Link>
          </div>

          {/* User Auth Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardUrl(currentUser.role)}
                className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-50 transition border border-slate-200"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
                <div className="hidden md:flex flex-col text-left pr-2">
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
                className="btn-outline p-2 text-slate-500 hover:text-rose-600 rounded-lg"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn-ghost text-xs py-2 px-3">
                Log in
              </Link>
              <Link href="/auth/register" className="btn-primary text-xs py-2 px-3.5 shadow-sm">
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
                    pathname === n.href ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Ecosystem Portals
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard/college"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <Building2 size={13} className="text-blue-600" /> College Portal
                </Link>
                <Link
                  href="/dashboard/recruiter"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <Briefcase size={13} className="text-blue-600" /> Recruiter ATS
                </Link>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex gap-2">
              {currentUser ? (
                <>
                  <Link
                    href={getDashboardUrl(currentUser.role)}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-center text-xs"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await logoutAction();
                    }}
                    className="btn-outline text-xs"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline flex-1 text-center text-xs"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-center text-xs"
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
