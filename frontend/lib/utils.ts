import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const inr = (n?: number | null) =>
  n == null ? "—" : new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(n);
