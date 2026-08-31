"use client";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertTriangle,
  Loader2,
  GraduationCap,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  Award,
} from "lucide-react";
import { registerAction, googleLoginAction } from "@/lib/actions/auth";

type RoleType = "student" | "college_rep" | "recruiter";

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
  const [selectedRole, setSelectedRole] = useState<RoleType>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                await googleLoginAction(response.credential, selectedRole);
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
  }, [selectedRole]);

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Role Selection Switcher */}
      <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          I am registering as
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setSelectedRole("student")}
            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
              selectedRole === "student"
                ? "border-brand-500 bg-brand-50/90 text-brand-700 shadow-xs ring-2 ring-brand-200"
                : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80"
            }`}
          >
            <GraduationCap size={17} className={selectedRole === "student" ? "text-brand-600" : "text-slate-400"} />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("college_rep")}
            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
              selectedRole === "college_rep"
                ? "border-brand-500 bg-brand-50/90 text-brand-700 shadow-xs ring-2 ring-brand-200"
                : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80"
            }`}
          >
            <Building2 size={17} className={selectedRole === "college_rep" ? "text-brand-600" : "text-slate-400"} />
            <span>College Rep</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("recruiter")}
            className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
              selectedRole === "recruiter"
                ? "border-brand-500 bg-brand-50/90 text-brand-700 shadow-xs ring-2 ring-brand-200"
                : "border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100/80"
            }`}
          >
            <Briefcase size={17} className={selectedRole === "recruiter" ? "text-brand-600" : "text-slate-400"} />
            <span>Recruiter</span>
          </button>
        </div>
      </div>

      {/* Single Official Google Button */}
      <div className="flex flex-col gap-1.5 items-center justify-center min-h-[44px]">
        {isGoogleLoading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 py-2.5">
            <Loader2 size={18} className="animate-spin text-brand-600" />
            <span>Signing in with Google…</span>
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
          or register with email
        </span>
      </div>

      {/* Registration Form with Explicit Field Spacing */}
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="role" value={selectedRole} />

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-semibold text-slate-600">
              First Name
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
                <User size={15} />
              </div>
              <input
                name="first_name"
                required
                className="input input-icon-pad w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Aditya"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="block text-xs font-semibold text-slate-600">
              Last Name
            </label>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
                <User size={15} />
              </div>
              <input
                name="last_name"
                required
                className="input input-icon-pad w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Sharma"
              />
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            {selectedRole === "college_rep"
              ? "Official College Email"
              : selectedRole === "recruiter"
              ? "Work Email Address"
              : "Email Address"}
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
              placeholder={
                selectedRole === "college_rep"
                  ? "dean@university.edu.in"
                  : selectedRole === "recruiter"
                  ? "recruiter@company.com"
                  : "student@example.com"
              }
            />
          </div>
        </div>

        {/* Role Specific Fields */}
        {selectedRole === "student" && (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Target Degree
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
                  <Award size={15} />
                </div>
                <input
                  name="preferred_course"
                  className="input input-icon-pad w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  placeholder="B.Tech CSE"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Graduation Year
              </label>
              <input
                name="graduation_year"
                type="number"
                min={2020}
                max={2032}
                className="input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="2027"
              />
            </div>
          </div>
        )}

        {selectedRole === "college_rep" && (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                College Name
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
                  <Building2 size={15} />
                </div>
                <input
                  name="college_name"
                  required
                  className="input input-icon-pad w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  placeholder="IIT Bombay"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Designation
              </label>
              <input
                name="designation"
                required
                className="input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Dean of Admissions"
              />
            </div>
          </div>
        )}

        {selectedRole === "recruiter" && (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Company Name
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
                  <Briefcase size={15} />
                </div>
                <input
                  name="company_name"
                  required
                  className="input input-icon-pad w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  placeholder="Amazon"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Designation
              </label>
              <input
                name="designation"
                required
                className="input w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                placeholder="Technical Recruiter"
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            Password
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
              <Lock size={15} />
            </div>
            <input
              name="password"
              required
              minLength={8}
              type={showPassword ? "text" : "password"}
              className="input input-icon-pad input-icon-right w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="At least 8 characters"
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

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-slate-400">
              <Lock size={15} />
            </div>
            <input
              name="confirm_password"
              required
              minLength={8}
              type={showConfirmPassword ? "text" : "password"}
              className="input input-icon-pad input-icon-right w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {state && state.ok === false && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 animate-fadeIn">
            <AlertTriangle size={15} className="text-rose-500 shrink-0" />
            <span className="font-medium">{state.error}</span>
          </div>
        )}

        <label className="flex items-start gap-2 text-xs text-slate-500 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            required
            defaultChecked
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
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

        <div className="pt-2">
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
}
