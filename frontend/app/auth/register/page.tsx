import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div className="container-page grid min-h-[85vh] items-center gap-10 py-10 lg:grid-cols-12">
      {/* Left Panel: SaaS Showcase */}
      <div className="relative hidden h-full min-h-[500px] overflow-hidden rounded-3xl bg-slate-950 p-12 text-white shadow-2xl lg:col-span-6 lg:flex lg:flex-col lg:justify-between border border-slate-800 order-1 lg:order-2">
        
        {/* Glow Effects */}
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand-500/10 blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent-500/10 blur-[100px]" />
        
        {/* SVG Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3.5 py-1.5 text-xs font-medium text-brand-400">
            <Sparkles size={12} /> Student & Partner Platform v2.0
          </div>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight">
            Start Your <br />
            <span className="bg-gradient-to-r from-brand-400 via-fuchsia-400 to-accent-400 bg-clip-text text-transparent">
              Growth Journey
            </span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-slate-400 leading-relaxed">
            Join thousands of students, university representatives, and hiring recruiters discovering admissions and placements.
          </p>
        </div>

        {/* Floating Showcase Card */}
        <div className="relative z-10 my-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md shadow-glow hover:border-slate-700/80 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shrink-0">
              AI
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Match Engine is ready</h3>
              <p className="text-xs text-slate-400">Personalized recommendations tailored to your goals.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-6">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted Session</span>
          <span>© 2026 EduConnect</span>
        </div>
      </div>

      {/* Right Panel: Form Card */}
      <div className="mx-auto w-full max-w-md lg:col-span-6 order-2 lg:order-1">
        <div className="card p-8 sm:p-10 border border-slate-200 bg-white shadow-xl rounded-3xl">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 tracking-tight">Create account</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Free forever. Choose your role below to get started.
          </p>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-ink-500">
            Already have an account? <Link href="/auth/login" className="font-semibold text-brand-700 hover:text-brand-800 transition">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
