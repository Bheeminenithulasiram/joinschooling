import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { colleges, internships } from "@/lib/mock";
import { Users, GraduationCap, Briefcase, TrendingUp, MoreHorizontal, Plus } from "lucide-react";

export default function AdminPage() {
  return (
    <>
      <PageHeader eyebrow="Control center" title="Admin Dashboard" subtitle="Manage colleges, internships, applications and users." />
      <div className="container-page py-10">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, l: "Users", v: "42,180", d: "+3.2% WoW", tint: "from-brand-500 to-brand-700" },
            { icon: GraduationCap, l: "Colleges", v: "12,540", d: "+18 new", tint: "from-emerald-500 to-teal-600" },
            { icon: Briefcase, l: "Internships", v: "8,420", d: "1,204 active", tint: "from-sky-500 to-blue-700" },
            { icon: TrendingUp, l: "Applications", v: "1.2M", d: "+8.7% MoM", tint: "from-rose-500 to-red-600" },
          ].map((s) => (
            <div key={s.l} className="card p-5">
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tint} text-white`}><s.icon size={20} /></div>
                <Badge variant="green">{s.d}</Badge>
              </div>
              <div className="mt-4 font-display text-3xl font-extrabold">{s.v}</div>
              <div className="text-sm text-ink-500">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tables */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-display text-lg font-bold">Recent Colleges</h2>
              <button className="btn-primary"><Plus size={14} /> Add College</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-ink-500">
                <tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">City</th><th className="p-3 text-left">NIRF</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {colleges.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="p-3 font-semibold">{c.short_name}</td>
                    <td className="p-3 text-ink-500">{c.city}</td>
                    <td className="p-3"><Badge variant="brand">#{c.nirf_rank}</Badge></td>
                    <td className="p-3 text-right"><button className="p-1 hover:bg-slate-100 rounded"><MoreHorizontal size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <h2 className="font-display text-lg font-bold">Active Internships</h2>
              <button className="btn-primary"><Plus size={14} /> Add Internship</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-ink-500">
                <tr><th className="p-3 text-left">Role</th><th className="p-3 text-left">Company</th><th className="p-3 text-left">Mode</th><th className="p-3"></th></tr>
              </thead>
              <tbody>
                {internships.map((i) => (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="p-3 font-semibold">{i.title}</td>
                    <td className="p-3 text-ink-500">{i.company}</td>
                    <td className="p-3"><Badge variant={i.work_mode === "remote" ? "green" : i.work_mode === "hybrid" ? "amber" : "blue"}>{i.work_mode}</Badge></td>
                    <td className="p-3 text-right"><button className="p-1 hover:bg-slate-100 rounded"><MoreHorizontal size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
