"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Lock, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { loginAction } from "@/lib/actions/auth";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98] font-semibold text-sm shadow-md"
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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  return (
    <form action={action} className="mt-6 grid gap-5">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={16}
            className={`pointer-events-none absolute left-3.5 top-3.5 transition-colors duration-200 ${
              emailFocused ? "text-brand-500" : "text-slate-400"
            }`}
          />
          <input
            name="email"
            required
            type="email"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            className="input w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10.5 pr-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            placeholder="name@company.com"
            defaultValue="student@educonnect.dev"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Password
          </label>
          <Link href="#" className="text-xs font-semibold text-brand-700 hover:text-brand-800 transition">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock
            size={16}
            className={`pointer-events-none absolute left-3.5 top-3.5 transition-colors duration-200 ${
              passFocused ? "text-brand-500" : "text-slate-400"
            }`}
          />
          <input
            name="password"
            required
            type="password"
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            className="input w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10.5 pr-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            placeholder="••••••••"
            defaultValue="student1234"
          />
        </div>
      </div>

      {state && state.ok === false && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 animate-fadeIn">
          <AlertTriangle size={16} className="text-rose-500 shrink-0" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      <div className="flex items-center text-sm text-ink-700">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            defaultChecked
            className="h-4.5 w-4.5 rounded border-slate-200 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          Remember my session
        </label>
      </div>

      <SubmitBtn />
    </form>
  );
}
