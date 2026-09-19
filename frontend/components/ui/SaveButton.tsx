"use client";
import { useState, useTransition } from "react";
import { saveItemAction } from "@/lib/actions/apply";
import { Bookmark, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function SaveButton({
  kind,
  targetId,
  initiallySaved = false,
}: {
  kind: string;
  targetId: string;
  initiallySaved?: boolean;
}) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();
  const { success, info } = useToast();

  const handleSave = () => {
    start(async () => {
      const nextState = !saved;
      setSaved(nextState);
      await saveItemAction(kind, targetId);
      if (nextState) {
        success(`Added to your saved ${kind}s!`);
      } else {
        info(`Removed from your saved ${kind}s.`);
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={pending}
      className={`btn-outline text-xs px-3.5 py-2 rounded-xl transition ${
        saved ? "bg-brand-50 text-brand-700 border-brand-300 font-bold" : "text-slate-600 hover:text-slate-900"
      }`}
      title={saved ? "Saved" : "Save bookmark"}
    >
      {saved ? <Check size={14} className="text-brand-600" /> : <Bookmark size={14} />}
      <span>{saved ? "Saved" : "Save"}</span>
    </button>
  );
}
