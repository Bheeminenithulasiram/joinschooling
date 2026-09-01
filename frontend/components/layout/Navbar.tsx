"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

const nav = [
  { href: "/colleges", label: "Colleges" },
  { href: "/internships", label: "Internships" },
  { href: "/workshops", label: "Workshops" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/scholarships", label: "Scholarships" },
];

const baseMore = [
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/career", label: "Career Hub" },
  { href: "/alumni", label: "Alumni Network" },
  { href: "/compare", label: "Compare Colleges" },
  { href: "/ai-finder", label: "AI College Finder" },
];

function getDashboardUrl(role?: string | null): string {
  switch (role) {
    case "college_rep":
      return "/dashboard/college";
    case "recruiter":
      return "/dashboard/recruiter";
    case "admin":
      return "/admin";
    case "student":
    default:
      return "/dashboard";
  }
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data) => {
        if (data && data.id) {
          setCurrentUser(data);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const moreItems = [...baseMore];
  if (currentUser?.role === "admin") {
    moreItems.push({ href: "/admin", label: "Admin Panel" });
  }

  const dashboardUrl = getDashboardUrl(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
            <Sparkles size={18} />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Edu<span className="gradient-text">Connect</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-slate-100 transition">
              {n.label}
            </Link>
          ))}
          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button onMouseEnter={() => setMoreOpen(true)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-slate-100 transition">
              More <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {moreItems.map((n) => (
                  <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50 transition">
                    {n.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <Link href={dashboardUrl} className="btn-ghost text-sm font-semibold text-brand-700 hover:text-brand-800">
                Dashboard
              </Link>
              <button onClick={async () => await logoutAction()} className="btn-outline text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline text-sm">Log in</Link>
              <Link href="/auth/register" className="btn-primary text-sm">Get started</Link>
            </>
          )}
        </div>

        <button className="ml-auto rounded-lg p-2 hover:bg-slate-100 md:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page grid gap-1 py-3">
            {[...nav, ...moreItems].map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 transition">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {currentUser ? (
                <>
                  <Link href={dashboardUrl} className="btn-ghost text-center text-sm font-semibold text-brand-700">
                    Dashboard
                  </Link>
                  <button onClick={async () => await logoutAction()} className="btn-outline text-center text-sm">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-outline text-center text-sm">Log in</Link>
                  <Link href="/auth/register" className="btn-primary text-center text-sm">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
