import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { FileText, Bot, TrendingUp, GraduationCap, MessageSquare, Video } from "lucide-react";

const tools = [
  { icon: FileText, t: "Resume Builder", d: "ATS-friendly templates + AI review", tint: "from-brand-500 to-brand-700" },
  { icon: Bot, t: "Mock Interview AI", d: "Practice DSA + behavioral with feedback", tint: "from-fuchsia-500 to-pink-600" },
  { icon: TrendingUp, t: "Salary Insights", d: "See real offers from 40+ companies", tint: "from-emerald-500 to-teal-600" },
  { icon: GraduationCap, t: "Certifications", d: "Google, AWS, Meta partner tracks", tint: "from-sky-500 to-blue-700" },
  { icon: MessageSquare, t: "1:1 Mentorship", d: "Book calls with senior engineers", tint: "from-amber-500 to-orange-600" },
  { icon: Video, t: "Interview Recordings", d: "Learn from real interview replays", tint: "from-violet-500 to-indigo-600" },
];

const articles = [
  { t: "Cracking Amazon SDE-1: complete guide", d: "12 min read", cat: "Placement" },
  { t: "Top 10 DSA patterns for interviews", d: "8 min read", cat: "DSA" },
  { t: "System design for interns", d: "18 min read", cat: "System Design" },
  { t: "Behavioural rounds: STAR method", d: "6 min read", cat: "Interview" },
];

export default function CareerPage() {
  return (
    <>
      <PageHeader eyebrow="Grow faster" title="Career Hub" subtitle="Tools, mentorship, and content to accelerate your career from resume to offer." />
      <div className="container-page py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((c) => (
            <Link key={c.t} href="#" className="group card p-5 transition hover:shadow-glow">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.tint} text-white`}>
                <c.icon size={22} />
              </div>
              <div className="font-display text-lg font-bold group-hover:text-brand-700">{c.t}</div>
              <p className="mt-1 text-sm text-ink-500">{c.d}</p>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <Badge variant="brand">Reads</Badge>
              <h2 className="section-title mt-2">Learn from the best</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {articles.map((a) => (
              <div key={a.t} className="card p-5 transition hover:shadow-glow">
                <Badge variant="slate">{a.cat}</Badge>
                <div className="mt-2 font-display text-lg font-bold">{a.t}</div>
                <div className="mt-1 text-xs text-ink-500">{a.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
