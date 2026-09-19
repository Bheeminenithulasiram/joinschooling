"use client";

import { useState } from "react";
import { Briefcase, GraduationCap, MessageSquare, Search, Star, Calendar, CheckCircle2, X } from "lucide-react";
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
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search mentor, company, college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((a) => (
          <div
            key={a.id}
            className="card p-5 hover:border-blue-400 transition duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-900 font-bold text-sm text-white">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm font-bold text-slate-900 truncate">{a.name}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5 truncate">
                    <Briefcase size={12} className="text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{a.role}</span> @ {a.company}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 truncate">
                    <GraduationCap size={12} className="text-slate-400 shrink-0" />
                    {a.college} · {a.batch}
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-3.5 flex flex-wrap gap-1">
                {a.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              {a.open_to_mentor ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Open for 1:1
                </span>
              ) : (
                <Badge variant="slate">Not accepting</Badge>
              )}

              <button
                disabled={!a.open_to_mentor}
                onClick={() => setSelectedMentor(a)}
                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 font-semibold disabled:opacity-50"
              >
                <MessageSquare size={12} /> Book 1:1 Call
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-14 bg-white rounded-xl border border-slate-200">
          <GraduationCap size={40} className="mx-auto text-slate-300" />
          <h3 className="mt-2 text-base font-bold text-slate-800">No mentors found</h3>
          <p className="text-xs text-slate-500 mt-0.5">Try tweaking your search term or category filters.</p>
        </div>
      )}

      {/* 1:1 Mentorship Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">Session Requested!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {selectedMentor.name} has been notified. You will receive a calendar invite once confirmed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    Book Call with {selectedMentor.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedMentor.role} at {selectedMentor.company} · Alum of {selectedMentor.college}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="label">Mentorship Topic</label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="Resume Review & Referrals">Resume Review & Job Referrals</option>
                    <option value="DSA & Coding Interview Mock">DSA & Coding Interview Mock</option>
                    <option value="College vs Placement Advice">College Choice vs Tech Career Roadmap</option>
                    <option value="Salary Negotiation & Offer Evaluation">Salary Negotiation & Offer Evaluation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="label">Preferred Time Slot</label>
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
                        className={`p-2 rounded-lg text-left border text-xs font-semibold flex items-center gap-1.5 transition ${
                          selectedSlot === slot
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Calendar size={13} className={selectedSlot === slot ? "text-blue-600" : "text-slate-400"} />
                        <span className="truncate">{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="label">Your Context / Questions</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe what guidance you are seeking..."
                    className="input text-xs"
                    defaultValue="Hi, I am preparing for tech internship drives and would love advice on DSA preparation and getting a referral."
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="btn-ghost text-xs py-2 px-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary text-xs py-2 px-4 font-semibold"
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
