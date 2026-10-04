import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { LandingCollege, CollegeCard as CollegeCardType } from "@/lib/types";

interface CollegeCardProps {
  college: LandingCollege | CollegeCardType;
  className?: string;
}

export function CollegeCard({ college, className = "" }: CollegeCardProps) {
  const getInitials = (name: string) => {
    if (!name) return "CL";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const detailUrl = `/colleges/${college.slug || college.id}`;

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-slate-300 hover:shadow-md transition duration-200 flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* College Cover Banner with Floating Ranking Badge */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <SafeImage
            src={college.banner_url}
            alt={college.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            fallbackInitials={getInitials(college.name)}
            fallbackClassName="w-full h-full text-2xl text-slate-400 bg-slate-100"
            loading="lazy"
          />

          {/* Badge: Official National Ranking vs Platform Rating */}
          {college.nirf_rank ? (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/80 text-right">
              <div className="text-[11px] font-extrabold text-slate-900 leading-tight">
                NIRF #{college.nirf_rank}
              </div>
              <div className="text-[9px] text-slate-500 font-semibold leading-tight">
                National Ranking
              </div>
            </div>
          ) : college.rating ? (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-sm border border-slate-200/80 text-right">
              <div className="text-[11px] font-extrabold text-amber-600 leading-tight">
                ★ {college.rating} / 5
              </div>
              <div className="text-[9px] text-slate-500 font-semibold leading-tight">
                Platform Rating
              </div>
            </div>
          ) : null}
        </div>

        {/* Body Information */}
        <div className="p-5 space-y-3">
          <div>
            <Link
              href={detailUrl}
              className="font-serif text-base font-bold text-slate-900 hover:text-blue-600 transition line-clamp-1"
            >
              {college.name}
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">
                {college.city}
                {college.state ? `, ${college.state}` : ""}
              </span>
            </div>
          </div>

          {/* Placement & Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <div className="text-xs font-bold text-slate-900">
                {college.avg_package_lpa ? `₹${college.avg_package_lpa} LPA` : "Available on request"}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Average Placement Package</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {college.placement_percent ? `${college.placement_percent}%` : "Verified track record"}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Link */}
      <div className="px-5 pb-5 pt-1">
        <Link
          href={detailUrl}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
        >
          <span>View College</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export function CollegeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between">
      <div>
        <div className="h-44 w-full bg-slate-200" />
        <div className="p-5 space-y-3">
          <div className="h-5 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3.5 bg-slate-200 rounded-md w-1/2" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="h-8 bg-slate-100 rounded-md" />
            <div className="h-8 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-5">
        <div className="h-4 bg-slate-200 rounded-md w-24" />
      </div>
    </div>
  );
}
