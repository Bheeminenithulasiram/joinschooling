import { cn } from "@/lib/utils";

type Variant =
  | "brand"
  | "primary"
  | "accent"
  | "green"
  | "success"
  | "blue"
  | "amber"
  | "warning"
  | "rose"
  | "error"
  | "slate"
  | "neutral"
  | "purple";

const map: Record<Variant, string> = {
  brand: "bg-blue-50 text-blue-700 border border-blue-200/80",
  primary: "bg-blue-50 text-blue-700 border border-blue-200/80",
  accent: "bg-[#101A32] text-white",
  green: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
  blue: "bg-sky-50 text-sky-700 border border-sky-200/80",
  amber: "bg-amber-50 text-amber-800 border border-amber-200/80",
  warning: "bg-amber-50 text-amber-800 border border-amber-200/80",
  rose: "bg-rose-50 text-rose-700 border border-rose-200/80",
  error: "bg-rose-50 text-rose-700 border border-rose-200/80",
  slate: "bg-slate-100 text-slate-700 border border-slate-200/80",
  neutral: "bg-slate-100 text-slate-700 border border-slate-200/80",
  purple: "bg-purple-50 text-purple-700 border border-purple-200/80",
};

export function Badge({
  children,
  variant = "brand",
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-tight",
        map[variant] || map.brand,
        className
      )}
    >
      {children}
    </span>
  );
}
