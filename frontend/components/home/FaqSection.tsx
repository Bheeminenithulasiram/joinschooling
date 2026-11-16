"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    id: "q1",
    category: "Data Integrity",
    question: "How does JoinSchooling verify college cutoffs, NIRF ranks, and placement statistics?",
    answer:
      "All cutoff ranks, NIRF ratings, and placement reports on JoinSchooling are audited directly against official counseling authorities (including JoSAA, CSAB, and State CET portals) and mandatory NIRF institutional submissions. We eliminate misleading placement claims by reporting audited median packages alongside verified peak offers.",
  },
  {
    id: "q2",
    category: "Internships & Jobs",
    question: "Are internships and jobs listed on JoinSchooling guaranteed to offer verified stipends?",
    answer:
      "Yes. Every technical internship and full-time role undergoes manual verification by our campus relations team. We verify the hiring organization's official domain, require transparent compensation details (strictly prohibiting unpaid technical work), and ensure all application channels connect directly to company ATS or campus drives.",
  },
  {
    id: "q3",
    category: "Student Access",
    question: "Is JoinSchooling free for students and job seekers?",
    answer:
      "Yes, 100% free. Students can explore over 12,500 accredited colleges, review closing cutoffs, run 3-way college comparisons, and apply directly to verified internships and full-time roles without any subscription fees, hidden paywalls, or credit card requirements.",
  },
  {
    id: "q4",
    category: "Comparison Tool",
    question: "How does the 3-Way College Comparison tool help in decision making?",
    answer:
      "The Comparison tool lets you place up to three colleges side-by-side to contrast crucial decision criteria: closing cutoffs across specific branches, audited median CTC, seat matrix, annual tuition fees, hostel facilities, student-to-faculty ratios, and verified alumni sentiment.",
  },
  {
    id: "q5",
    category: "Colleges & Universities",
    question: "How can university representatives claim and manage their institution profile?",
    answer:
      "Accredited universities and college administration teams can sign up for a verified College Representative account. Once verified, admissions officers can maintain their official branch cutoffs, update campus announcements, publish placement statistics, and connect with qualified prospective students.",
  },
  {
    id: "q6",
    category: "Recruitment",
    question: "How do employers and recruiters hire campus talent on JoinSchooling?",
    answer:
      "Recruiters can create an Employer account to publish verified internship drives and entry-level positions. Our platform allows filtering applicants by verified academic background, university tiers, and core technical skills (such as Python, Java, React, and Machine Learning) with zero spam applications.",
  },
];

export function FaqSection() {
  // Track open item index; default first item open for instant engagement
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="container-page pt-4 pb-2 sm:pt-6 sm:pb-3">
      <div className="w-full">
        
        {/* Section Header with exact format matching website */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-[2px] bg-blue-600 rounded-full" />
            <span className="text-xs font-bold tracking-[0.14em] uppercase text-blue-600">
              Clear Answers &amp; Guidance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold tracking-tight text-slate-900 leading-tight">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Everything you need to know about our verified college cutoffs, NIRF placement data, and internship drives.
          </p>
        </div>

        {/* Accordion Questions List */}
        <div className="w-full space-y-3.5">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-300 ease-out overflow-hidden ${
                  isOpen
                    ? "border-slate-300 shadow-sm"
                    : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Accordion Header / Question Button */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors focus:outline-hidden"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                        isOpen
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-display text-sm sm:text-base font-bold text-slate-900">
                      {faq.question}
                    </span>
                  </div>

                  {/* Rotating Chevron Icon */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 transition-all duration-300 ease-out ${
                      isOpen
                        ? "rotate-180 bg-slate-100 text-slate-800"
                        : "rotate-0 bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ChevronDown size={17} />
                  </div>
                </button>

                {/* Animated Answer Container with CSS Grid Height Transition */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-slate-100/90 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
