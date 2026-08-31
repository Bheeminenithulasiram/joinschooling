"use client";
import { useState, useTransition } from "react";
import { applyInternshipAction } from "@/lib/actions/apply";
import { CheckCircle2, AlertTriangle, Send } from "lucide-react";

export default function ApplyButton({ internshipId }: { internshipId: string }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [cover, setCover] = useState("");
  const [pending, start] = useTransition();

  const submit = () => {
    start(async () => {
      const res = await applyInternshipAction(internshipId, cover);
      setMsg(res.ok ? { ok: true, text: "Application submitted." } : { ok: false, text: res.error });
    });
  };

  return (
    <div className="card p-6">
      <h3 className="font-display text-lg font-bold">Apply</h3>
      <textarea
        value={cover}
        onChange={(e) => setCover(e.target.value)}
        rows={4}
        placeholder="Short cover letter (optional)"
        className="input mt-3"
      />
      <button onClick={submit} disabled={pending} className="btn-primary mt-3 w-full disabled:opacity-60">
        <Send size={16} /> {pending ? "Submitting…" : "Submit application"}
      </button>
      {msg && (
        <div className={`mt-3 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
          msg.ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
        }`}>
          {msg.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} {msg.text}
        </div>
      )}
      <p className="mt-2 text-xs text-ink-500">You must be logged in. If you get an error, sign in first.</p>
    </div>
  );
}
