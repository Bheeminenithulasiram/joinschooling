"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
} from "lucide-react";
import { loginAction, googleLoginAction, quickDemoLoginAction } from "@/lib/actions/auth";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "984571154887-n473mh9lnvta8h0d8r0qimuj8pomudlc.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition font-semibold text-xs disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" /> Signing in…
        </>
      ) : (
        <>
          Sign in to Account <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useActionState(loginAction, null as any);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [demoPending, startDemoTransition] = useTransition();
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

  useEffect(() => {
    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "email profile openid",
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              try {
                const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userinfo = await userinfoRes.json();
                const credentialPayload = btoa(JSON.stringify(userinfo));
                await googleLoginAction(credentialPayload, "student");
              } catch (err) {
                setGoogleError("Failed to retrieve Google profile. Please try again.");
                setIsGoogleLoading(false);
              }
            } else {
              setIsGoogleLoading(false);
            }
          },
          error_callback: (err: any) => {
            console.error("Google Auth error:", err);
            setIsGoogleLoading(false);
            setGoogleError("Google Sign-In was closed or cancelled.");
          },
        });
        tokenClient.requestAccessToken();
        return;
      } catch (e) {
        console.error("Error launching Google OAuth:", e);
      }
    }

    const redirectUri = encodeURIComponent(window.location.origin);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=openid%20email%20profile`;
    window.location.href = authUrl;
  };

  const handleDemoLogin = (role: "student" | "college_rep" | "recruiter" | "admin") => {
    setActiveDemoRole(role);
    startDemoTransition(async () => {
      await quickDemoLoginAction(role);
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-5">
      {/* 1-Click Evaluation Profiles */}
      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
        <div className="text-[11px] font-bold text-slate-700 mb-1.5">
          One-Click Test Profiles
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={demoPending}
            onClick={() => handleDemoLogin("student")}
            className="flex items-center gap-2 p-2 rounded-md bg-white border border-slate-200 hover:border-blue-500 text-slate-800 text-xs font-semibold text-left transition"
          >
            <GraduationCap size={14} className="text-blue-600 shrink-0" />
            <div className="truncate">
              <div>Student</div>
              <div className="text-[10px] text-slate-400 font-normal">Kiran Kumar</div>
            </div>
          </button>

          <button
            type="button"
            disabled={demoPending}
            onClick={() => handleDemoLogin("college_rep")}
            className="flex items-center gap-2 p-2 rounded-md bg-white border border-slate-200 hover:border-blue-500 text-slate-800 text-xs font-semibold text-left transition"
          >
            <Building2 size={14} className="text-emerald-600 shrink-0" />
            <div className="truncate">
              <div>College Rep</div>
              <div className="text-[10px] text-slate-400 font-normal">VNR VJIET</div>
            </div>
          </button>

          <button
            type="button"
            disabled={demoPending}
            onClick={() => handleDemoLogin("recruiter")}
            className="flex items-center gap-2 p-2 rounded-md bg-white border border-slate-200 hover:border-blue-500 text-slate-800 text-xs font-semibold text-left transition"
          >
            <Briefcase size={14} className="text-slate-700 shrink-0" />
            <div className="truncate">
              <div>Recruiter</div>
              <div className="text-[10px] text-slate-400 font-normal">Amazon / Tech</div>
            </div>
          </button>

          <button
            type="button"
            disabled={demoPending}
            onClick={() => handleDemoLogin("admin")}
            className="flex items-center gap-2 p-2 rounded-md bg-white border border-slate-200 hover:border-blue-500 text-slate-800 text-xs font-semibold text-left transition"
          >
            <ShieldCheck size={14} className="text-amber-600 shrink-0" />
            <div className="truncate">
              <div>Admin</div>
              <div className="text-[10px] text-slate-400 font-normal">Platform Lead</div>
            </div>
          </button>
        </div>

        {demoPending && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-700">
            <Loader2 size={13} className="animate-spin" /> Signing in as {activeDemoRole}…
          </div>
        )}
      </div>

      {/* Google Sign-In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || demoPending}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white py-2 px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-60"
      >
        {isGoogleLoading ? (
          <Loader2 size={16} className="animate-spin text-blue-600" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-0.5">
        <div className="w-full border-t border-slate-200" />
        <span className="bg-white px-2.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold absolute">
          or sign in with email
        </span>
      </div>

      <form action={action} className="flex flex-col gap-3.5">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail size={14} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              name="email"
              required
              type="email"
              className="input pl-8 text-xs"
              placeholder="name@example.com"
              defaultValue="student@educonnect.dev"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link href="#" className="text-xs text-blue-600 hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock size={14} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              name="password"
              required
              type={showPassword ? "text" : "password"}
              className="input pl-8 pr-8 text-xs"
              placeholder="••••••••"
              defaultValue="student1234"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {state && state.ok === false && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
            <AlertTriangle size={14} className="text-rose-500 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <div className="pt-1">
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
}
