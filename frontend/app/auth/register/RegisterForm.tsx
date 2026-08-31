"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
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

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const mockGoogleCredential = btoa(
        JSON.stringify({
          sub: `google_${Date.now()}`,
          email: `user_${Date.now()}@gmail.com`,
          given_name: "Google",
          family_name: "User",
          email_verified: true,
        })
      );
      await googleLoginAction(mockGoogleCredential, selectedRole);
    } catch (err) {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="mt-5 space-y-5">
      {/* Role Selection Switcher */}
      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
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

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleAuth}
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

      {/* Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="w-full border-t border-slate-200" />
        <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
          or register with email
        </span>
      </div>

      <form action={action} className="space-y-4">
        <input type="hidden" name="role" value={selectedRole} />

        {/* First & Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
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
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
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
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
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
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
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
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
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
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">
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

        <div className="pt-1">
          <SubmitBtn />
        </div>
      </form>
    </div>
  );
}
