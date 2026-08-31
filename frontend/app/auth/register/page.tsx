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
            <Sparkles size={12} /> Student Platform v1.0
          </div>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight">
            Start Your <br />
            <span className="bg-gradient-to-r from-brand-400 via-fuchsia-400 to-accent-400 bg-clip-text text-transparent">
              Growth Journey
            </span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-slate-400 leading-relaxed">
            Join thousands of engineering students discovering placements, applying to internships, comparing colleges, and obtaining mentorship.
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
              <p className="text-xs text-slate-400">Fill in your grades to unlock recommendations.</p>
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
            Free forever. No credit card required.
          </p>

          {/* Social Logins */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="btn-outline flex items-center justify-center gap-2 text-xs font-semibold text-ink-700 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition active:scale-[0.98]">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.98 1 12 1 7.35 1 3.37 3.68 1.38 7.58l3.78 2.93c1.03-3.07 3.92-5.47 6.84-5.47z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.72 2.88c2.18-2 3.7-5.02 3.7-8.7z"/>
                <path fill="#FBBC05" d="M5.16 14.78c-.26-.78-.41-1.61-.41-2.48s.15-1.7.41-2.48L1.38 6.9c-.83 1.67-1.38 3.58-1.38 5.6s.55 3.93 1.38 5.6l3.78-3.32z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.72-2.88c-1.11.75-2.53 1.21-4.24 1.21-3.02 0-5.81-2.4-6.84-5.47L1.38 15.9c1.99 3.9 5.97 6.1 10.62 6.1z"/>
              </svg>
              Google
            </button>
            <button className="btn-outline flex items-center justify-center gap-2 text-xs font-semibold text-ink-700 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition active:scale-[0.98]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-ink-400">
            <div className="h-px flex-1 bg-slate-100" />
            <span>or sign up with email</span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <RegisterForm />

          <p className="mt-8 text-center text-sm text-ink-500">
            Already have an account? <Link href="/auth/login" className="font-semibold text-brand-700 hover:text-brand-800 transition">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
