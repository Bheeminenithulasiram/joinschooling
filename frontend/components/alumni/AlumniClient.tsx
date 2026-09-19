"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, MessageSquare, Search, Sparkles, Star, Calendar, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

interface AlumniMentor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  college: string;
  batch: string | number;
  skills: string[];
  open_to_mentor: boolean;
}

interface AlumniClientProps {
  mentors: AlumniMentor[];
}

export function AlumniClient({ mentors }: AlumniClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<AlumniMentor | null>(null);
  const [bookingTopic, setBookingTopic] = useState("Resume Review & Referrals");
  const [selectedSlot, setSelectedSlot] = useState("Tomorrow at 6:00 PM IST");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { addToast } = useToast();

  const categories = ["All", "SDE", "Data Science", "Product", "Design", "Consulting"];

  const filteredMentors = mentors.filter((mentor) => {
    const matchesCategory =
      activeCategory === "All" ||
      mentor.role.toLowerCase().includes(activeCategory.toLowerCase()) ||
      mentor.skills.some((s) => s.toLowerCase().includes(activeCategory.toLowerCase()));

    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(true);
      addToast(
        `1:1 Mentorship session requested with ${selectedMentor?.name}! Confirmation sent to your email.`,
        "success"
      );
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedMentor(null);
      }, 1500);
    }, 800);
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by mentor, company, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((a) => (
          <div
            key={a.id}
            className="glass-card hover:border-brand-300 transition duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-extrabold text-white shadow-md">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base font-bold text-slate-900 truncate">{a.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 truncate">
                    <Briefcase size={13} className="text-brand-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{a.role}</span> @ {a.company}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
                    <GraduationCap size={13} className="text-accent-600 shrink-0" />
                    {a.college} · {a.batch}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {a.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              {a.open_to_mentor ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Open for 1:1
                </span>
              ) : (
                <Badge variant="slate">Not accepting</Badge>
              )}

              <button
                disabled={!a.open_to_mentor}
                onClick={() => setSelectedMentor(a)}
                className="btn-primary py-2 px-3 text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                <MessageSquare size={13} /> Book 1:1 Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <GraduationCap size={44} className="mx-auto text-slate-300" />
          <h3 className="mt-3 text-lg font-bold text-slate-800">No mentors found</h3>
          <p className="text-xs text-slate-500 mt-1">Try tweaking your search term or category filters.</p>
        </div>
      )}

      {/* 1:1 Mentorship Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900">Session Requested!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {selectedMentor.name} has been notified. You will receive a calendar invite with Google Meet link once confirmed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-2">
                    <Sparkles size={13} /> 1:1 Mentorship
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-slate-900">
                    Book Call with {selectedMentor.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedMentor.role} at {selectedMentor.company} · Alum of {selectedMentor.college}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Mentorship Topic</label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50"
                  >
                    <option value="Resume Review & Referrals">Resume Review & Job Referrals</option>
                    <option value="DSA & System Design Mock">DSA & Coding Interview Mock</option>
                    <option value="College vs Placement Advice">College Choice vs Tech Career Roadmap</option>
                    <option value="Salary Negotiation & Offer Evaluation">Salary Negotiation & Offer Evaluation</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Available Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Tomorrow, 6:00 PM IST",
                      "Tomorrow, 8:30 PM IST",
                      "Saturday, 11:00 AM IST",
                      "Sunday, 4:00 PM IST",
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition ${
                          selectedSlot === slot
                            ? "border-brand-600 bg-brand-50/70 text-brand-700 ring-2 ring-brand-200"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar size={14} className={selectedSlot === slot ? "text-brand-600" : "text-slate-400"} />
                        <span className="truncate">{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Your Question or Context</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe what you'd like guidance on (e.g. applying to Amazon SDE intern, resume review)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none bg-slate-50"
                    defaultValue="Hi, I am preparing for tech internship drives and would love advice on DSA preparation and getting a referral."
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center gap-2"
                  >
                    {isSubmitting ? "Requesting..." : "Confirm Mentorship Call"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
