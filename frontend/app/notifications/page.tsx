import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationsClient } from "@/components/notifications/NotificationsClient";
import { api } from "@/lib/api";

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
  {
    id: "n1",
    kind: "application",
    title: "Amazon SDE Intern moved to Under Review",
    body: "Recruiter screened your profile and initiated Online Assessment round.",
    href: "/applications",
    read: false,
    created_at: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
  {
    id: "n2",
    kind: "college",
    title: "VNR VJIET Hyderabad Admissions Query Answered",
    body: "Dean's office confirmed counseling cutoff rank for B.Tech AI & Data Science.",
    href: "/colleges/vnr-vjiet",
    read: false,
    created_at: new Date(Date.now() - 12 * 3600_000).toISOString(),
  },
  {
    id: "n3",
    kind: "ai",
    title: "New 95% AI Match Found: Microsoft SWE Intern",
    body: "Your profile matches 95% of required skills for Summer 2026 drive.",
    href: "/internships/microsoft-swe-intern",
    read: false,
    created_at: new Date(Date.now() - 22 * 3600_000).toISOString(),
  },
  {
    id: "n4",
    kind: "college",
    title: "IIT Bombay M.Tech Cutoff Trends Released",
    body: "GATE 2026 cutoff benchmarks published for CSE and Data Science.",
    href: "/colleges/iit-bombay",
    read: true,
    created_at: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
  {
    id: "n5",
    kind: "internship",
    title: "Google Software Engineering Intern 2026 Drive Live",
    body: "Applications open for 2026/2027 graduates. 1-Click apply available.",
    href: "/internships/google-swe-intern",
    read: true,
    created_at: new Date(Date.now() - 3 * 86400_000).toISOString(),
  },
];

export default async function NotificationsPage() {
  let items: Notification[] = DEMO;

  try {
    const res = await api<Notification[]>("/api/v1/me/notifications");
    if (res && res.length > 0) items = res;
  } catch {}

  return (
    <>
      <PageHeader
        eyebrow="Real-Time Alerts"
        title="Notifications & Updates"
        subtitle="Keep track of your application milestones, admissions counseling updates, and AI-Finder alerts."
      />
      <div className="container-page py-10">
        <NotificationsClient initialNotifications={items} />
      </div>
    </>
  );
}
