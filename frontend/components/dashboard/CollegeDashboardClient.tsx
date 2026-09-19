"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Filter,
  Plus,
  Edit,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { mockCollegeInquiries } from "@/lib/mock";
import { logoutAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";

export function CollegeDashboardClient({ data }: { data: any }) {
  const { success } = useToast();
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
    <div className="container-page py-8 space-y-6">
      {/* Classic Dark Navy Institutional Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <ShieldCheck size={13} /> College Admissions Desk
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {representative.college_name} Admissions Desk
            </h1>
            <p className="text-xs text-slate-400">
              Welcome, {representative.name} ({representative.designation}). Manage student counseling queries and cutoff benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/colleges/vnr-vjiet`}
              className="btn bg-slate-800 hover:bg-slate-700 text-white text-xs px-3.5 py-2 rounded-lg"
            >
              View Public College Page
            </Link>
            <form action={logoutAction}>
              <button className="btn bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3.5 py-2 rounded-lg">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Admissions Leads", val: "148 Queries", sub: "2026 Batch", color: "text-blue-700" },
          { label: "Pending Screening", val: `${inquiries.filter((i) => i.status === "new").length} New Leads`, sub: "Require follow-up", color: "text-amber-700" },
          { label: "Interviews Scheduled", val: "24 Candidates", sub: "Campus Counseling", color: "text-emerald-700" },
          { label: "Confirmed Admissions", val: "86 Enrolled", sub: "Seat tokens received", color: "text-slate-900" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{s.label}</span>
            <div className={`mt-1 font-display text-xl font-bold ${s.color}`}>{s.val}</div>
            <span className="text-[11px] text-slate-500">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-xs font-bold">
        {[
          { key: "inquiries", label: `Admissions Inquiries (${filteredInquiries.length})` },
          { key: "cutoffs", label: "Programs & Seat Management" },
          { key: "analytics", label: "Admissions Analytics" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-2.5 px-1.5 transition border-b-2 ${
              activeTab === t.key
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Inquiries Table */}
      {activeTab === "inquiries" && (
        <div className="card border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-slate-600">Filter Status:</span>
              {["all", "new", "contacted", "interview_scheduled"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                    statusFilter === st
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              Showing {filteredInquiries.length} inquiries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3 text-left font-bold">Student Name</th>
                  <th className="p-3 text-left font-bold">Contact Info</th>
                  <th className="p-3 text-left font-bold">Academic Marks</th>
                  <th className="p-3 text-left font-bold">Preferred Course</th>
                  <th className="p-3 text-left font-bold">Lead Status</th>
                  <th className="p-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 font-bold text-slate-900">{inq.student_name}</td>
                    <td className="p-3 text-slate-600">
                      <div>{inq.email}</div>
                      <div className="text-[10px] text-slate-400">{inq.phone}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-800">12th: {inq.twelfth_percentage}%</span>
                      <div className="text-[10px] text-slate-400">10th: {inq.tenth_percentage}%</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{inq.preferred_course}</td>
                    <td className="p-3">
                      <Badge variant={inq.status === "new" ? "amber" : inq.status === "contacted" ? "blue" : "green"}>
                        {inq.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="admitted">Admitted</option>
                        <option value="rejected">Archived</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cutoffs Tab */}
      {activeTab === "cutoffs" && (
        <div className="card p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-slate-900">Branch Cutoff & Seat Matrix</h3>
              <p className="text-xs text-slate-500">Update opening & closing entrance ranks for the 2026-2027 academic session.</p>
            </div>
            <button className="btn-primary text-xs py-1.5 px-3">
              <Plus size={13} /> Add Specialization
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {[
              { course: "Computer Science & Engineering", seats: 180, cutoff: "Rank 1 - 1,850", fee: "₹2.2L / yr" },
              { course: "Artificial Intelligence & Data Science", seats: 120, cutoff: "Rank 1,850 - 3,200", fee: "₹2.2L / yr" },
              { course: "Information Technology", seats: 120, cutoff: "Rank 3,200 - 5,400", fee: "₹2.0L / yr" },
              { course: "Electronics & Communication Engineering", seats: 120, cutoff: "Rank 5,400 - 9,100", fee: "₹1.8L / yr" },
            ].map((c) => (
              <div key={c.course} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{c.course}</div>
                  <div className="text-slate-500 text-[11px]">{c.seats} Approved Seats · Tuition: {c.fee}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">{c.cutoff}</span>
                  <button className="btn-outline text-xs py-1 px-2.5">Edit</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
