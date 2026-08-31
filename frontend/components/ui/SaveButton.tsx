"use client";
import { useState, useTransition } from "react";
import { saveItemAction } from "@/lib/actions/apply";
import { Bookmark, Check } from "lucide-react";

export default function SaveButton({ kind, targetId, initiallySaved = false }: { kind: string; targetId: string; initiallySaved?: boolean }) {
  const [saved, setSaved] = useState(initiallySaved);
  const [pending, start] = useTransition();

  const handleSave = () => {
    if (saved) return;
    start(async () => {
      const res = await saveItemAction(kind, targetId);
      if (res.ok) {
        setSaved(true);
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <button
      onClick={handleSave}
      disabled={pending || saved}
      className={`btn-outline ${saved ? "bg-brand-50 text-brand-700 border-brand-200" : ""}`}
    >
      {saved ? <Check size={16} /> : <Bookmark size={16} />}
      {saved ? "Saved" : pending ? "Saving..." : "Save"}
    </button>
  );
}
