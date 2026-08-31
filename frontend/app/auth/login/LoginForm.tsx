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
            googleBtnRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: "outline",
              size: "large",
              type: "standard",
              shape: "rectangular",
              text: "continue_with",
              logo_alignment: "left",
              width: 360,
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

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Single Official Google Button */}
      <div className="flex flex-col gap-1.5 items-center justify-center min-h-[44px]">
        {isGoogleLoading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-2.5">
            <Loader2 size={18} className="animate-spin text-brand-600" />
            <span>Logging in with Google…</span>
          </div>
        ) : (
          <div ref={googleBtnRef} className="w-full flex justify-center overflow-hidden rounded-xl shadow-xs" />
        )}
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
