"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  ArrowRight,
  X,
  Briefcase,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

export interface InternshipShowcaseItem {
  id: string;
  company: string;
  monogram: string;
  badgeBg: string;
  badgeText: string;
  brandAccent: string;
  slantBg: string;
  logoSvg: React.ReactNode;
  role: string;
  discipline: "SDE" | "Data & Analytics";
  stipend: string;
  durationAndLoc: string;
  deadline: string;
  skills: string[];
  summary: string;
  deliverables: string[];
  eligibility: string;
  slug: string;
}

const INTERNSHIPS_DATA: InternshipShowcaseItem[] = [
  {
    id: "amazon-sde",
    company: "Amazon",
    monogram: "a",
    badgeBg: "#fef3c7",
    badgeText: "#b45309",
    brandAccent: "#ff9900",
    slantBg: "#131921",
    logoSvg: (
      <svg
        viewBox="0 0 160 56"
        className="w-32 sm:w-36 h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Amazon official logo"
      >
        <text
          x="80"
          y="30"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Plus Jakarta Sans, Arial, sans-serif"
          fontWeight="800"
          fontSize="27"
          letterSpacing="-0.03em"
        >
          amazon
        </text>
        <path
          d="M40 37.5C61 46.5 92 46.5 113 37"
          stroke="#FF9900"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M107.5 33.5L114.8 36.8L110.5 43.2"
          stroke="#FF9900"
          strokeWidth="3.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    role: "Software Development Intern",
    discipline: "SDE",
    stipend: "₹30,000/mo",
    durationAndLoc: "6 Months • Bengaluru",
    deadline: "Closes Nov 24",
    skills: ["Java", "DSA", "System Design"],
    summary:
      "Join Amazon Fulfillment Engineering to design high-throughput Java microservices, optimize distributed inventory caches, and ship production features reviewed by principal engineers.",
    deliverables: [
      "Build and benchmark low-latency REST & event-driven services in Java.",
      "Author automated integration and load-testing suites in CI/CD.",
      "Participate in weekly architecture design reviews with senior SDEs.",
    ],
    eligibility:
      "B.Tech / M.Tech in CS, IT, or ECE with strong Data Structures & Algorithms fundamentals.",
    slug: "software-engineering-intern-amazon",
  },
  {
    id: "microsoft-swe",
    company: "Microsoft",
    monogram: "MS",
    badgeBg: "#dbeafe",
    badgeText: "#1d4ed8",
    brandAccent: "#00a4ef",
    slantBg: "#172554",
    logoSvg: (
      <svg
        viewBox="0 0 176 48"
        className="w-36 sm:w-40 h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Microsoft official logo"
      >
        <rect x="8" y="12" width="10.5" height="10.5" fill="#F25022" />
        <rect x="20.5" y="12" width="10.5" height="10.5" fill="#7FBA00" />
        <rect x="8" y="24.5" width="10.5" height="10.5" fill="#00A4EF" />
        <rect x="20.5" y="24.5" width="10.5" height="10.5" fill="#FFB900" />
        <text
          x="40"
          y="30.5"
          fill="#ffffff"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="700"
          fontSize="21"
          letterSpacing="-0.02em"
        >
          Microsoft
        </text>
      </svg>
    ),
    role: "Software Engineering Intern",
    discipline: "SDE",
    stipend: "₹120,000/mo",
    durationAndLoc: "3 Months • Hyderabad",
    deadline: "Closes Nov 21",
    skills: ["Java", "DSA", "Cloud"],
    summary:
      "Work inside Azure Core Compute in Hyderabad to build resilient cloud orchestration pipelines, container health monitors, and internal developer diagnostic tools.",
    deliverables: [
      "Develop fault-tolerant control-plane modules for distributed Linux clusters.",
      "Analyze service telemetry to reduce cold-start orchestration latency.",
      "Deliver an end-of-term engineering demo to product leadership.",
    ],
    eligibility:
      "Pre-final year B.Tech / Dual-Degree students with strong systems & algorithmic fluency.",
    slug: "software-engineering-intern-microsoft",
  },
  {
    id: "tcs-ds",
    company: "TCS",
    monogram: "tcs",
    badgeBg: "#fee2e2",
    badgeText: "#b91c1c",
    brandAccent: "#ec4899",
    slantBg: "#1e1b4b",
    logoSvg: (
      <svg
        viewBox="0 0 186 58"
        className="w-36 sm:w-40 h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Tata Consultancy Services official logo"
      >
        <ellipse cx="32" cy="24" rx="18" ry="12" stroke="#38BDF8" strokeWidth="2.4" />
        <path
          d="M18 19.5H46M32 19.5V34"
          stroke="#38BDF8"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <text
          x="60"
          y="31"
          fill="#ffffff"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="800"
          fontSize="26"
          letterSpacing="-0.03em"
        >
          tcs
        </text>
        <text
          x="60"
          y="44"
          fill="#CBD5E1"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="600"
          fontSize="6.4"
          letterSpacing="0.06em"
        >
          TATA CONSULTANCY SERVICES
        </text>
      </svg>
    ),
    role: "Data Science Intern",
    discipline: "Data & Analytics",
    stipend: "₹25,000/mo",
    durationAndLoc: "6 Months • Hyderabad",
    deadline: "Closes Nov 28",
    skills: ["Python", "ML", "SQL"],
    summary:
      "Collaborate with TCS Research & Innovation applied analytics teams to build demand-forecasting models and structured enterprise document extraction workflows.",
    deliverables: [
      "Curate and transform multi-million-row relational datasets using SQL & Python.",
      "Train and benchmark supervised predictive models with reproducible pipelines.",
      "Deliver precision/recall evaluation reports for production endpoints.",
    ],
    eligibility:
      "B.Tech / B.Sc / M.Sc in Computer Science, Data Science, or Applied Mathematics.",
    slug: "data-science-intern-tcs",
  },
  {
    id: "zs-ba",
    company: "ZS Associates",
    monogram: "ZS",
    badgeBg: "#f1f5f9",
    badgeText: "#0f172a",
    brandAccent: "#ff6b00",
    slantBg: "#0f172a",
    logoSvg: (
      <svg
        viewBox="0 0 156 54"
        className="w-32 sm:w-36 h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ZS Associates official logo"
      >
        <polygon points="18,13 46,13 30,27 18,27" fill="#FF6B00" />
        <polygon points="30,27 46,27 46,41 18,41" fill="#00A3E0" />
        <text
          x="58"
          y="36"
          fill="#ffffff"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="800"
          fontSize="29"
          letterSpacing="-0.02em"
        >
          ZS
        </text>
      </svg>
    ),
    role: "Business Analytics Associate",
    discipline: "Data & Analytics",
    stipend: "₹30,000/mo",
    durationAndLoc: "6 Months • Pune",
    deadline: "Closes Nov 26",
    skills: ["Java", "SQL", "Analytics"],
    summary:
      "Partner with global healthcare and life-sciences product teams to model commercial launch metrics, automate KPI reporting, and surface actionable territory insights.",
    deliverables: [
      "Write analytical SQL queries to evaluate regional product adoption.",
      "Build automated data validation utilities in Java and Python.",
      "Synthesize quantitative findings into structured client decision briefs.",
    ],
    eligibility:
      "B.Tech / B.E. students across all branches with strong SQL and quantitative reasoning.",
    slug: "business-analytics-associate-zs-associates",
  },
];

export function InternshipsShowcase() {
  const [filter, setFilter] = useState<"all" | "SDE" | "Data & Analytics">("all");
  const [selectedRole, setSelectedRole] = useState<InternshipShowcaseItem | null>(null);

  const filteredRoles =
    filter === "all"
      ? INTERNSHIPS_DATA
      : INTERNSHIPS_DATA.filter((r) => r.discipline === filter);

  return (
    <section className="container-page space-y-6 sm:space-y-8 select-none">
      {/* Section Header: Subtitle, Title, Filter Pills, View All Link */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-blue-600 mb-2">
            <span className="w-6 h-[2px] bg-blue-600 rounded-full" />
            <span>Direct Campus &amp; Off-Campus Roles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold tracking-tight text-slate-900 leading-tight">
            Latest Verified <span className="text-blue-600">Tech Internships</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Discipline Filter Pills */}
          <div className="inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Flagship ({INTERNSHIPS_DATA.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("SDE")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === "SDE"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              SDE
            </button>
            <button
              type="button"
              onClick={() => setFilter("Data & Analytics")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === "Data & Analytics"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Data &amp; Analytics
            </button>
          </div>

          {/* View All Internships Link Button */}
          <Link
            href="/internships"
            prefetch={true}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 transition-all hover:scale-105 active:scale-95 shadow-2xs"
          >
            <span>View All Internships</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2x2 Flagship Internships Grid with Slant-Cut Inversion Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {filteredRoles.map((role) => (
          <article
            key={role.id}
            onClick={() => setSelectedRole(role)}
            className="internship-showcase-card group p-6 cursor-pointer flex flex-col justify-between gap-5 min-h-[220px]"
          >
            {/* Slant-Cut Right Half Company Logo Panel on Hover */}
            <div
              className="internship-slant-panel flex items-center justify-end pr-6 sm:pr-8 pl-14"
              style={{ backgroundColor: role.slantBg }}
            >
              <div
                className="absolute top-0 bottom-0 left-[22%] w-[3px] -translate-x-1/2"
                style={{ backgroundColor: role.brandAccent }}
              />
              <div className="relative z-10 transform translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                {role.logoSvg}
              </div>
            </div>

            {/* Base Dark Text Layer (Visible over Left Side) */}
            <div className="internship-card-content">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 border border-black/5"
                    style={{ backgroundColor: role.badgeBg, color: role.badgeText }}
                  >
                    {role.monogram}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-700">
                        {role.company}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mt-0.5 truncate">
                      {role.role}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Stipend Pill */}
              <div className="mt-3.5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {role.stipend}
                </span>
              </div>

              {/* Skills Row */}
              <div className="flex flex-wrap items-center gap-1.5 mt-4">
                {role.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Base Bottom Row */}
            <div className="internship-card-content pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-500">
                {role.durationAndLoc}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 tracking-tight">
                <span>View Role</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </span>
            </div>

            {/* Exact-Pixel Clipped White Layer: Elements overlapping slant cut turn clean white */}
            <div className="internship-white-overlay" aria-hidden="true">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl shrink-0 opacity-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {role.company}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                          <BadgeCheck className="w-3.5 h-3.5 text-emerald-300" />
                          Verified
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug mt-0.5 truncate">
                        {role.role}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-white/15 text-white border border-white/25 backdrop-blur-xs">
                    {role.stipend}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-4">
                  {role.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/25 text-xs font-semibold text-white backdrop-blur-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3.5 border-t border-white/25 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-white/90">
                  {role.durationAndLoc}
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white tracking-tight">
                  <span>View Role</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Quick-Preview Modal */}
      <div
        className={`internship-modal-backdrop fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 ${
          selectedRole ? "is-open" : ""
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedRole(null);
        }}
      >
        {selectedRole && (
          <div className="internship-modal-card bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedRole(null)}
              aria-label="Close preview"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 pr-8 pb-4 border-b border-slate-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-base shrink-0 border border-black/5"
                style={{
                  backgroundColor: selectedRole.badgeBg,
                  color: selectedRole.badgeText,
                }}
              >
                {selectedRole.monogram}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-700">
                    {selectedRole.company}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Partner
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 leading-snug mt-0.5">
                  {selectedRole.role}
                </h3>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Stipend: {selectedRole.stipend}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                {selectedRole.durationAndLoc}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                {selectedRole.deadline}
              </span>
            </div>

            {/* Summary */}
            <p className="text-sm text-slate-600 leading-relaxed mt-4">
              {selectedRole.summary}
            </p>

            {/* Key Deliverables */}
            <div className="mt-4">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Key Responsibilities &amp; Deliverables
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                {selectedRole.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                Eligibility Criteria
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {selectedRole.eligibility}
              </p>
            </div>

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
              <Link
                href={`/internships/${selectedRole.slug}`}
                prefetch={true}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:shadow"
              >
                <span>Apply for Role</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
