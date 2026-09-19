import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { FileText, TrendingUp, GraduationCap, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import { SalaryExplorerClient } from "@/components/career/SalaryExplorerClient";

const tools = [
  { icon: TrendingUp, t: "Salary Benchmarks", d: "Explore real placement compensation across 40+ top tech firms", href: "/career" },
  { icon: MessageSquare, t: "1:1 Mentorship", d: "Book calls with FAANG & industry alumni engineers", href: "/alumni" },
  { icon: BookOpen, t: "Career Roadmaps", d: "Step-by-step guides for Fullstack, DevOps, and Data Science", href: "/roadmaps" },
  { icon: GraduationCap, t: "Industry Certifications", d: "Google Cloud, AWS, and Meta certified training tracks", href: "/workshops" },
];

const articles = [
  { t: "Cracking Campus Software Engineering Drives: Complete Guide", d: "12 min read", cat: "Placements" },
  { t: "Top 15 Blind-75 LeetCode Coding Patterns with Visual Explanations", d: "8 min read", cat: "DSA" },
  { t: "System Design for Interns: Caching, Sharding & Rate Limiting", d: "18 min read", cat: "Architecture" },
  { t: "Behavioral Rounds: Cracking Leadership Principles with the STAR Method", d: "6 min read", cat: "Interviews" },
];

export default function CareerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Placement & Career Guidance"
        title="Career & Salary Hub"
        subtitle="Real-world compensation benchmarks, technical interview roadmaps, and 1-on-1 mentorship to guide your journey from campus to offer letter."
      />
      <div className="container-page py-10 space-y-10">
        {/* Quick Resource Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((c) => (
            <Link
              key={c.t}
              href={c.href}
              className="card p-5 group hover:border-blue-400 transition duration-150"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold">
                <c.icon size={20} />
              </div>
              <div className="font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                {c.t}
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">{c.d}</p>
            </Link>
          ))}
        </div>

        {/* Salary Benchmarks Component */}
        <SalaryExplorerClient />

        {/* Placement Preparation Guides */}
        <div className="space-y-4">
          <div>
            <Badge variant="brand">Placement Guides</Badge>
            <h2 className="section-title mt-1.5">Interview Preparation Guides</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <div
                key={a.t}
                className="card p-5 border border-slate-200 hover:border-blue-400 transition"
              >
                <Badge variant="slate">{a.cat}</Badge>
                <div className="mt-2 font-display text-sm font-bold text-slate-900">
                  {a.t}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span>{a.d}</span>
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
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
