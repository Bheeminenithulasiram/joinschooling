"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[Applications] error:", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white">
          <AlertTriangle size={22} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Applications view failed</h1>
        <p className="mt-2 text-sm text-ink-500">
          We couldn&apos;t render your tracker. Try again.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary"><RefreshCw size={16} /> Try again</button>
          <Link href="/" className="btn-outline"><Home size={16} /> Home</Link>
        </div>
      </div>
    </div>
  );
}
