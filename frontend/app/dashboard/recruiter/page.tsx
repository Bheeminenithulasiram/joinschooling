import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { RecruiterDashboardClient } from "@/components/dashboard/RecruiterDashboardClient";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboardPage() {
  let user: UserOut | null = null;
  let data: any = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<any>("/api/v1/me/recruiter-dashboard"),
    ]);
    user = u;
    data = d;
  } catch {}

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/recruiter");
  }

  if (user.role === "student") {
    redirect("/dashboard");
  } else if (user.role === "college_rep") {
    redirect("/dashboard/college");
  }

  return <RecruiterDashboardClient data={data} />;
}
