import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import type { UserOut } from "@/lib/types";
import { MentorDashboardClient } from "@/components/dashboard/MentorDashboardClient";

export const dynamic = "force-dynamic";

export default async function MentorDashboardPage() {
  let user: UserOut | null = null;
  let data: any = null;

  try {
    const [u, d] = await Promise.all([
      api<UserOut>("/api/v1/me"),
      api<any>("/api/v1/me/mentor-dashboard"),
    ]);
    user = u;
    data = d;
  } catch {}

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/mentor");
  }

  if (user.role === "student") {
    redirect("/dashboard");
  } else if (user.role === "college_rep") {
    redirect("/dashboard/college");
  } else if (user.role === "recruiter") {
    redirect("/dashboard/recruiter");
  }

  return <MentorDashboardClient data={data} />;
}
