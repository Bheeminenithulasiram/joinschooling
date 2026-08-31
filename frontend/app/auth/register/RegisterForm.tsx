"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Lock, User, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";
import { registerAction } from "@/lib/actions/auth";

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
          <Loader2 size={16} className="animate-spin" /> Creating Account…
        </>
      ) : (
        <>
          Create account <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

export default function RegisterForm() {
  const [state, action] = useActionState(registerAction, null as any);
  const [firstFocused, setFirstFocused] = useState(false);
  const [lastFocused, setLastFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  return (
    <form action={action} className="mt-6 grid gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            First Name
          </label>
          <div className="relative">
            <User
              size={16}
              className={`pointer-events-none absolute left-3.5 top-3.5 transition-colors duration-200 ${
                firstFocused ? "text-brand-500" : "text-slate-400"
              }`}
            />
            <input
              name="first_name"
              required
              onFocus={() => setFirstFocused(true)}
              onBlur={() => setFirstFocused(false)}
              className="input w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10.5 pr-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
              placeholder="Aditya"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Last Name
          </label>
          <input
            name="last_name"
            required
            onFocus={() => setLastFocused(true)}
            onBlur={() => setLastFocused(false)}
            className="input w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            placeholder="Sharma"
          />
        </div>
      </div>

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
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Password
        </label>
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
            minLength={8}
            type="password"
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            className="input w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10.5 pr-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-slate-300 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
            placeholder="At least 8 characters"
          />
        </div>
      </div>

      {state && state.ok === false && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 animate-fadeIn">
          <AlertTriangle size={16} className="text-rose-500 shrink-0" />
          <span className="font-medium">{state.error}</span>
        </div>
      )}

      <label className="flex items-start gap-2.5 text-xs text-ink-500 cursor-pointer select-none">
        <input
          type="checkbox"
          defaultChecked
          className="mt-0.5 h-4.5 w-4.5 rounded border-slate-200 text-brand-600 focus:ring-brand-500 cursor-pointer"
        />
        <span>
          I agree to the{" "}
          <Link href="#" className="font-semibold text-brand-700 hover:text-brand-800 underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="font-semibold text-brand-700 hover:text-brand-800 underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <SubmitBtn />
    </form>
  );
}
