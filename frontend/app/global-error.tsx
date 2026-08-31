"use client";

import { useEffect } from "react";

/**
 * Root-level error boundary — Next.js falls back to this ONLY when the root
 * layout itself throws (which strips the app shell). It must render its own
 * <html>/<body>. See:
 *   https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-global-errors
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[EduConnect] Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background:
            "linear-gradient(135deg, rgba(124,58,237,.08), rgba(14,165,233,.08))",
          color: "#1f2937",
        }}
      >
        <div
          style={{
            maxWidth: 560,
            width: "calc(100% - 32px)",
            padding: 32,
            borderRadius: 16,
            background: "white",
            boxShadow: "0 8px 32px rgba(15,23,42,.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: 56,
              height: 56,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, #f43f5e, #f59e0b)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            !
          </div>
          <h1 style={{ margin: "16px 0 4px", fontSize: 22, fontWeight: 800 }}>
            EduConnect hit an unexpected error
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
            The app couldn&apos;t finish loading. This is usually temporary.
          </p>

          {process.env.NODE_ENV !== "production" && error?.message && (
            <pre
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 12,
                background: "#f8fafc",
                fontSize: 12,
                textAlign: "left",
                maxHeight: 160,
                overflow: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {error.message}
            </pre>
          )}

          <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                textDecoration: "none",
                color: "#1f2937",
                fontWeight: 600,
              }}
            >
              Go home
            </a>
          </div>

          {error?.digest && (
            <p style={{ marginTop: 16, color: "#94a3b8", fontSize: 11 }}>
              Ref: <code>{error.digest}</code>
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
