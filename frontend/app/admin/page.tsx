import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, GraduationCap, Briefcase, Building, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { logoutAction } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let user: UserOut | null = null;
  let data: any = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<any>("/api/v1/me/admin-dashboard"),
    ]);
    user = u;
    data = d;
  } catch {
    redirect("/auth/login?redirect=/admin");
  }

  // Strict Authoritative Role Check: only admin allowed
  if (user.role !== "admin") {
    if (user.role === "student") redirect("/dashboard");
    if (user.role === "college_rep") redirect("/dashboard/college");
    if (user.role === "recruiter") redirect("/dashboard/recruiter");
    redirect("/dashboard");
  }

  return (
    <>
      <div className="bg-slate-900 text-white py-8 border-b border-slate-800">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
              <ShieldCheck size={14} /> Platform Administration
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Admin Control Center</h1>
            <p className="text-sm text-slate-400">Oversee registered institutions, recruiting companies, users, and platform activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <form action={logoutAction}>
              <button className="btn bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-xl px-4 py-2.5 transition">
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container-page py-10 space-y-8">
        {/* Real KPI Metrics from PostgreSQL */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, l: "Registered Users", v: data?.stats?.users ?? 0, tint: "from-brand-500 to-brand-700" },
            { icon: GraduationCap, l: "Colleges", v: data?.stats?.colleges ?? 0, tint: "from-emerald-500 to-teal-600" },
            { icon: Building, l: "Companies", v: data?.stats?.companies ?? 0, tint: "from-amber-500 to-orange-600" },
            { icon: Briefcase, l: "Internships", v: data?.stats?.internships ?? 0, tint: "from-sky-500 to-blue-700" },
          ].map((s) => (
            <div key={s.l} className="card p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}>
                  <s.icon size={20} />
                </div>
                <Badge variant="green">Live DB</Badge>
              </div>
              <div className="mt-4 font-display text-3xl font-extrabold text-ink-900">{s.v}</div>
              <div className="text-sm text-ink-500">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Database Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Colleges Table */}
          <div className="card border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Institutions in Database</h2>
              <Link href="/colleges" className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                <Plus size={12} /> Explore Directory
              </Link>
            </div>
            {!data?.recent_colleges || data.recent_colleges.length === 0 ? (
              <p className="p-5 text-sm text-ink-500">No colleges registered yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="p-3.5 text-left">Name</th>
                    <th className="p-3.5 text-left">Location</th>
                    <th className="p-3.5 text-left">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recent_colleges.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 font-semibold text-ink-900">
                        <Link href={`/colleges/${c.slug}`} className="hover:text-brand-700">
                          {c.short_name ?? c.name}
                        </Link>
                      </td>
                      <td className="p-3.5 text-ink-500">{c.city}, {c.state}</td>
                      <td className="p-3.5">
                        <Badge variant="brand">★ {c.rating || "N/A"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Users Table */}
          <div className="card border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-display text-lg font-bold text-ink-900">Recent User Registrations</h2>
            </div>
            {!data?.recent_users || data.recent_users.length === 0 ? (
              <p className="p-5 text-sm text-ink-500">No users found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-ink-500">
                  <tr>
                    <th className="p-3.5 text-left">Email</th>
                    <th className="p-3.5 text-left">Role</th>
                    <th className="p-3.5 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.recent_users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3.5 font-medium text-ink-900">{u.email}</td>
                      <td className="p-3.5">
                        <Badge variant={u.role === "admin" ? "amber" : u.role === "college_rep" ? "brand" : u.role === "recruiter" ? "blue" : "green"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-xs text-emerald-600 font-semibold inline-flex items-center gap-1">
                        <CheckCircle2 size={12} /> Active
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
