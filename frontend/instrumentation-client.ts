// Next.js Instrumentation Client (Next 15.x+)
// Runs before any page code in the browser. Registers global error/rejection
// handlers so unhandled exceptions don't blank the app with the raw
// "Application error: a client-side exception has occurred" overlay.
//
// The route-level `error.tsx` files still catch React render errors. This
// module covers what those miss: unhandled promise rejections (e.g. from
// server-action redirects), async event-handler throws, and third-party
// script failures.

if (typeof window !== "undefined") {
  // Known Next.js signals that must NOT be swallowed.
  const isRedirectError = (e: unknown) =>
    !!e && typeof e === "object" &&
    ("digest" in (e as Record<string, unknown>)) &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    ((e as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
     (e as { digest: string }).digest.startsWith("NEXT_NOT_FOUND"));

  window.addEventListener("error", (event) => {
    if (isRedirectError(event.error)) return;
    // eslint-disable-next-line no-console
    console.warn("[EduConnect] window.onerror caught:", event.error ?? event.message);
    // Allow default Next dev overlay in dev, silently absorb in prod.
    if (process.env.NODE_ENV === "production") event.preventDefault();
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isRedirectError(event.reason)) return;
    // eslint-disable-next-line no-console
    console.warn("[EduConnect] unhandledrejection:", event.reason);
    if (process.env.NODE_ENV === "production") event.preventDefault();
  });
}

export function onRouterTransitionStart() {
  // Reserved for future use (analytics on soft navigations).
}
