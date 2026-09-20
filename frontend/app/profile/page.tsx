import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { UserOut, DashboardSnapshot } from "@/lib/types";
import { StudentProfileClient } from "@/components/profile/StudentProfileClient";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  let user: UserOut | null = null;
  let dash: DashboardSnapshot | null = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<DashboardSnapshot>("/api/v1/me/dashboard").catch(() => null),
    ]);
    user = u;
    dash = d;
  } catch {}

  if (!user) {
    redirect("/auth/login?redirect=/profile");
  }

  // Role routing guard
  if (user.role === "college_rep") {
    redirect("/dashboard/college");
  } else if (user.role === "recruiter") {
    redirect("/dashboard/recruiter");
  } else if (user.role === "admin") {
    redirect("/admin");
  }

  return <StudentProfileClient user={user} dash={dash} />;
}
