import Link from "next/link";
import RegisterForm from "./RegisterForm";
import AuthShowcase from "@/components/auth/AuthShowcase";

export default function RegisterPage() {
  return (
    <div className="container-page grid min-h-[85vh] items-center gap-10 py-10 lg:grid-cols-12">
      {/* Right Panel on Desktop: Pure Image Slideshow */}
      <div className="hidden lg:col-span-6 lg:flex items-center justify-center order-1 lg:order-2">
        <AuthShowcase />
      </div>

      {/* Left Panel on Desktop: Registration Form */}
      <div className="mx-auto w-full max-w-md lg:col-span-6 order-2 lg:order-1">
        <div className="card p-7 sm:p-9 border border-slate-200 bg-white shadow-xl rounded-3xl">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 tracking-tight">Create account</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Free forever. Choose your role below to get started.
          </p>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-semibold text-brand-700 hover:text-brand-800 transition">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
