"use client";

import { useEffect, useState } from "react";

type Mode = "date" | "datetime" | "relative";

/**
 * Hydration-safe timestamp. Renders a stable placeholder on the server (which
 * matches SSR output byte-for-byte) then upgrades to a locale-formatted value
 * on the client after mount. Prevents React 19 hydration mismatches that
 * surface as "Application error: a client-side exception has occurred".
 */
export function Timestamp({
  iso,
  mode = "date",
  className,
}: {
  iso: string;
  mode?: Mode;
  className?: string;
}) {
  const [rendered, setRendered] = useState<string>(() => stable(iso, mode));

  useEffect(() => {
    setRendered(local(iso, mode));
  }, [iso, mode]);

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning>
      {rendered}
    </time>
  );
}

// Deterministic UTC value used during SSR and the first client render. Once
// hydration is complete the effect swaps in the browser-locale value.
function stable(iso: string, mode: Mode): string {
  const d = safeDate(iso);
  if (!d) return "";
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  if (mode === "date") return `${y}-${pad(m)}-${pad(day)}`;
  if (mode === "datetime")
    return `${y}-${pad(m)}-${pad(day)} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
  return `${y}-${pad(m)}-${pad(day)}`;
}

function local(iso: string, mode: Mode): string {
  const d = safeDate(iso);
  if (!d) return "";
  if (mode === "date") return d.toLocaleDateString();
  if (mode === "datetime") return d.toLocaleString();
  return relative(d);
}

function safeDate(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isFinite(d.getTime()) ? d : null;
}

function relative(d: Date): string {
  const now = Date.now();
  const diff = Math.round((d.getTime() - now) / 1000);
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (abs < 60) return rtf.format(diff, "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 30 * 86400) return rtf.format(Math.round(diff / 86400), "day");
  return d.toLocaleDateString();
}
