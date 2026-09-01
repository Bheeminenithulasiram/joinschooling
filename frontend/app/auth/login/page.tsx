import Link from "next/link";
import LoginForm from "./LoginForm";
import AuthShowcase from "@/components/auth/AuthShowcase";

export default function LoginPage() {
  return (
    <div className="container-page grid min-h-[85vh] items-center gap-10 py-10 lg:grid-cols-12">
      {/* Left Panel on Desktop: Pure Image Slideshow */}
      <div className="hidden lg:col-span-6 lg:flex items-center justify-center">
        <AuthShowcase />
      </div>

      {/* Right Panel on Desktop: Login Form */}
      <div className="mx-auto w-full max-w-md lg:col-span-6">
        <div className="card p-7 sm:p-9 border border-slate-200 bg-white shadow-xl rounded-3xl">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 tracking-tight">Log in</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Welcome back! Please enter your details below.
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-ink-500">
            New here?{" "}
            <Link href="/auth/register" className="font-semibold text-brand-700 hover:text-brand-800 transition">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
