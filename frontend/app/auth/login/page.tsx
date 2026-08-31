import Link from "next/link";
import { Sparkles, Star, TrendingUp, ShieldCheck } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="container-page grid min-h-[85vh] items-center gap-10 py-10 lg:grid-cols-12">
      {/* Left Panel: SaaS Showcase */}
      <div className="relative hidden h-full min-h-[500px] overflow-hidden rounded-3xl bg-slate-950 p-12 text-white shadow-2xl lg:col-span-6 lg:flex lg:flex-col lg:justify-between border border-slate-800">
        
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
            <Sparkles size={12} /> Live College Match Engine v2.4
          </div>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight">
            Your Gateway to <br />
            <span className="bg-gradient-to-r from-brand-400 via-fuchsia-400 to-accent-400 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-slate-400 leading-relaxed">
            Connect with leading engineering universities, secure top-tier placements, and navigate your engineering career.
          </p>
        </div>

        {/* Floating Interactive Card Preview */}
        <div className="relative z-10 my-8 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-md shadow-glow hover:border-slate-700/80 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-full bg-emerald-950 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                98% Match Score
              </span>
              <h3 className="mt-2 font-display text-lg font-bold text-white">IIT Bombay (IITB)</h3>
              <p className="text-xs text-slate-400">Mumbai, Maharashtra · Gov</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
              <Star size={12} fill="currentColor" /> 4.9
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800/60 pt-4 text-xs">
            <div>
              <span className="text-slate-500 block">Avg CTC Package</span>
              <span className="font-display font-bold text-white flex items-center gap-1 mt-0.5">
                <TrendingUp size={12} className="text-emerald-400" /> ₹21.8 LPA
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">NIRF Rank</span>
              <span className="font-display font-bold text-white block mt-0.5">
                #3 Rank in India
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900 pt-6">
          <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500" /> AES-256 Encrypted Session</span>
          <span>© 2026 EduConnect</span>
        </div>
      </div>

      {/* Right Panel: Sleek SaaS Form */}
      <div className="mx-auto w-full max-w-md lg:col-span-6">
        <div className="card p-8 sm:p-10 border border-slate-200 bg-white shadow-xl rounded-3xl">
          <h1 className="font-display text-3xl font-extrabold text-ink-900 tracking-tight">Log in</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Welcome back! Please enter your details below.
          </p>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-ink-500">
            New here? <Link href="/auth/register" className="font-semibold text-brand-700 hover:text-brand-800 transition">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
