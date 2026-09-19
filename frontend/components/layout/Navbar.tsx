"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Trophy,
  Award,
  BookOpen,
  Users,
  Compass,
  Building2,
  LogOut,
  UserCheck,
  Search,
} from "lucide-react";
import { logoutAction, quickDemoLoginAction } from "@/lib/actions/auth";

const primaryNav = [
  { href: "/colleges", label: "Colleges", icon: GraduationCap },
  { href: "/internships", label: "Internships", icon: Briefcase },
  { href: "/ai-finder", label: "AI Finder", icon: Sparkles, highlight: true },
  { href: "/compare", label: "Compare", icon: Compass },
  { href: "/workshops", label: "Workshops", icon: BookOpen },
];

const secondaryNav = [
  { href: "/hackathons", label: "Hackathons", desc: "Compete & win cash prizes", icon: Trophy },
  { href: "/scholarships", label: "Scholarships", desc: "Discover ₹100Cr+ student aid", icon: Award },
  { href: "/roadmaps", label: "Career Roadmaps", desc: "Step-by-step tech roadmaps", icon: Compass },
  { href: "/alumni", label: "Alumni Mentors", desc: "Book 1-on-1 industry sessions", icon: Users },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string; name?: string } | null>(null);

  useEffect(() => {
    // Check client session cookie or fallback API
    fetch("/api/v1/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.id) {
          setCurrentUser(data);
        } else {
          // Check cookie directly from browser
          const cookies = document.cookie.split("; ");
          const roleCookie = cookies.find((c) => c.startsWith("ec_role="));
          const nameCookie = cookies.find((c) => c.startsWith("ec_name="));
          const emailCookie = cookies.find((c) => c.startsWith("ec_email="));
          if (roleCookie) {
            const role = roleCookie.split("=")[1];
            const name = nameCookie ? decodeURIComponent(nameCookie.split("=")[1]) : undefined;
            const email = emailCookie ? decodeURIComponent(emailCookie.split("=")[1]) : undefined;
            setCurrentUser({ id: "client-user", email: email || "student@educonnect.dev", role, name });
          } else {
            setCurrentUser(null);
          }
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

  const getRoleBadge = (role?: string) => {
    if (role === "college_rep") return { label: "College Portal", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    if (role === "recruiter") return { label: "Recruiter Portal", color: "bg-sky-100 text-sky-800 border-sky-300" };
    if (role === "admin") return { label: "Platform Admin", color: "bg-purple-100 text-purple-800 border-purple-300" };
    return { label: "Student Hub", color: "bg-brand-100 text-brand-800 border-brand-300" };
  };

  const currentBadge = getRoleBadge(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-600 to-accent-500 text-white shadow-md transition group-hover:scale-105 duration-200">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-extrabold tracking-tight text-ink-900 leading-none">
              Join<span className="gradient-text">Schooling</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              Colleges · Jobs · Admissions
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-700 shadow-xs"
                    : item.highlight
                    ? "text-brand-600 hover:bg-brand-50/60 font-bold"
                    : "text-ink-700 hover:bg-slate-100 hover:text-ink-900"
                }`}
              >
                {item.highlight && <Sparkles size={14} className="text-brand-600" />}
                {item.label}
                {item.highlight && (
                  <span className="ml-1 rounded-full bg-gradient-to-r from-brand-600 to-fuchsia-600 px-1.5 py-0.2 text-[9px] font-extrabold text-white">
                    AI
                  </span>
                )}
              </Link>
            );
          })}

          {/* More Menu Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setMoreDropdownOpen(true)}
            onMouseLeave={() => setMoreDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-semibold text-ink-700 hover:bg-slate-100 transition">
              Explore <ChevronDown size={15} className={`transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {moreDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-72 rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="grid gap-1">
                  {secondaryNav.map((n) => (
                    <Link
                      key={n.href}
                      href={n.href}
                      className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white transition">
                        <n.icon size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink-900">{n.label}</div>
                        <div className="text-xs text-slate-500 leading-tight">{n.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Quick Role Switcher / Demo Selector */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition shadow-xs hover:shadow-sm ${currentBadge.color}`}
            >
              <UserCheck size={13} />
              <span>{currentUser ? currentBadge.label : "Switch Role"}</span>
              <ChevronDown size={12} />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Switch Ecosystem View
                </div>
                <button
                  onClick={async () => {
                    setRoleDropdownOpen(false);
                    await quickDemoLoginAction("student");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-brand-50 hover:text-brand-700"
                >
                  <GraduationCap size={15} /> 👨‍🎓 Student Hub
                </button>
                <button
                  onClick={async () => {
                    setRoleDropdownOpen(false);
                    await quickDemoLoginAction("college_rep");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <Building2 size={15} /> 🏫 College Admissions
                </button>
                <button
                  onClick={async () => {
                    setRoleDropdownOpen(false);
                    await quickDemoLoginAction("recruiter");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-sky-50 hover:text-sky-700"
                >
                  <Briefcase size={15} /> 💼 Tech Recruiter ATS
                </button>
                <button
                  onClick={async () => {
                    setRoleDropdownOpen(false);
                    await quickDemoLoginAction("admin");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold hover:bg-purple-50 hover:text-purple-700"
                >
                  <Sparkles size={15} /> 🛡️ Platform Admin
                </button>
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardUrl(currentUser.role)}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={async () => await logoutAction()}
                title="Log out"
                className="btn-outline p-2 text-slate-500 hover:text-rose-600 rounded-xl"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="btn-outline text-xs py-2 px-3.5">
                Log in
              </Link>
              <Link href="/auth/register" className="btn-primary text-xs py-2 px-4 shadow-glow">
                Get started free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="rounded-xl p-2 text-ink-700 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/98 backdrop-blur-xl lg:hidden animate-in slide-in-from-top-2">
          <div className="container-page py-4 space-y-3">
            <div className="grid gap-1">
              {[...primaryNav, ...secondaryNav].map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    pathname === n.href ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-slate-50"
                  }`}
                >
                  <n.icon size={18} className="text-brand-600" />
                  {n.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
                Ecosystem Portals
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await quickDemoLoginAction("student");
                  }}
                  className="rounded-xl border border-brand-200 bg-brand-50/50 p-2 text-xs font-semibold text-brand-700 text-left"
                >
                  👨‍🎓 Student Hub
                </button>
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await quickDemoLoginAction("college_rep");
                  }}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2 text-xs font-semibold text-emerald-700 text-left"
                >
                  🏫 College Admissions
                </button>
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await quickDemoLoginAction("recruiter");
                  }}
                  className="rounded-xl border border-sky-200 bg-sky-50/50 p-2 text-xs font-semibold text-sky-700 text-left"
                >
                  💼 Tech Recruiter ATS
                </button>
                <button
                  onClick={async () => {
                    setMobileOpen(false);
                    await quickDemoLoginAction("admin");
                  }}
                  className="rounded-xl border border-purple-200 bg-purple-50/50 p-2 text-xs font-semibold text-purple-700 text-left"
                >
                  🛡️ Platform Admin
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex gap-2">
              {currentUser ? (
                <>
                  <Link
                    href={getDashboardUrl(currentUser.role)}
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-center text-sm"
                  >
                    Open Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await logoutAction();
                    }}
                    className="btn-outline text-sm"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-outline flex-1 text-center text-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary flex-1 text-center text-sm"
                  >
                    Get started
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
