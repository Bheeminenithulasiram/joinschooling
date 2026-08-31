import Link from "next/link";
import { Sparkles } from "lucide-react";

const cols = [
  { title: "Explore", links: [
    { href: "/colleges", label: "Colleges" },
    { href: "/internships", label: "Internships" },
    { href: "/workshops", label: "Workshops" },
    { href: "/hackathons", label: "Hackathons" },
    { href: "/scholarships", label: "Scholarships" },
  ]},
  { title: "Growth", links: [
    { href: "/roadmaps", label: "Roadmaps" },
    { href: "/career", label: "Career Hub" },
    { href: "/alumni", label: "Alumni Network" },
    { href: "/ai-finder", label: "AI College Finder" },
    { href: "/compare", label: "Compare Colleges" },
  ]},
  { title: "Company", links: [
    { href: "#", label: "About" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Press" },
    { href: "#", label: "Contact" },
    { href: "#", label: "Privacy" },
  ]},
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white">
              <Sparkles size={18} />
            </div>
            <span className="font-display text-lg font-extrabold">EduConnect</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-500">
            The unified marketplace for students — colleges, internships, workshops, and career growth.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-500">{c.title}</div>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-700 hover:text-brand-600">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 sm:flex-row">
          <p className="text-xs text-ink-500">© 2026 EduConnect. Built for learners.</p>
          <p className="text-xs text-ink-500">Made with care in India.</p>
        </div>
      </div>
    </footer>
  );
}
