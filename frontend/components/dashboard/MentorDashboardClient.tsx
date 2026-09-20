"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  Star,
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
  Building2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Plus,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { logoutAction } from "@/lib/actions/auth";

interface MentorDashboardClientProps {
  data: any;
}

export function MentorDashboardClient({ data }: MentorDashboardClientProps) {
  const { addToast } = useToast();
  const mentor = data?.mentor || {
    name: "Arjun Sundaram",
    designation: "Staff Software Engineer & Alumni Mentor",
    company_or_institution: "Google India",
    domain_expertise: "Software Engineering & Distributed Systems",
    is_verified: true,
  };

  const [requests, setRequests] = useState(
    data?.upcoming_requests || [
      {
        id: "req-1",
        student_name: "Rahul Verma",
        topic: "SDE Resume Review & Mock Coding Interview",
        scheduled_slot: "Tomorrow at 6:00 PM IST",
        status: "confirmed",
        target_company: "Google",
      },
      {
        id: "req-2",
        student_name: "Ananya Sharma",
        topic: "IIT Bombay B.Tech CSE Counseling & Branch Guidance",
        scheduled_slot: "Sunday at 4:30 PM IST",
        status: "pending_approval",
        target_company: "IIT Bombay",
      },
      {
        id: "req-3",
        student_name: "Vikram Patel",
        topic: "System Design & Distributed Systems Career Roadmap",
        scheduled_slot: "Tuesday at 7:00 PM IST",
        status: "confirmed",
        target_company: "Amazon",
      },
    ]
  );

  const [activeTab, setActiveTab] = useState<"sessions" | "mentees" | "availability">("sessions");

  const handleApprove = (id: string) => {
    setRequests((prev: any[]) =>
      prev.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r))
    );
    addToast("Mentorship session confirmed and calendar invitation sent to mentee!", "success");
  };

  const handleComplete = (id: string) => {
    setRequests((prev: any[]) =>
      prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r))
    );
    addToast("Session marked as completed! Feedback form shared with student.", "success");
  };

  return (
    <div className="container-page py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Users size={14} className="text-blue-300" /> Alumni Mentorship & Career Guidance Hub
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {mentor.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {mentor.designation} · <span className="text-blue-400 font-semibold">{mentor.company_or_institution}</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck size={14} /> Verified Industry Mentor ({mentor.domain_expertise})
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/mentorship"
              className="btn bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Users size={14} /> Browse Public Directory
            </Link>
            <form action={logoutAction}>
              <button className="btn bg-white/10 hover:bg-white/20 text-white text-xs py-2.5 px-4 rounded-xl transition font-semibold">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Mentees", value: data?.stats?.active_mentees ?? 18, icon: Users, tint: "from-blue-600 to-indigo-800" },
          { label: "Completed Sessions", value: data?.stats?.completed_sessions ?? 42, icon: CheckCircle2, tint: "from-emerald-600 to-teal-800" },
          { label: "Upcoming 1:1s", value: data?.stats?.upcoming_sessions ?? 3, icon: Calendar, tint: "from-amber-600 to-orange-800" },
          { label: "Mentor Rating", value: `${data?.stats?.rating ?? 4.95} ★`, icon: Star, tint: "from-purple-600 to-indigo-900" },
        ].map((s) => (
          <div key={s.label} className="card p-5 space-y-2 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{s.label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
                <s.icon size={18} />
              </div>
            </div>
            <div className="font-display text-3xl font-extrabold text-slate-900">{s.value}</div>
            <div className="text-[11px] text-slate-400 font-medium">Verified platform impact</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            {[
              { id: "sessions", label: "Scheduled 1:1 Sessions", icon: Calendar },
              { id: "mentees", label: "Assigned Students", icon: Users },
              { id: "availability", label: "Weekly Availability", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sessions List */}
          {activeTab === "sessions" && (
            <div className="card p-6 sm:p-7 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-display text-base font-bold text-slate-900">Student Mentorship Inquiries</h2>
                  <p className="text-xs text-slate-500">Review student booking requests and manage active calendar slots.</p>
                </div>
              </div>

              <div className="space-y-3">
                {requests.map((r: any) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 hover:bg-white transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{r.student_name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            r.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : r.status === "completed"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium">{r.topic}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <Clock size={12} className="text-blue-600" /> {r.scheduled_slot} · Target: {r.target_company}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {r.status === "pending_approval" && (
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="btn-primary text-xs py-1.5 px-3 font-bold"
                        >
                          Confirm Session
                        </button>
                      )}
                      {r.status === "confirmed" && (
                        <button
                          onClick={() => handleComplete(r.id)}
                          className="btn-outline text-xs py-1.5 px-3 font-bold text-emerald-700 hover:bg-emerald-50"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "mentees" && (
            <div className="card p-6 sm:p-7 space-y-4 border border-slate-200 shadow-sm">
              <h2 className="font-display text-base font-bold text-slate-900">Active Student Mentees (2026 Batch)</h2>
              <div className="space-y-3">
                {[
                  { name: "Rahul Verma", college: "IIT Delhi", major: "B.Tech CSE", target: "Google SWE Intern", cgpa: "9.3" },
                  { name: "Ananya Sharma", college: "VNR VJIET", major: "B.Tech IT", target: "IIT Bombay M.Tech", cgpa: "9.1" },
                  { name: "Vikram Patel", college: "BITS Pilani", major: "B.E. CS", target: "Amazon SDE", cgpa: "8.9" },
                ].map((m) => (
                  <div key={m.name} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.college} · {m.major} · CGPA {m.cgpa}</div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700">
                      {m.target}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "availability" && (
            <div className="card p-6 sm:p-7 space-y-4 border border-slate-200 shadow-sm">
              <h2 className="font-display text-base font-bold text-slate-900">Weekly Mentorship Availability</h2>
              <div className="space-y-2 text-xs">
                {["Tuesday & Thursday: 6:00 PM – 8:00 PM IST", "Saturday: 4:00 PM – 7:00 PM IST", "Sunday: 10:00 AM – 1:00 PM IST"].map((slot) => (
                  <div key={slot} className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-700 flex items-center justify-between">
                    <span>{slot}</span>
                    <span className="text-emerald-700 font-bold">Open for Bookings</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="card p-6 space-y-3 border border-slate-200 shadow-sm">
            <h3 className="font-display text-sm font-bold text-slate-900">Mentorship Guidelines</h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Conduct 45-minute 1:1 video sessions focusing on resume critique & DSA coding.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                <span>Provide actionable referral recommendations for qualified top tier candidates.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
