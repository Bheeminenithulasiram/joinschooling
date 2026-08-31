"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Sparkles } from "lucide-react";

export default function AiFinderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[AI Finder] error:", error);
  }, [error]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white">
          <AlertTriangle size={22} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">AI Finder couldn&apos;t render</h1>
        <p className="mt-2 text-sm text-ink-500">
          The recommendation view failed to load. This is usually because the backend is warming up
          or a preferred-companies value went out of sync. Try again in a moment.
        </p>

        {process.env.NODE_ENV !== "production" && error?.message && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-slate-50 p-3 text-left text-xs text-ink-700">
            {error.message}
          </pre>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            <RefreshCw size={16} /> Try again
          </button>
          <Link href="/colleges" className="btn-outline">
            <Sparkles size={16} /> Browse colleges instead
          </Link>
        </div>
      </div>
    </div>
  );
}
