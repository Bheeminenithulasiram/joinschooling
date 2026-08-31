import Link from "next/link";
import { Bell, CheckCircle2, ArrowRight, MessageSquare, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Timestamp } from "@/components/ui/Timestamp";
import { api } from "@/lib/api";
import { markAllNotificationsReadAction } from "@/lib/actions/apply";

export const dynamic = "force-dynamic";

type Notification = {
  id: string;
  kind: "application" | "college" | "internship" | "ai" | "system";
  title: string;
  body: string;
  href?: string;
  read: boolean;
  created_at: string;
};

const DEMO: Notification[] = [
  { id: "n1", kind: "application", title: "Amazon SDE Intern moved to Under Review",
    body: "Recruiter opened your application 3 hours ago.", href: "/applications",
    read: false, created_at: new Date(Date.now() - 3*3600_000).toISOString() },
  { id: "n2", kind: "ai", title: "New matches available",
    body: "5 internships match your latest AI Finder run with score > 0.8.", href: "/ai-finder",
    read: false, created_at: new Date(Date.now() - 22*3600_000).toISOString() },
  { id: "n3", kind: "college", title: "IIT Bombay deadline nearing",
    body: "Application closes in 5 days. Complete your form.", href: "/colleges/iit-bombay",
    read: true, created_at: new Date(Date.now() - 2*86400_000).toISOString() },
  { id: "n4", kind: "internship", title: "Microsoft SWE Intern opened",
    body: "Matches your profile — apply before the shortlist fills up.", href: "/internships",
    read: true, created_at: new Date(Date.now() - 3*86400_000).toISOString() },
  { id: "n5", kind: "system", title: "Verify your email",
    body: "Verified accounts get faster application review.", read: true,
    created_at: new Date(Date.now() - 5*86400_000).toISOString() },
];

const ICON = { application: Briefcase, college: GraduationCap, internship: Briefcase, ai: Sparkles, system: MessageSquare };
const TINT: Record<Notification["kind"], "brand" | "amber" | "green" | "blue"> = {
  application: "blue", college: "brand", internship: "green", ai: "amber", system: "brand",
};

export default async function NotificationsPage() {
  let items: Notification[] = DEMO;
  let isDemo = true;
  try {
    items = await api<Notification[]>("/api/v1/me/notifications");
    isDemo = false;
  } catch { /* keep demo */ }

  const unread = items.filter((n) => !n.read);
  const read = items.filter((n) => n.read);

  return (
    <>
      <PageHeader eyebrow="Stay in the loop" title="Notifications" subtitle="Application updates, deadlines, and AI-Finder matches." />
      <div className="container-page py-10">
        {isDemo && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <b>Demo data</b> — log in to see real notifications.
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} />
            <span className="text-sm text-ink-500">{unread.length} unread · {items.length} total</span>
          </div>
          {unread.length > 0 && (
            <form action={async () => {
              "use server";
              await markAllNotificationsReadAction();
            }}>
              <button type="submit" className="btn-outline text-xs"><CheckCircle2 size={14} /> Mark all read</button>
            </form>
          )}
        </div>

        {items.length === 0 ? (
          <div className="card grid place-items-center p-14 text-center">
            <Bell className="text-ink-300" size={40} />
            <div className="mt-3 font-display text-lg font-bold">You're all caught up</div>
            <div className="mt-1 text-sm text-ink-500">We'll notify you when something needs your attention.</div>
          </div>
        ) : (
          <div className="space-y-6">
            {unread.length > 0 && (
              <section>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Unread</div>
                <ul className="card divide-y divide-slate-100">
                  {unread.map((n) => <NotifRow key={n.id} n={n} />)}
                </ul>
              </section>
            )}
            {read.length > 0 && (
              <section>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Earlier</div>
                <ul className="card divide-y divide-slate-100 opacity-80">
                  {read.map((n) => <NotifRow key={n.id} n={n} />)}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function NotifRow({ n }: { n: Notification }) {
  const Icon = ICON[n.kind];
  const body = (
    <>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-ink-700`}>
          <Icon size={16} />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold">{n.title}</div>
            <Badge variant={TINT[n.kind]}>{n.kind}</Badge>
            {!n.read && <span className="h-2 w-2 rounded-full bg-brand-600" aria-label="unread" />}
          </div>
          <div className="mt-1 text-sm text-ink-500">{n.body}</div>
          <Timestamp iso={n.created_at} mode="datetime" className="mt-1 block text-xs text-ink-400" />
        </div>
        {n.href && <ArrowRight size={16} className="mt-3 text-ink-400" />}
      </div>
    </>
  );
  return (
    <li className="p-4">
      {n.href ? <Link href={n.href} className="block transition hover:text-brand-700">{body}</Link> : body}
    </li>
  );
}
