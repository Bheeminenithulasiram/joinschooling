"use client";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Lock, ArrowRight, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react";
import { loginAction, googleLoginAction } from "@/lib/actions/auth";

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
      className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98] font-semibold text-sm shadow-md"
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" /> Logging in…
        </>
      ) : (
        <>
          Log in <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGoogle = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
              if (response?.credential) {
                setIsGoogleLoading(true);
                await googleLoginAction(response.credential, "student");
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "rectangular",
              text: "continue_with",
              logo_alignment: "left",
              width: 380,
            });
          }
        } catch (e) {
          console.error("Error initializing Google Identity:", e);
        }
      }
    };

    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, []);

  const handleCustomGoogleClick = () => {
    setIsGoogleLoading(true);
    setGoogleError(null);

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification: any) => {
        setIsGoogleLoading(false);
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const redirectUri = encodeURIComponent(window.location.origin);
          const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&nonce=${Date.now()}`;
          window.location.href = authUrl;
        }
      });
    } else {
      setIsGoogleLoading(false);
      setGoogleError("Google Sign-In is initializing. Please try again in a moment.");
    }
  };

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Google OAuth Button */}
      <div className="flex flex-col gap-1.5 items-center justify-center">
        {/* Render Official Google Button container */}
        <div ref={googleBtnRef} className="w-full flex justify-center overflow-hidden rounded-xl" />

        {/* Fallback custom button */}
        <button
          type="button"
          onClick={handleCustomGoogleClick}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm font-medium text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition active:scale-[0.99] disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 size={18} className="animate-spin text-brand-600" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>
        {googleError && (
          <p className="text-xs text-amber-600 text-center font-medium mt-1">{googleError}</p>
        )}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="w-full border-t border-slate-200" />
        <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
          or log in with email
        </span>
      </div>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            Email Address
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
              <Mail size={15} />
            </div>
            <input
              name="email"
              required
              type="email"
              className="input input-icon-pad w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="name@example.com"
              defaultValue="student@educonnect.dev"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-600">
              Password
            </label>
            <Link href="#" className="text-xs font-medium text-brand-700 hover:text-brand-800 transition">
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
              <Lock size={15} />
            </div>
            <input
              name="password"
              required
              type={showPassword ? "text" : "password"}
              className="input input-icon-pad input-icon-right w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="••••••••"
              defaultValue="student1234"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {state && state.ok === false && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 animate-fadeIn">
            <AlertTriangle size={15} className="text-rose-500 shrink-0" />
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        <div className="flex items-center text-xs text-slate-600 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            Remember my session
          </label>
        </div>

        <div className="pt-2">
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
}
