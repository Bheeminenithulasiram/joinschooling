"use client";
import React, { useState } from "react";
import { X, Send, Briefcase, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { applyInternshipAction } from "@/lib/actions/apply";
import { useToast } from "@/components/ui/Toast";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship: {
    id: string;
    title: string;
    company: string;
    stipend_min?: number;
    stipend_max?: number;
  };
}

export function ApplyModal({ isOpen, onClose, internship }: ApplyModalProps) {
  const { success, error } = useToast();
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Kiran Kumar",
    email: "kiran.k@educonnect.dev",
    phone: "+91 98451 22310",
    college: "VNR VJIET",
    graduationYear: "2026",
    cgpa: "9.1",
    portfolioUrl: "https://github.com/kirankumar-dev",
    coverLetter: "I am deeply interested in this opportunity. I have hands-on experience building full-stack projects in React, Java, and cloud microservices.",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      const res = await applyInternshipAction(internship.id, formData.coverLetter);
      if (res.ok) {
        setSubmitted(true);
        success(`Application submitted to ${internship.company}!`);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 1800);
      } else {
        error(res.error || "Failed to submit application");
      }
    } catch {
      error("Application submission failed");
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
            <h3 className="font-display text-2xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Your profile has been forwarded to the {internship.company} recruitment team. Track updates in your Dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 border border-brand-200">
                <Briefcase size={13} /> {internship.company}
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-slate-900">{internship.title}</h2>
              <p className="text-xs text-slate-500">
                Verify your student profile details and submit your application with 1-click.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="label">Full Name</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input
                  required
                  type="email"
                  className="input text-xs"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="label">Phone</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="label">CGPA</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Grad Year</label>
                <input
                  required
                  className="input text-xs"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">College / University</label>
              <input
                required
                className="input text-xs"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              />
            </div>

            <div>
              <label className="label">GitHub / Portfolio URL</label>
              <input
                type="url"
                className="input text-xs"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Short Note / Pitch</label>
              <textarea
                rows={3}
                className="input text-xs resize-none"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full py-3 text-sm font-bold shadow-glow"
            >
              {pending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting Application...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit Application
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
