"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  Award,
  TrendingUp,
  Layers,
  Sparkles,
  BookOpen,
  Compass,
  User,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const moreRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    role: string;
    name?: string;
  } | null>(null);

  // Fetch logged in user
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

  // Handle scroll and dynamic contrast detection across dark and light sections
  const [isDarkUnderNav, setIsDarkUnderNav] = useState(true);

  useEffect(() => {
    let rafId: number | null = null;

    const checkContrast = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 8);

      if (isHome && scrollY < 80) {
        setIsDarkUnderNav(true);
        return;
      }

      // Check what is directly beneath the navbar (sample points across width)
      const samplePoints = [
        Math.min(100, window.innerWidth * 0.1),
        window.innerWidth * 0.5,
        Math.max(window.innerWidth - 100, window.innerWidth * 0.9),
      ];

      let darkCount = 0;
      for (const x of samplePoints) {
        if (typeof document.elementsFromPoint !== "function") break;
        const elements = document.elementsFromPoint(x, 32);
        // Find first element not inside the sticky header
        const targetEl = elements.find((e) => !e.closest("header"));
        if (targetEl) {
          if (
            targetEl.closest(
              '[data-theme="dark"], .bg-\\[\\#0A0F1D\\], .bg-\\[\\#0B132B\\], .bg-slate-950, .bg-slate-900, .bg-blue-950, footer'
            )
          ) {
            darkCount++;
          }
        }
      }

      setIsDarkUnderNav(darkCount > 0);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        checkContrast();
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    checkContrast();
    const t = setTimeout(checkContrast, 120);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(t);
    };
  }, [isHome, pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setMoreDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // "More" Dropdown Handlers with Smooth Hover Debounce
  const handleMoreEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setMoreDropdownOpen(true);
  };

  const handleMoreLeave = () => {
    moreTimeoutRef.current = setTimeout(() => {
      setMoreDropdownOpen(false);
    }, 150);
  };

  // User Profile Dropdown Handlers
  const handleUserEnter = () => {
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    setUserDropdownOpen(true);
  };

  const handleUserLeave = () => {
    userTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 150);
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

  // Remaining content grouped inside the "More" dropdown — Clean names only
  const moreItems = [
    { href: "/colleges?exam=all", label: "Cutoffs", icon: Award },
    { href: "/career", label: "Placements", icon: TrendingUp },
    { href: "/compare", label: "Compare Colleges", icon: Layers },
    { href: "/scholarships", label: "Scholarships", icon: Sparkles },
    { href: "/workshops", label: "Masterclasses", icon: BookOpen },
    { href: "/ai-finder", label: "College Finder", icon: Compass },
  ];

  const displayName = currentUser?.name || currentUser?.email?.split("@")[0] || "User";
  // Dynamically determine if the area currently behind the navbar is dark or light
  const isDark = !scrolled ? (isHome ? true : isDarkUnderNav) : isDarkUnderNav;
  const isTransparentTop = isDark;

  // Check active states
  const isCollegesActive = pathname.startsWith("/colleges");
  const isInternshipsActive = pathname.startsWith("/internships");
  const isMoreActive =
    pathname.startsWith("/career") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/scholarships") ||
    pathname.startsWith("/workshops") ||
    pathname.startsWith("/ai-finder");

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          !scrolled && isHome
            ? "bg-transparent backdrop-blur-xs border-b border-transparent"
            : isDark
            ? "bg-slate-950/20 backdrop-blur-md border-b border-white/10 shadow-xs"
            : "bg-slate-950/15 backdrop-blur-md border-b border-slate-900/10 shadow-xs"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo */}
          <div className="flex items-center flex-1">
            <Link
              href="/"
              prefetch={true}
              className="flex items-center gap-2.5 group transition-all duration-200"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-xs group-hover:scale-105 transition-all duration-200 ${
                  isTransparentTop ? "bg-blue-600 group-hover:bg-blue-500" : "bg-[#0B132B] group-hover:bg-slate-800"
                }`}
              >
                <GraduationCap size={18} />
              </div>
              <span
                className={`font-display text-base sm:text-lg font-extrabold tracking-tight transition-colors duration-200 ${
                  isTransparentTop ? "text-white" : "text-slate-900"
                }`}
              >
                JoinSchooling
              </span>
            </Link>
          </div>

          {/* Center: Main Nav Items (Dead Center) */}
          <nav className="hidden md:flex items-center justify-center gap-1 sm:gap-2 shrink-0">
            {/* 1. Colleges — NO dropdown */}
            <Link
              href="/colleges"
              prefetch={true}
              className={`relative px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isTransparentTop
                  ? isCollegesActive
                    ? "text-white font-bold bg-white/15 shadow-2xs"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                  : isCollegesActive
                  ? "text-slate-950 font-bold bg-slate-900/10 shadow-2xs"
                  : "text-slate-800 font-bold hover:text-blue-600 hover:bg-slate-900/5"
              }`}
            >
              Colleges
            </Link>

            {/* 2. Internships & Jobs (Single unified item) — NO dropdown */}
            <Link
              href="/internships"
              prefetch={true}
              className={`relative px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isTransparentTop
                  ? isInternshipsActive
                    ? "text-white font-bold bg-white/15 shadow-2xs"
                    : "text-slate-200 hover:text-white hover:bg-white/10"
                  : isInternshipsActive
                  ? "text-slate-950 font-bold bg-slate-900/10 shadow-2xs"
                  : "text-slate-800 font-bold hover:text-blue-600 hover:bg-slate-900/5"
              }`}
            >
              Internships &amp; Jobs
            </Link>

            {/* 3. More ⌵ — Animated Dropdown with just names like nav items */}
            <div
              ref={moreRef}
              className="relative"
              onMouseEnter={handleMoreEnter}
              onMouseLeave={handleMoreLeave}
            >
              <button
                type="button"
                onClick={() => setMoreDropdownOpen((v) => !v)}
                className={`relative px-3.5 py-1.5 rounded-xl text-sm font-semibold inline-flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                  isTransparentTop
                    ? moreDropdownOpen || isMoreActive
                      ? "text-white bg-white/15 font-bold"
                      : "text-slate-200 hover:text-white hover:bg-white/10"
                    : moreDropdownOpen || isMoreActive
                    ? "text-slate-950 bg-slate-900/10 font-bold"
                    : "text-slate-800 font-bold hover:text-blue-600 hover:bg-slate-900/5"
                }`}
                aria-expanded={moreDropdownOpen}
              >
                <span>More</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    moreDropdownOpen
                      ? isTransparentTop
                        ? "rotate-180 text-white"
                        : "rotate-180 text-slate-900"
                      : isTransparentTop
                      ? "text-slate-300"
                      : "text-slate-600"
                  }`}
                />
              </button>

              {/* Clean Glass Dropdown Menu — Just names like nav items */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-2 w-52 rounded-2xl p-1.5 shadow-2xl origin-top transition-all duration-200 ease-out z-50 ${
                  isTransparentTop
                    ? "bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-white"
                    : "bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl text-slate-800"
                } ${
                  moreDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
                }`}
              >
                <div className="space-y-0.5">
                  {moreItems.map((item) => {
                    const Icon = item.icon;
                    const isItemActive = pathname === item.href.split("?")[0];
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        prefetch={true}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
                          isTransparentTop
                            ? isItemActive
                              ? "bg-blue-600/30 text-white font-bold"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                            : isItemActive
                            ? "bg-slate-100 text-slate-900 font-bold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <Icon
                          size={15}
                          className={`shrink-0 ${
                            isTransparentTop ? "text-slate-400" : "text-slate-500"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Right: Auth Buttons & User Menu */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            {!currentUser ? (
              <>
                <Link
                  href="/auth/login"
                  prefetch={true}
                  className={`text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                    isTransparentTop
                      ? "text-slate-200 hover:text-white hover:bg-white/10"
                      : "text-slate-800 font-bold hover:text-blue-600 hover:bg-slate-900/5"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  prefetch={true}
                  className={`font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-xs hover:scale-[1.02] active:scale-95 shrink-0 ${
                    isTransparentTop
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                      : "bg-[#0B132B] hover:bg-slate-800 text-white shadow-xs"
                  }`}
                >
                  Register Free
                </Link>
              </>
            ) : (
              <div
                ref={userRef}
                className="relative"
                onMouseEnter={handleUserEnter}
                onMouseLeave={handleUserLeave}
              >
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer border ${
                    isTransparentTop
                      ? "border-slate-800 hover:bg-slate-800/80"
                      : "border-slate-200 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
                    {getInitials(currentUser.name, currentUser.email)}
                  </div>
                  <span
                    className={`text-xs font-bold hidden sm:inline max-w-[100px] truncate ${
                      isTransparentTop ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {displayName}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      userDropdownOpen ? "rotate-180" : ""
                    } ${isTransparentTop ? "text-slate-400" : "text-slate-500"}`}
                  />
                </button>

                {/* User Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl z-50 origin-top-right transition-all duration-150 ease-out ${
                    isTransparentTop
                      ? "bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-white"
                      : "bg-white/98 backdrop-blur-xl border border-slate-200 shadow-xl text-slate-800"
                  } ${
                    userDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto visible"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none invisible"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl mb-1 text-xs border ${
                      isTransparentTop
                        ? "border-slate-800 bg-slate-800/40"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`font-bold truncate ${
                        isTransparentTop ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {displayName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <Link
                      href={getDashboardUrl(currentUser.role)}
                      className={`flex items-center gap-2 px-3 py-2 font-semibold rounded-lg transition ${
                        isTransparentTop
                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <GraduationCap size={14} className="text-blue-500" />
                      <span>Workspace Desk</span>
                    </Link>
                    <Link
                      href="/profile"
                      className={`flex items-center gap-2 px-3 py-2 font-semibold rounded-lg transition ${
                        isTransparentTop
                          ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <User size={14} className="text-slate-400" />
                      <span>Profile &amp; Skills</span>
                    </Link>
                  </div>
                  <div
                    className={`border-t mt-1 pt-1 ${
                      isTransparentTop ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50/60 rounded-lg transition text-left cursor-pointer"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`p-1.5 rounded-xl md:hidden ml-1 transition-colors ${
                isTransparentTop
                  ? "text-slate-300 hover:text-white hover:bg-white/10"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            className={`border-t p-4 md:hidden animate-in fade-in slide-in-from-top-2 duration-150 shadow-2xl ${
              isTransparentTop
                ? "border-slate-800/90 bg-slate-950/95 backdrop-blur-xl text-white"
                : "border-slate-200 bg-white/95 backdrop-blur-xl text-slate-900"
            }`}
          >
            <div className="space-y-1.5 text-xs">
              <Link
                href="/colleges"
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-xl font-semibold transition ${
                  isCollegesActive
                    ? isTransparentTop
                      ? "bg-slate-800 text-white font-bold"
                      : "bg-slate-100 text-slate-900 font-bold"
                    : isTransparentTop
                    ? "text-slate-300 hover:bg-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Colleges
              </Link>

              <Link
                href="/internships"
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-xl font-semibold transition ${
                  isInternshipsActive
                    ? isTransparentTop
                      ? "bg-slate-800 text-white font-bold"
                      : "bg-slate-100 text-slate-900 font-bold"
                    : isTransparentTop
                    ? "text-slate-300 hover:bg-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Internships &amp; Jobs
              </Link>

              {/* Mobile "More" Services Section — Clean Names */}
              <div
                className={`pt-2 border-t space-y-1 ${
                  isTransparentTop ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  More Services
                </span>
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isItemActive = pathname === item.href.split("?")[0];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isItemActive
                          ? isTransparentTop
                            ? "bg-slate-800 text-white font-bold"
                            : "bg-slate-100 text-slate-900 font-bold"
                          : isTransparentTop
                          ? "text-slate-300 hover:bg-slate-900"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={14} className="text-slate-400 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {!currentUser ? (
              <div
                className={`border-t mt-4 pt-3 flex gap-2 ${
                  isTransparentTop ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <Link
                  href="/auth/login"
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center text-xs font-bold py-2 rounded-xl border ${
                    isTransparentTop
                      ? "border-slate-700 bg-slate-900 text-slate-200"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className={`flex-1 text-center text-xs font-bold py-2 rounded-xl text-white shadow-xs ${
                    isTransparentTop ? "bg-blue-600" : "bg-[#0B132B]"
                  }`}
                >
                  Register Free
                </Link>
              </div>
            ) : (
              <div
                className={`border-t mt-4 pt-2 text-xs ${
                  isTransparentTop ? "border-slate-800" : "border-slate-100"
                }`}
              >
                <Link
                  href={getDashboardUrl(currentUser.role)}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1.5 font-bold text-blue-500"
                >
                  Open Workspace ({displayName})
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Spacer for non-home pages so fixed navbar doesn't cover top page content */}
      {!isHome && <div className="h-16 w-full shrink-0" aria-hidden="true" />}
    </>
  );
}
