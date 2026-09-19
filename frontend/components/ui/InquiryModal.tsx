"use client";
import React, { useState } from "react";
import { X, Send, GraduationCap, CheckCircle2, Loader2 } from "lucide-react";
import { submitCollegeInquiryAction } from "@/lib/actions/apply";
import { useToast } from "@/components/ui/Toast";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  college: {
    slug: string;
    name: string;
    city: string;
    courses?: { name: string }[];
  };
}

export function InquiryModal({ isOpen, onClose, college }: InquiryModalProps) {
  const { success, error } = useToast();
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "Kiran Kumar",
    email: "kiran.k@educonnect.dev",
    phone: "+91 98451 22310",
    marks: "94.2% (12th Board)",
    course: college.courses?.[0]?.name || "Computer Science and Engineering",
    message: "I would like to inquire regarding cutoff ranks, hostel availability, and fee installment schedules.",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const res = await submitCollegeInquiryAction(college.slug, formData);
      if (res.ok) {
        setSubmitted(true);
        success(`Inquiry sent to ${college.name}!`);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1800);
      } else {
        error(res.error || "Failed to submit inquiry");
      }
    } catch {
      error("Inquiry submission failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-900">Inquiry Sent Successfully!</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              The Admissions Office of {college.name} has received your inquiry. A counselor will reach out via phone/email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                <GraduationCap size={13} /> Official Admissions Inquiry
              </div>
              <h2 className="mt-2 font-display text-xl font-extrabold text-slate-900">{college.name}</h2>
              <p className="text-xs text-slate-500">
                Connect directly with the campus admission dean and counseling team.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="label">Student Name</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  required
                  type="email"
                  className="input text-xs"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Phone Number</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label">10th / 12th / Score</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Interested Program</label>
              {college.courses && college.courses.length > 0 ? (
                <select
                  className="input text-xs"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  {college.courses.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  className="input text-xs"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                />
              )}
            </div>

            <div>
              <label className="label">Questions for Counselor</label>
              <textarea
                rows={3}
                className="input text-xs resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full py-3 text-sm font-bold shadow-sm"
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting Inquiry...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Admissions Inquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
