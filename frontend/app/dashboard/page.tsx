import Link from "next/link";
import { ArrowRight, Sparkles, Briefcase, GraduationCap, Bookmark, TrendingUp, Bell, Rocket, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { DashboardSnapshot, UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

const BANNERS = [
  "linear-gradient(135deg,#7c3aed,#0ea5e9)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#22c55e,#0ea5e9)",
  "linear-gradient(135deg,#6366f1,#ec4899)",
];

// Demo fallback so /dashboard is always visible even without a live backend.
const DEMO_USER: UserOut = {
  id: "demo", email: "demo@educonnect.dev", role: "student", is_email_verified: true,
  profile: {
    first_name: "Demo", last_name: "Student", cgpa: 8.6,
    preferred_course: "Computer Science Engineering",
    skills: [], preferred_companies: [],
  },
};
const DEMO_DASH: DashboardSnapshot = {
  stats: { applications: 3, saved_colleges: 12, saved_internships: 5, unread_notifs: 2 },
  recent_applications: [
    { id: "1", target_kind: "internship", target_id: "amazon", status: "under_review", submitted_at: new Date().toISOString() },
    { id: "2", target_kind: "internship", target_id: "microsoft", status: "submitted", submitted_at: new Date(Date.now() - 86400000).toISOString() },
  ],
  recommended_colleges: [
    { id: "1", slug: "iit-bombay", name: "IIT Bombay", short_name: "IITB", city: "Mumbai", state: "Maharashtra", type: "government", nirf_rank: 3, avg_package_lpa: 21.8, placement_percent: 98, rating: 4.9, reviews_count: 5420 },
    { id: "2", slug: "iiit-hyderabad", name: "IIIT Hyderabad", short_name: "IIIT-H", city: "Hyderabad", state: "Telangana", type: "deemed", nirf_rank: 47, avg_package_lpa: 26.4, placement_percent: 99, rating: 4.8, reviews_count: 3100 },
    { id: "3", slug: "vnr-vjiet", name: "VNR VJIET", short_name: "VNR", city: "Hyderabad", state: "Telangana", type: "autonomous", nirf_rank: 154, avg_package_lpa: 7.2, placement_percent: 92, rating: 4.4, reviews_count: 1210 },
    { id: "4", slug: "kl-university", name: "KL University", short_name: "KLU", city: "Vijayawada", state: "Andhra Pradesh", type: "deemed", nirf_rank: 45, avg_package_lpa: 8.1, placement_percent: 94, rating: 4.5, reviews_count: 1440 },
  ],
  upcoming_deadlines: [],
};

export default async function DashboardPage() {
  let user: UserOut = DEMO_USER;
  let dash: DashboardSnapshot = DEMO_DASH;
  let isDemo = true;
  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<DashboardSnapshot>("/api/v1/me/dashboard"),
    ]);
    user = u; dash = d; isDemo = false;
  } catch { /* keep demo */ }

  const displayName = user?.profile?.first_name ?? user?.email.split("@")[0] ?? "there";

  return (
    <div className="container-page py-10">
      {isDemo && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-rose-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white"><Sparkles size={16} /></div>
            <div>
              <div className="text-sm font-bold">You&apos;re viewing demo data</div>
              <div className="text-xs text-ink-500">Log in to see your real applications, saved items and AI matches.</div>
            </div>
          </div>
          <Link href="/auth/login" className="btn-primary"><LogIn size={14} /> Log in</Link>
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="chip-brand"><Sparkles size={12} /> Welcome back, {displayName}</div>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Your dashboard</h1>
          <p className="text-sm text-ink-500">Pick up where you left off.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline"><Bell size={16} /> Notifications</button>
          <Link href="/ai-finder" className="btn-primary"><Sparkles size={16} /> New AI Run</Link>
          {!isDemo && <form action={logoutAction}><button className="btn-ghost">Log out</button></form>}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: GraduationCap, l: "Saved Colleges", v: dash.stats.saved_colleges, tint: "from-brand-500 to-brand-700" },
          { icon: Briefcase, l: "Applications", v: dash.stats.applications, tint: "from-sky-500 to-blue-700" },
          { icon: Bookmark, l: "Saved Internships", v: dash.stats.saved_internships, tint: "from-emerald-500 to-teal-600" },
          { icon: TrendingUp, l: "Unread Notifs", v: dash.stats.unread_notifs, tint: "from-rose-500 to-red-600" },
        ].map((s) => (
          <div key={s.l} className="card p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}><s.icon size={20} /></div>
            <div className="mt-4 font-display text-3xl font-extrabold">{s.v}</div>
            <div className="text-sm text-ink-500">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Badge variant="brand"><Sparkles size={12} /> Recommended for you</Badge>
                <h2 className="mt-1 font-display text-xl font-bold">Colleges matching your profile</h2>
              </div>
              <Link href="/colleges" className="text-sm font-semibold text-brand-700">See all</Link>
            </div>
            {dash.recommended_colleges.length === 0 ? (
              <p className="text-sm text-ink-500">Complete your profile to get personalized matches.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {dash.recommended_colleges.map((c, i) => (
                  <Link key={c.id} href={`/colleges/${c.slug}`} className="rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:shadow-glow">
                    <div className="h-16 rounded-lg" style={{ background: BANNERS[i % BANNERS.length] }} />
                    <div className="mt-3 font-semibold">{c.short_name ?? c.name}</div>
                    <div className="text-xs text-ink-500">{c.city} {c.nirf_rank ? `· NIRF #${c.nirf_rank}` : ""}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="blue">Recent applications</Badge>
              <Link href="/internships" className="text-sm font-semibold text-brand-700">Find more</Link>
            </div>
            {dash.recent_applications.length === 0 ? (
              <p className="text-sm text-ink-500">You haven&apos;t applied anywhere yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {dash.recent_applications.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-semibold capitalize">{a.target_kind}</div>
                      <div className="text-xs text-ink-500">{new Date(a.submitted_at).toDateString()}</div>
                    </div>
                    <Badge variant="brand">{a.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-display text-lg font-bold">Your profile</h3>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Email</dt><dd className="font-semibold">{user.email}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Role</dt><dd className="font-semibold capitalize">{user.role}</dd></div>
              {user.profile?.cgpa != null && <div className="flex justify-between"><dt className="text-ink-500">CGPA</dt><dd className="font-semibold">{user.profile.cgpa}</dd></div>}
              {user.profile?.preferred_course && <div className="flex justify-between"><dt className="text-ink-500">Course</dt><dd className="font-semibold">{user.profile.preferred_course}</dd></div>}
            </dl>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-accent-500 p-6 text-white">
            <div className="flex items-center gap-2"><Rocket size={16} /> <span className="text-xs font-semibold uppercase tracking-wider">Boost profile</span></div>
            <div className="mt-3 font-display text-lg font-bold">Complete your profile to unlock better matches</div>
            <Link href="/ai-finder" className="btn mt-4 bg-white text-brand-700">Run AI Finder <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
