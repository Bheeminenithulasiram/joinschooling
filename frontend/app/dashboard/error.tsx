"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LogIn } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[Dashboard] error:", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-500 text-white">
          <AlertTriangle size={22} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">Dashboard couldn&apos;t load</h1>
        <p className="mt-2 text-sm text-ink-500">
          Your session may have expired or the backend is temporarily unreachable.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            <RefreshCw size={16} /> Retry
          </button>
          <Link href="/auth/login" className="btn-outline">
            <LogIn size={16} /> Log in again
          </Link>
        </div>
      </div>
    </div>
  );
}
