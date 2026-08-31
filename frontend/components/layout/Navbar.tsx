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
const more = [
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/career", label: "Career Hub" },
  { href: "/alumni", label: "Alumni Network" },
  { href: "/compare", label: "Compare Colleges" },
  { href: "/ai-finder", label: "AI College Finder" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/v1/me")
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

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
            <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-slate-100">
              {n.label}
            </Link>
          ))}
          <div className="relative" onMouseLeave={() => setMoreOpen(false)}>
            <button onMouseEnter={() => setMoreOpen(true)} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-slate-100">
              More <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="absolute left-0 top-full min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                {more.map((n) => (
                  <Link key={n.href} href={n.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-50">
                    {n.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="btn-ghost">Dashboard</Link>
              <button onClick={async () => await logoutAction()} className="btn-outline">Log out</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline">Log in</Link>
              <Link href="/auth/register" className="btn-primary">Get started</Link>
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
            {[...nav, ...more].map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100">
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="btn-ghost text-center">Dashboard</Link>
                  <button onClick={async () => await logoutAction()} className="btn-outline text-center">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn-outline text-center">Log in</Link>
                  <Link href="/auth/register" className="btn-primary text-center">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
