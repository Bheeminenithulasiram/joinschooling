"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Eye,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Award,
  Phone,
  Mail,
  Filter,
  Plus,
  Edit,
  Download,
  Clock,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { mockCollegeInquiries } from "@/lib/mock";
import { logoutAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";

export function CollegeDashboardClient({ data }: { data: any }) {
  const { success, info } = useToast();
  const [inquiries, setInquiries] = useState(mockCollegeInquiries);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"inquiries" | "cutoffs" | "analytics">("inquiries");

  const representative = data?.representative || {
    name: "Dr. K. Srinivas Rao",
    designation: "Dean of Admissions",
    college_name: "VNR VJIET",
  };

  const handleStatusChange = (id: string, newStatus: any) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    success(`Lead status updated to "${newStatus.replace("_", " ")}"`);
  };

  const filteredInquiries = statusFilter === "all"
    ? inquiries
    : inquiries.filter((inq) => inq.status === statusFilter);

  return (
    <div className="container-page py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" /> College Admissions & Representative Portal
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome, {representative.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              {representative.designation} • <span className="font-bold text-white">{representative.college_name}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/colleges"
              className="btn bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition"
            >
              Public Directory <ArrowRight size={14} />
            </Link>
            <form action={logoutAction}>
              <button className="btn bg-white/10 hover:bg-white/20 text-white text-xs py-2.5 px-4 rounded-xl transition font-semibold">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Student Inquiries</span>
            <Users size={18} className="text-emerald-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900">{inquiries.length + 139}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+18 new leads this week</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Profile Impressions</span>
            <Eye size={18} className="text-sky-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900">18,450</div>
          <p className="text-[11px] text-slate-400">Search & directory views</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Applications Started</span>
            <BookOpen size={18} className="text-brand-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-brand-700">58</div>
          <p className="text-[11px] text-brand-600 font-semibold">Undergrad counseling batch</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Verification Status</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div className="font-display text-3xl font-extrabold text-emerald-600">Active</div>
          <p className="text-[11px] text-slate-400">NIRF & AICTE Verified</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-3 px-2 transition border-b-2 ${
            activeTab === "inquiries" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500"
          }`}
        >
          Prospective Student Leads ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("cutoffs")}
          className={`pb-3 px-2 transition border-b-2 ${
            activeTab === "cutoffs" ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-500"
          }`}
        >
          Courses, Cutoffs & Fee Management
        </button>
      </div>

      {/* Inquiries Leads Table */}
      {activeTab === "inquiries" && (
        <div className="card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Admissions Inquiry Pipeline</h2>
              <p className="text-xs text-slate-500">Real-time student submissions requesting counseling and seat reservations.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input text-xs w-44 py-1.5"
              >
                <option value="all">All Statuses</option>
                <option value="new">New Inquiries</option>
                <option value="contacted">Contacted</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="admitted">Admitted</option>
              </select>
              <button
                onClick={() => success("Exported 142 student inquiry contacts to CSV!")}
                className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Academic Scores</th>
                  <th className="p-3">Interested Course</th>
                  <th className="p-3">Inquiry Details</th>
                  <th className="p-3">Lead Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{inq.student_name}</td>
                    <td className="p-3 space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-600"><Mail size={11} /> {inq.email}</div>
                      <div className="flex items-center gap-1 text-slate-600"><Phone size={11} /> {inq.phone}</div>
                    </td>
                    <td className="p-3 font-semibold text-brand-700">
                      10th: {inq.tenth_percentage}%<br />
                      12th: {inq.twelfth_percentage}%
                    </td>
                    <td className="p-3 font-medium text-slate-800">{inq.preferred_course}</td>
                    <td className="p-3 max-w-xs text-slate-500 truncate" title={inq.message}>
                      {inq.message || "Standard admission counseling request"}
                    </td>
                    <td className="p-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                          inq.status === "new"
                            ? "bg-amber-50 text-amber-800 border-amber-300"
                            : inq.status === "contacted"
                            ? "bg-sky-50 text-sky-800 border-sky-300"
                            : inq.status === "interview_scheduled"
                            ? "bg-purple-50 text-purple-800 border-purple-300"
                            : "bg-emerald-50 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="admitted">Admitted / Enrolled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Course Cutoff Manager */}
      {activeTab === "cutoffs" && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Seat Capacity & Entrance Cutoffs</h2>
              <p className="text-xs text-slate-500">Configure annual fees and cutoffs displayed to students in the AI Finder.</p>
            </div>
            <button
              onClick={() => success("New branch program saved!")}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Plus size={14} /> Add New Specialization
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "Computer Science and Engineering", seats: 240, fee: 1.35, cutoff: "TG EAPCET < 2500" },
              { name: "AI & Machine Learning", seats: 180, fee: 1.35, cutoff: "TG EAPCET < 3800" },
              { name: "Information Technology", seats: 180, fee: 1.35, cutoff: "TG EAPCET < 4500" },
              { name: "Electronics & Communication", seats: 240, fee: 1.35, cutoff: "TG EAPCET < 7000" },
            ].map((c) => (
              <div key={c.name} className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.seats} Total Seats Available</p>
                  </div>
                  <button onClick={() => info("Editing cutoff modal opened")} className="p-1 text-slate-400 hover:text-brand-600">
                    <Edit size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200/80 pt-2.5">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Annual Fee</span>
                    <div className="font-bold text-brand-700">₹{c.fee} Lakhs / yr</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Closing Cutoff</span>
                    <div className="font-bold text-emerald-700">{c.cutoff}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
