"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  PlusCircle,
  Building,
  CheckCircle2,
  FileText,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  X,
  Plus,
  Loader2,
  Star,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { mockRecruiterApplicants, internships as initialInternships } from "@/lib/mock";
import { logoutAction } from "@/lib/actions/auth";
import { useToast } from "@/components/ui/Toast";

export function RecruiterDashboardClient({ data }: { data: any }) {
  const { success, error, info } = useToast();
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ats" | "postings" | "talent">("ats");
  const [applicants, setApplicants] = useState(mockRecruiterApplicants);
  const [postings, setPostings] = useState(initialInternships.slice(0, 4));
  const [statusFilter, setStatusFilter] = useState("all");

  // New posting form state
  const [newPosting, setNewPosting] = useState({
    title: "",
    domain: "Software",
    work_mode: "hybrid",
    city: "Hyderabad",
    stipend_min: 60000,
    stipend_max: 90000,
    duration_months: 6,
    openings: 5,
    skills: "Java, Spring Boot, React, SQL",
    description: "",
  });

  const recruiter = data?.recruiter || {
    name: "Meenakshi Sundaram",
    designation: "Lead University Recruiter",
    company_name: "Amazon India",
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    success(`Candidate status moved to "${newStatus.toUpperCase()}"`);

    try {
      await fetch(`/api/v1/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
  };

  const handleCreatePosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosting.title) {
      error("Job title is required");
      return;
    }

    const created = {
      id: `int-${Date.now()}`,
      slug: newPosting.title.toLowerCase().replace(/\s+/g, "-"),
      title: newPosting.title,
      company: recruiter.company_name,
      logo: "💼",
      work_mode: newPosting.work_mode as any,
      city: newPosting.city,
      stipend_min: Number(newPosting.stipend_min),
      stipend_max: Number(newPosting.stipend_max),
      stipend_currency: "INR",
      duration_months: Number(newPosting.duration_months),
      openings: Number(newPosting.openings),
      domain: newPosting.domain,
      skills: newPosting.skills.split(",").map((s) => s.trim()),
      posted_at: new Date().toISOString(),
      apply_deadline: "2026-11-30",
      is_active: true,
      description: newPosting.description || "Opportunity posted by verified corporate partner.",
      responsibilities: ["Develop production features", "Collaborate in code reviews"],
      requirements: ["Enrolled student with good GPA"],
      benefits: ["High stipend", "PPO conversion potential"],
      eligibility_batches: ["2026", "2027"],
    };

    setPostings([created, ...postings]);
    setPostModalOpen(false);
    success(`Published "${created.title}" to public listings!`);
  };

  const filteredApplicants = statusFilter === "all"
    ? applicants
    : applicants.filter((app) => app.status === statusFilter);

  return (
    <div className="container-page py-10 space-y-8">
      {/* Create Posting Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPostModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 border border-sky-200">
                <Briefcase size={13} /> {recruiter.company_name}
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">Post New Internship / Job</h2>
              <p className="text-xs text-slate-500">Publish your opening directly to 4.5M+ verified undergraduate students.</p>
            </div>

            <form onSubmit={handleCreatePosting} className="space-y-4 pt-2">
              <div>
                <label className="label">Opportunity Title</label>
                <input
                  required
                  className="input text-xs"
                  placeholder="e.g. Backend Engineering Intern (Go / Node)"
                  value={newPosting.title}
                  onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Domain</label>
                  <select
                    className="input text-xs"
                    value={newPosting.domain}
                    onChange={(e) => setNewPosting({ ...newPosting, domain: e.target.value })}
                  >
                    <option value="Software">Software Engineering</option>
                    <option value="AI/ML">AI / Machine Learning</option>
                    <option value="Web">Full-Stack Web</option>
                    <option value="Data">Data Analytics</option>
                    <option value="Mobile">Mobile App Dev</option>
                  </select>
                </div>
                <div>
                  <label className="label">Work Mode</label>
                  <select
                    className="input text-xs"
                    value={newPosting.work_mode}
                    onChange={(e) => setNewPosting({ ...newPosting, work_mode: e.target.value })}
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Min Stipend (₹/mo)</label>
                  <input
                    type="number"
                    step={5000}
                    className="input text-xs"
                    value={newPosting.stipend_min}
                    onChange={(e) => setNewPosting({ ...newPosting, stipend_min: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="label">Max Stipend (₹/mo)</label>
                  <input
                    type="number"
                    step={5000}
                    className="input text-xs"
                    value={newPosting.stipend_max}
                    onChange={(e) => setNewPosting({ ...newPosting, stipend_max: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Location City</label>
                  <input
                    className="input text-xs"
                    value={newPosting.city}
                    onChange={(e) => setNewPosting({ ...newPosting, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Openings</label>
                  <input
                    type="number"
                    min={1}
                    className="input text-xs"
                    value={newPosting.openings}
                    onChange={(e) => setNewPosting({ ...newPosting, openings: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="label">Required Skills (Comma-separated)</label>
                <input
                  className="input text-xs"
                  value={newPosting.skills}
                  onChange={(e) => setNewPosting({ ...newPosting, skills: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Job Description & Responsibilities</label>
                <textarea
                  rows={3}
                  className="input text-xs resize-none"
                  placeholder="Describe project responsibilities and qualification criteria..."
                  value={newPosting.description}
                  onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-xs font-bold shadow-sm">
                Publish Opportunity Live
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Classic Dark Navy Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <Building size={13} /> Corporate Recruitment & ATS Portal
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              {recruiter.company_name} Talent & ATS Desk
            </h1>
            <p className="text-xs text-slate-400">
              Welcome, {recruiter.name} ({recruiter.designation}). Track applicants across hiring stages and post internship drives.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setPostModalOpen(true)}
              className="btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3.5 rounded-lg transition flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Post New Opportunity
            </button>
            <form action={logoutAction}>
              <button className="btn bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 px-3.5 rounded-lg transition font-semibold">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Active Postings</span>
            <Briefcase size={18} className="text-sky-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-900">{postings.length}</div>
          <p className="text-[11px] text-sky-600 font-semibold">Live across campus network</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Total Candidates</span>
            <Users size={18} className="text-brand-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-brand-700">{applicants.length + 182}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+34 resumes this week</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Shortlisted</span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div className="font-display text-3xl font-extrabold text-emerald-600">24</div>
          <p className="text-[11px] text-slate-400">Scheduled for interviews</p>
        </div>

        <div className="card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Recruiter Partner</span>
            <ShieldCheck size={18} className="text-purple-600" />
          </div>
          <div className="font-display text-3xl font-extrabold text-purple-700">Verified</div>
          <p className="text-[11px] text-slate-400">Priority student badge</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab("ats")}
          className={`pb-3 px-2 transition border-b-2 ${
            activeTab === "ats" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500"
          }`}
        >
          Applicant Tracking System ({applicants.length})
        </button>
        <button
          onClick={() => setActiveTab("postings")}
          className={`pb-3 px-2 transition border-b-2 ${
            activeTab === "postings" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500"
          }`}
        >
          Your Live Postings ({postings.length})
        </button>
        <button
          onClick={() => setActiveTab("talent")}
          className={`pb-3 px-2 transition border-b-2 ${
            activeTab === "talent" ? "border-sky-600 text-sky-700" : "border-transparent text-slate-500"
          }`}
        >
          Campus Talent Pool Search
        </button>
      </div>

      {/* ATS Pipeline View */}
      {activeTab === "ats" && (
        <div className="card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Candidate Applicant Pipeline</h2>
              <p className="text-xs text-slate-500">Screen, shortlist, and invite top student engineers for interviews.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input text-xs w-44 py-1.5"
              >
                <option value="all">All Candidate Stages</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview Scheduled</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Institution & CGPA</th>
                  <th className="p-3">Applied Position</th>
                  <th className="p-3">Skills & Portfolio</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">ATS Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{app.candidate_name}</div>
                      <div className="text-[11px] text-slate-400">{app.candidate_email}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{app.college_name}</div>
                      <div className="text-[11px] text-brand-700 font-bold">CGPA: {app.cgpa} · {app.degree}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-800 max-w-[180px] truncate">{app.internship_title}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {app.skills.map((s) => (
                          <span key={s} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                          app.status === "shortlisted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : app.status === "interview"
                            ? "bg-purple-50 text-purple-800 border-purple-300"
                            : app.status === "hired"
                            ? "bg-brand-50 text-brand-800 border-brand-300"
                            : "bg-sky-50 text-sky-800 border-sky-300"
                        }`}
                      >
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview Scheduled</option>
                        <option value="hired">Offer Extended / Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Live Postings Tab */}
      {activeTab === "postings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-slate-900">Your Active Campus Recruitment Drives</h2>
            <button
              onClick={() => setPostModalOpen(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Plus size={14} /> New Job Posting
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {postings.map((p) => (
              <div key={p.id} className="card p-5 space-y-3 hover:border-sky-300 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500">{p.domain} · {p.city || "Remote"}</p>
                  </div>
                  <Badge variant={p.work_mode === "remote" ? "green" : "blue"}>{p.work_mode}</Badge>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="font-bold text-brand-700">₹{p.stipend_min.toLocaleString()}–{p.stipend_max.toLocaleString()}/mo</span>
                  <Link href={`/internships/${p.slug}`} className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1">
                    Public Listing <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campus Talent Pool Search Tab */}
      {activeTab === "talent" && (
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Direct Campus Candidate Sourcing</h2>
            <p className="text-xs text-slate-500">Filter 4.5M+ verified undergraduate students by coding skills and academic GPA.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Skill / Technology</label>
              <input className="input text-xs" defaultValue="Python, DSA" placeholder="e.g. React, Java, PyTorch" />
            </div>
            <div>
              <label className="label">Min CGPA Threshold</label>
              <input className="input text-xs" type="number" defaultValue={8.5} step={0.1} />
            </div>
            <div>
              <label className="label">Graduation Batch</label>
              <select className="input text-xs">
                <option>2026 Batch (Immediate Interns)</option>
                <option>2027 Batch (Pre-Final Year)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured High-CGPA Candidates</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "Kiran Kumar", college: "VNR VJIET", cgpa: 9.1, batch: 2026, skills: ["Java", "Spring Boot", "AWS", "DSA"] },
                { name: "Divya N.", college: "IIIT Hyderabad", cgpa: 9.4, batch: 2026, skills: ["C++", "DSA", "Distributed Systems"] },
                { name: "Arunav Sen", college: "IIT Bombay", cgpa: 8.9, batch: 2026, skills: ["Python", "PyTorch", "Transformers", "RAG"] },
                { name: "Sneha Reddy", college: "BITS Hyderabad", cgpa: 9.2, batch: 2026, skills: ["React", "TypeScript", "Node.js"] },
              ].map((c) => (
                <div key={c.name} className="rounded-2xl border border-slate-200 p-4 space-y-2 bg-slate-50/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.college} · {c.batch} Batch</div>
                    </div>
                    <span className="rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5">
                      {c.cgpa} CGPA
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {c.skills.map((s) => (
                      <span key={s} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => success(`Interview invitation sent to ${c.name}!`)}
                      className="btn-primary text-xs py-1.5 px-3 w-full"
                    >
                      Send Fast-Track Interview Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
