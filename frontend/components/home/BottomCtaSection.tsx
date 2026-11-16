"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Mail } from "lucide-react";

export function BottomCtaSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
    setSubmitted(false);
  };

  return (
    <section className="container-page pt-2 pb-8 sm:pt-3 sm:pb-12">
      
      {/* Section Header with exact format matching website */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-[2px] bg-blue-600 rounded-full" />
          <span className="text-xs font-bold tracking-[0.14em] uppercase text-blue-600">
            Admissions &amp; Career Advisory
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold tracking-tight text-slate-900 leading-tight">
          Consult the <span className="text-blue-600">JoinSchooling Team</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
          Have questions about colleges, cutoffs, or verified internships? Send a message and our team will get back to you.
        </p>
      </div>

      <div
        data-theme="dark"
        className="relative rounded-3xl bg-[#0A0F1D] border border-slate-800/80 overflow-hidden shadow-xl text-white"
      >
        
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-600/15 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/15 rounded-full blur-[90px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 relative z-10">
          
          {/* Left Side: Slant Background Image with Help & Support Content */}
          <div className="relative lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between overflow-hidden min-h-[220px] lg:min-h-[290px]">
            
            {/* Slanted Background Image with Scrim Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 bg-cover bg-center brightness-[0.38] contrast-105 transition-transform duration-700"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80')",
                }}
              />
              {/* Gradient Scrim for crisp text contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D] via-[#0A0F1D]/80 to-[#0A0F1D]/40" />
              
              {/* Slanted Edge Mask on Desktop */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#0A0F1D]/60 [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]" />
              <div className="hidden lg:block absolute top-0 right-[8%] bottom-0 w-[1px] bg-gradient-to-b from-blue-500/40 via-blue-400/10 to-transparent pointer-events-none" />
            </div>

            {/* Left Foreground Content */}
            <div className="relative z-10 space-y-2.5 max-w-sm my-auto">
              <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                Direct Counseling Support
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Our dedicated academic counselors and placement advisors review every query to provide verified guidance.
              </p>

              <div className="pt-1.5">
                <a
                  href="mailto:team@joinschooling.com"
                  className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white transition group"
                >
                  <div className="h-6 w-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition shrink-0">
                    <Mail size={12} />
                  </div>
                  <span className="text-[11px]">
                    Or email:{" "}
                    <span className="text-blue-400 font-bold underline decoration-blue-500/40 group-hover:decoration-white">
                      team@joinschooling.com
                    </span>
                  </span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Side: Compact Form in the Same Container (3 fields) */}
          <div className="relative lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-slate-900/40 lg:border-l lg:border-slate-800/80">
            <div className="mb-3">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-400">
                Fill in your details below and our team will get in touch with you.
              </p>
            </div>

            {submitted ? (
              <div className="py-4 text-center space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={22} />
                </div>

                <h3 className="font-display text-base font-bold text-white">
                  Message Sent to JoinSchooling Team
                </h3>

                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Our team will review your query and reply to <strong className="text-white">{formData.email}</strong> shortly.
                </p>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Inputs Row: Name and Email side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Field 3: How can we help you */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">How can we help you?</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ask a question or describe what you need..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-0.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Message to Team</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
