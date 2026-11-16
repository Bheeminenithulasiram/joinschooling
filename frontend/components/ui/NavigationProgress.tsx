"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  };

  // Complete progress on route change
  useEffect(() => {
    if (navigating) {
      clearTimers();
      setProgress(100);
      const doneTimer = setTimeout(() => {
        setNavigating(false);
        setProgress(0);
      }, 250);
      timerRef.current.push(doneTimer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal navigation links
  useEffect(() => {
    const startProgress = () => {
      clearTimers();
      setNavigating(true);
      setProgress(15);

      const t1 = setTimeout(() => setProgress(45), 120);
      const t2 = setTimeout(() => setProgress(70), 400);
      const t3 = setTimeout(() => setProgress(88), 1200);
      // Failsafe auto-reset if navigation stalls
      const tFail = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setNavigating(false);
          setProgress(0);
        }, 200);
      }, 8000);

      timerRef.current.push(t1, t2, t3, tFail);
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external, hash, protocols, and modifier keys
      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check if target is same page URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      startProgress();
    };

    const handleCustomStart = () => startProgress();

    document.addEventListener("click", handleAnchorClick, { capture: true });
    window.addEventListener("app:navigate-start", handleCustomStart);

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      window.removeEventListener("app:navigate-start", handleCustomStart);
      clearTimers();
    };
  }, []);

  if (!navigating && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.7)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionDuration: progress === 100 ? "200ms" : "300ms",
          transitionProperty: "width, opacity",
        }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarInner />
    </Suspense>
  );
}
