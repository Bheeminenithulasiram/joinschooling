import { cn } from "@/lib/utils";

type Variant = "brand" | "accent" | "green" | "blue" | "amber" | "slate";
const map: Record<Variant, string> = {
  brand: "bg-brand-100 text-brand-700",
  accent: "bg-rose-100 text-rose-700",
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-800",
  slate: "bg-slate-100 text-slate-700",
};

export function Badge({ children, variant = "brand", className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", map[variant], className)}>{children}</span>;
}
