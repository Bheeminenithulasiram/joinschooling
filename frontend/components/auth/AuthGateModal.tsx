"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Lock, ArrowRight, ShieldCheck, CheckCircle2, UserCheck, Briefcase, GraduationCap } from "lucide-react";

interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  actionType?: "apply" | "inquiry" | "mentorship" | "save" | "general";
  targetName?: string;
}

export function AuthGateModal({
  isOpen,
  onClose,
  title,
  subtitle,
  actionType = "general",
  targetName,
}: AuthGateModalProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const redirectParam = encodeURIComponent(pathname);

  const getDetails = () => {
    switch (actionType) {
      case "apply":
        return {
          badge: "Student Application Gate",
          badgeIcon: Briefcase,
          defaultTitle: `Sign in to Apply for ${targetName || "this role"}`,
          defaultSubtitle: "Create your free verified student profile to submit applications directly to corporate hiring teams.",
          perks: [
            "1-Click verified student application submission",
            "Direct ATS tracking with real-time status updates",
            "Shortlist notifications & interview alerts",
          ],
        };
      case "inquiry":
        return {
          badge: "Admissions Inquiry Desk",
          badgeIcon: GraduationCap,
          defaultTitle: `Connect with ${targetName || "University"} Admissions`,
          defaultSubtitle: "Sign in to send your official admission counseling inquiry and receive cutoff guidance.",
          perks: [
            "Direct counseling callback from campus deans",
            "Verified fee structure and scholarship brochures",
            "Track inquiry updates in your student desk",
          ],
        };
      case "mentorship":
        return {
          badge: "1:1 Alumni Mentorship",
          badgeIcon: UserCheck,
          defaultTitle: `Book 1:1 Session with ${targetName || "Mentor"}`,
          defaultSubtitle: "Sign in to reserve your dedicated career guidance and mock interview slot.",
          perks: [
            "Direct calendar sync and meeting link delivery",
            "Personalized resume & system design review",
            "Post-call notes and referral opportunities",
          ],
        };
      case "save":
        return {
          badge: "Save to Shortlist",
          badgeIcon: ShieldCheck,
          defaultTitle: "Sign in to Save your Shortlist",
          defaultSubtitle: "Bookmark colleges and jobs to compare packages and review deadlines anytime.",
          perks: [
            "Synchronized across all your devices",
            "Application deadline countdown alerts",
            "Side-by-side cutoff matrix comparison",
          ],
        };
      default:
        return {
          badge: "JoinSchooling Account Required",
          badgeIcon: Lock,
          defaultTitle: title || "Sign in to Continue",
          defaultSubtitle: subtitle || "Please sign in or register to access this feature.",
          perks: [
            "Access accredited college admissions and cutoffs",
            "Apply to verified technology internships",
            "Book 1:1 alumni sessions with top engineers",
          ],
        };
    }
  };

  const config = getDetails();
  const Icon = config.badgeIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
            <Icon size={13} />
            <span>{config.badge}</span>
          </div>

          <div>
            <h3 className="font-display text-xl font-bold text-slate-900 leading-snug">
              {title || config.defaultTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {subtitle || config.defaultSubtitle}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Account Benefits
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {config.perks.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={`/auth/login?redirect=${redirectParam}`}
              className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Sign In to Continue</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href={`/auth/register?redirect=${redirectParam}`}
              className="btn-outline w-full py-2.5 text-xs font-semibold text-center hover:bg-slate-50"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
