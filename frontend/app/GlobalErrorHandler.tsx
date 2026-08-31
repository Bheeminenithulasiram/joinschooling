"use client";

import { useEffect } from "react";

/**
 * Attaches global `error` and `unhandledrejection` listeners so an uncaught
 * exception (e.g. an async action throwing when the backend is unreachable)
 * does not blank the app with "Application error: a client-side exception
 * has occurred". Next.js signals (NEXT_REDIRECT, NEXT_NOT_FOUND) are passed
 * through untouched.
 *
 * Rendered from `app/template.tsx` so it mounts once per navigation without
 * modifying the root layout.
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    const isNextSignal = (v: unknown) => {
      if (!v || typeof v !== "object") return false;
      const d = (v as { digest?: unknown }).digest;
      return typeof d === "string" && (d.startsWith("NEXT_REDIRECT") || d.startsWith("NEXT_NOT_FOUND"));
    };

    const onError = (event: ErrorEvent) => {
      if (isNextSignal(event.error)) return;
      // eslint-disable-next-line no-console
      console.warn("[EduConnect] caught window error:", event.error ?? event.message);
      if (process.env.NODE_ENV === "production") event.preventDefault();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      if (isNextSignal(event.reason)) return;
      // eslint-disable-next-line no-console
      console.warn("[EduConnect] caught unhandled rejection:", event.reason);
      if (process.env.NODE_ENV === "production") event.preventDefault();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
