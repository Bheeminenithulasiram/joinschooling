"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, ArrowRight, MessageSquare, Briefcase, GraduationCap, Sparkles, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Timestamp } from "@/components/ui/Timestamp";
import { useToast } from "@/components/ui/Toast";

interface NotificationItem {
  id: string;
  kind: "application" | "college" | "internship" | "ai" | "system";
  title: string;
  body: string;
  href?: string;
  read: boolean;
  created_at: string;
}

const ICON_MAP = {
  application: Briefcase,
  college: GraduationCap,
  internship: Briefcase,
  ai: Sparkles,
  system: MessageSquare,
};

const TINT_MAP: Record<NotificationItem["kind"], "brand" | "amber" | "green" | "blue"> = {
  application: "blue",
  college: "brand",
  internship: "green",
  ai: "amber",
  system: "brand",
};

interface NotificationsClientProps {
  initialNotifications: NotificationItem[];
}

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { addToast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast("All notifications marked as read.", "success");
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const displayedList =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === "unread"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="btn-outline text-xs py-1.5 px-3 flex items-center justify-center gap-1.5 font-bold"
          >
            <CheckCircle2 size={14} className="text-emerald-600" /> Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {displayedList.length === 0 ? (
        <div className="card grid place-items-center p-14 text-center border border-slate-200">
          <Bell className="text-slate-300" size={44} />
          <div className="mt-3 font-display text-lg font-bold text-slate-900">You're all caught up!</div>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            {filter === "unread"
              ? "No unread alerts at this time."
              : "We'll notify you when colleges update your admissions status or recruiters screen your resume."}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-slate-100 border border-slate-200 shadow-xs overflow-hidden">
          {displayedList.map((n) => {
            const Icon = ICON_MAP[n.kind];
            return (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-4 transition flex items-start justify-between gap-4 ${
                  !n.read ? "bg-brand-50/40 hover:bg-brand-50/70" : "bg-white hover:bg-slate-50/80"
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${
                      n.kind === "ai"
                        ? "bg-amber-500"
                        : n.kind === "college"
                        ? "bg-brand-600"
                        : n.kind === "internship"
                        ? "bg-emerald-600"
                        : "bg-indigo-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{n.title}</span>
                      <Badge variant={TINT_MAP[n.kind]}>{n.kind}</Badge>
                      {!n.read && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.body}</p>
                    <Timestamp
                      iso={n.created_at}
                      mode="datetime"
                      className="mt-1.5 block text-[10px] text-slate-400 font-semibold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.href && (
                    <Link
                      href={n.href}
                      className="btn-outline py-1.5 px-2.5 text-xs font-bold flex items-center gap-1"
                    >
                      View <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
