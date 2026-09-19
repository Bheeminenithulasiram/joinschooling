import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { FileText, Bot, TrendingUp, GraduationCap, MessageSquare, Video, ArrowRight } from "lucide-react";
import { SalaryExplorerClient } from "@/components/career/SalaryExplorerClient";

const tools = [
  { icon: FileText, t: "Resume Builder", d: "ATS-friendly templates + AI keyword scanner", tint: "from-brand-500 to-brand-700", href: "/career" },
  { icon: Bot, t: "AI Mock Interview", d: "Practice DSA & behavioral with instant scoring", tint: "from-fuchsia-500 to-pink-600", href: "/career" },
  { icon: TrendingUp, t: "Salary Benchmarks", d: "Explore real offers across 40+ top tech firms", tint: "from-emerald-500 to-teal-600", href: "/career" },
  { icon: GraduationCap, t: "Industry Certifications", d: "Google Cloud, AWS, Meta partner tracks", tint: "from-sky-500 to-blue-700", href: "/workshops" },
  { icon: MessageSquare, t: "1:1 Mentorship", d: "Book calls with FAANG & startup engineers", tint: "from-amber-500 to-orange-600", href: "/alumni" },
  { icon: Video, t: "Placement Replays", d: "Learn from real candidate interview recordings", tint: "from-violet-500 to-indigo-600", href: "/roadmaps" },
];

const articles = [
  { t: "Cracking Amazon SDE-1: The Complete 2026 Guide", d: "12 min read", cat: "Placements" },
  { t: "Top 15 Blind-75 LeetCode Patterns with Visual Diagrams", d: "8 min read", cat: "DSA Mastery" },
  { t: "System Design for Interns: Caching, Sharding & Rate Limiting", d: "18 min read", cat: "System Design" },
  { t: "Behavioral Rounds: Cracking Leadership Principles with STAR", d: "6 min read", cat: "Interview" },
];

export default function CareerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Accelerate Your Tech Career"
        title="Career & Salary Hub"
        subtitle="Real-world compensation insights, AI resume scoring, DSA interview guides, and 1-on-1 mentorship to take you from college to offer letter."
      />
      <div className="container-page py-10 space-y-12">
        {/* Quick Tools Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="glass-card p-5 group hover:border-brand-300 transition duration-200"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${c.tint} text-white shadow-md`}
              >
                <c.icon size={22} />
              </div>
              <div className="font-display text-base font-bold text-slate-900 group-hover:text-brand-600 transition">
                {c.t}
              </div>
              <p className="mt-1 text-xs text-slate-500">{c.d}</p>
            </Link>
          ))}
        </div>

        {/* Salary Insights & AI ATS Checker */}
        <SalaryExplorerClient />

        {/* Articles & Interview Guides */}
        <div>
          <div className="mb-6">
            <Badge variant="brand">Placement Guides</Badge>
            <h2 className="section-title mt-2">Learn from Engineers at Top Tech Firms</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <div
                key={a.t}
                className="card p-5 border border-slate-200 hover:border-brand-300 transition hover:shadow-glow cursor-pointer"
              >
                <Badge variant="slate">{a.cat}</Badge>
                <div className="mt-2 font-display text-base font-bold text-slate-900 hover:text-brand-600 transition">
                  {a.t}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{a.d}</span>
                  <span className="font-semibold text-brand-600 flex items-center gap-1">
                    Read Guide <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
