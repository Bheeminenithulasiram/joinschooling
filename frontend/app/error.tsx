"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Route-level error boundary. Next.js renders this file whenever a client-side
 * exception is thrown inside any page/layout below the root layout. It shows a
 * friendly recovery UI instead of the raw "Application error" overlay.
 *
 * The `reset` function tells Next.js to attempt to re-render the segment; if it
 * still fails the boundary is re-shown, but the user can also navigate home.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[EduConnect] Route error:", error);
  }, [error]);

  const digest = error?.digest;

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-amber-50 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white">
          <AlertTriangle size={22} />
        </div>
        <h1 className="mt-4 font-display text-2xl font-extrabold">
          Something went wrong on this page
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          A client-side error blocked this view from rendering. Try again, and if it keeps happening
          head back to the home page.
        </p>

        {process.env.NODE_ENV !== "production" && error?.message && (
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-white/70 p-3 text-left text-xs text-ink-700">
            {error.message}
          </pre>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-primary">
            <RefreshCw size={16} /> Try again
          </button>
          <Link href="/" className="btn-outline">
            <Home size={16} /> Home
          </Link>
        </div>

        {digest && (
          <p className="mt-4 text-[11px] text-ink-400">Reference: <code>{digest}</code></p>
        )}
      </div>
    </div>
  );
}
