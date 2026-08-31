import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { apiPublic } from "@/lib/api";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let isSuccess = false;
  let errorMessage = "";

  if (token) {
    try {
      await apiPublic("/api/v1/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      isSuccess = true;
    } catch (e: any) {
      isSuccess = false;
      errorMessage = e?.problem?.detail || "Invalid or expired verification link.";
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="card w-full max-w-md p-8 text-center space-y-6 shadow-xl border-slate-200">
        {isSuccess ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-ink-900">Email Verified!</h1>
              <p className="text-sm text-slate-500">
                Your email address has been successfully verified. You now have full access to your account.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl shadow-md font-semibold text-sm"
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/50">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-ink-900">Verification Pending</h1>
              <p className="text-sm text-slate-500">
                {errorMessage ||
                  "Please check your inbox for the verification link sent during registration."}
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="btn-primary w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl shadow-md font-semibold text-sm"
              >
                Return to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
