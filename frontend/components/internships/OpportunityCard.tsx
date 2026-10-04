import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { LandingInternship, InternshipCard as InternshipCardType } from "@/lib/types";

interface OpportunityCardProps {
  opportunity: LandingInternship | InternshipCardType;
  className?: string;
}

export function OpportunityCard({ opportunity, className = "" }: OpportunityCardProps) {
  const companyName = opportunity.company?.name || "Tech Employer";
  const cityName = opportunity.location_city || "India";

  const getCompanyInitials = (name: string) => {
    if (!name || name.trim().length === 0) return "TC";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const detailUrl = `/internships/${opportunity.slug || opportunity.id}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition duration-200 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-3.5">
        {/* Header: Company Logo/Initials + Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-white p-0.5 shrink-0">
            <SafeImage
              src={opportunity.company?.logo_url}
              alt={companyName}
              className="w-full h-full object-contain"
              fallbackInitials={getCompanyInitials(companyName)}
              fallbackClassName="w-full h-full text-xs font-bold bg-slate-100 text-slate-700"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-500 block truncate">
              {companyName}
            </span>
            <Link
              href={detailUrl}
              className="font-serif text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 transition block leading-snug line-clamp-1 mt-0.5"
            >
              {opportunity.title}
            </Link>
          </div>
        </div>

        {/* Location & Work Mode */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={13} className="text-slate-400 shrink-0" />
          <span>{cityName}</span>
          {opportunity.work_mode && (
            <>
              <span>•</span>
              <span className="capitalize">{opportunity.work_mode}</span>
            </>
          )}
        </div>

        {/* Skill Tags */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {opportunity.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row: Stipend & View Link */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="font-bold text-xs sm:text-sm text-slate-900">
          {opportunity.stipend_min
            ? `₹${opportunity.stipend_min.toLocaleString()} / month`
            : "Paid Internship"}
        </span>
        <Link
          href={detailUrl}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
        >
          <span>View Internship</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs animate-pulse flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-slate-200 rounded-md w-1/3" />
            <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          </div>
        </div>
        <div className="h-3 bg-slate-200 rounded-md w-1/2" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-5 bg-slate-100 rounded-md w-14" />
          <div className="h-5 bg-slate-100 rounded-md w-16" />
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded-md w-24" />
        <div className="h-4 bg-slate-200 rounded-md w-20" />
      </div>
    </div>
  );
}
