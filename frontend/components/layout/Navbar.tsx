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
  Users,
  Search,
  Home,
  ArrowRight,
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

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim().length > 0) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "JS";
  };

  // Template nav items — strictly without AI Matcher as instructed
  const navItems = [
    { href: "/", label: "Home", isHome: true },
    { href: "/colleges", label: "Colleges", hasDropdown: true },
    { href: "/internships", label: "Internships", hasDropdown: true },
    { href: "/internships?type=job", label: "Jobs", hasDropdown: true },
    { href: "/mentorship", label: "Mentorship", hasDropdown: false },
    { href: "/compare", label: "Compare", hasDropdown: true },
  ];

  const displayName = currentUser?.name || currentUser?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Brand Logo with Cap and Subtitle */}
        <Link
          href={currentUser ? getDashboardUrl(currentUser.role) : "/"}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs group-hover:scale-105 transition">
            <GraduationCap size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-extrabold text-slate-900 leading-tight tracking-tight">
              JoinSchooling
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Learn • Upskill • Grow
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isHome = item.isHome;
            const isActive = isHome ? pathname === "/" : pathname.startsWith(item.href.split("?")[0]);

            if (isHome) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Home size={14} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown size={13} className="text-slate-400 mt-0.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Search Icon, Log In & Register Free Button */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Circular Search Button */}
          <Link
            href="/colleges"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition"
            title="Search Colleges & Internships"
          >
            <Search size={17} />
          </Link>

          {!currentUser ? (
            <>
              <Link
                href="/auth/login"
                className="text-xs font-semibold text-slate-800 hover:text-blue-600 px-3 py-2 rounded-full hover:bg-slate-50 transition"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4.5 rounded-full shadow-sm hover:shadow transition flex items-center gap-1.5"
              >
                Register Free <ArrowRight size={13} />
              </Link>
            </>
          ) : (
            /* Logged-In User Profile Dropdown */
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setUserDropdownOpen((v) => !v)}
                className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full border transition text-left cursor-pointer ${
                  userDropdownOpen
                    ? "bg-blue-50 border-blue-400 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
                aria-expanded={userDropdownOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
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

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href={getDashboardUrl(currentUser.role)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                    >
                      <GraduationCap size={15} className="text-blue-600" />
                      <span>My Workspace Desk</span>
                    </Link>

                    {currentUser.role === "student" && (
                      <>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        >
                          <User size={15} className="text-slate-400" />
                          <span>Student Profile & Skills</span>
                        </Link>
                        <Link
                          href="/applications"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        >
                          <FileText size={15} className="text-slate-400" />
                          <span>Application Pipeline</span>
                        </Link>
                        <Link
                          href="/colleges/saved"
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        >
                          <Bookmark size={15} className="text-slate-400" />
                          <span>Saved Bookmarks</span>
                        </Link>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition text-left cursor-pointer"
                      >
                        <LogOut size={15} />
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
              {navItems.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold flex items-center justify-between ${
                    pathname === n.href.split("?")[0] ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{n.label}</span>
                  {n.hasDropdown && <ChevronDown size={14} className="text-slate-400" />}
                </Link>
              ))}
            </div>

            {!currentUser ? (
              <div className="border-t border-slate-100 pt-3 flex gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline flex-1 text-center text-xs font-semibold py-2 rounded-full"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 text-center text-xs font-bold py-2 rounded-full shadow-sm"
                >
                  Register Free
                </Link>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-3 space-y-1">
                <Link
                  href={getDashboardUrl(currentUser.role)}
                  onClick={() => setMobileOpen(false)}
                  className="block text-xs font-bold text-slate-800 py-1.5"
                >
                  Open Dashboard ({displayName})
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full text-left text-xs text-rose-600 font-bold py-1.5 hover:bg-rose-50 rounded-lg"
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
