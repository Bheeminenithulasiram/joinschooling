"use client";
import { useState, useEffect, useTransition } from "react";
import { saveItemAction } from "@/lib/actions/apply";
import { Bookmark, Check } from "lucide-react";
import { AuthGateModal } from "@/components/auth/AuthGateModal";
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
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pending, start] = useTransition();
  const { success, info } = useToast();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) setCurrentUser(data.user);
      })
      .catch(() => setCurrentUser(null));
  }, []);

  const handleSave = () => {
    if (!currentUser) {
      setAuthGateOpen(true);
      return;
    }

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
    <>
      <AuthGateModal
        isOpen={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
        actionType="save"
        targetName={kind}
      />
      <button
        onClick={handleSave}
        disabled={pending}
        className={`btn-outline text-xs px-3.5 py-2 rounded-xl transition ${
          saved ? "bg-blue-50 text-blue-700 border-blue-300 font-bold" : "text-slate-600 hover:text-slate-900"
        }`}
        title={saved ? "Saved" : "Save bookmark"}
      >
        {saved ? <Check size={14} className="text-blue-600" /> : <Bookmark size={14} />}
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
    </>
  );
}
