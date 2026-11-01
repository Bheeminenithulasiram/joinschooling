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
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition duration-200 flex flex-col justify-between group ${className}`}
    >
      <div className="space-y-3.5">
        {/* Header: Company Logo/Initials + Title */}
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 p-1 shrink-0 flex items-center justify-center">
            <SafeImage
              src={opportunity.company?.logo_url}
              alt={companyName}
              className="w-full h-full object-contain"
              fallbackInitials={getCompanyInitials(companyName)}
              fallbackClassName="w-full h-full text-xs font-black bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-400 block truncate">
              {companyName}
            </span>
            <Link
              href={detailUrl}
              className="font-display text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition block leading-snug line-clamp-1 mt-0.5"
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
                className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Row: Stipend & View Link */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="font-display font-extrabold text-xs sm:text-sm text-emerald-600">
          {opportunity.stipend_min
            ? `₹${opportunity.stipend_min.toLocaleString()} / mo`
            : "Paid Internship"}
        </span>
        <Link
          href={detailUrl}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition inline-flex items-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs animate-pulse flex flex-col justify-between">
      <div className="space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 bg-slate-200 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3.5 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-3/4" />
          </div>
        </div>
        <div className="h-3.5 bg-slate-100 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-5 bg-slate-100 rounded w-14" />
          <div className="h-5 bg-slate-100 rounded w-14" />
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-6 bg-slate-200 rounded w-20" />
      </div>
    </div>
  );
}
