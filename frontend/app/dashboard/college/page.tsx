import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { CollegeDashboardClient } from "@/components/dashboard/CollegeDashboardClient";

export const dynamic = "force-dynamic";

export default async function CollegeDashboardPage() {
  let user: UserOut | null = null;
  let data: any = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<any>("/api/v1/me/college-dashboard"),
    ]);
    user = u;
    data = d;
  } catch {}

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/college");
  }

  if (user.role === "student") {
    redirect("/dashboard");
  } else if (user.role === "recruiter") {
    redirect("/dashboard/recruiter");
  }

  return <CollegeDashboardClient data={data} />;
}
