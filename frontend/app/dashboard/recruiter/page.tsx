import { api } from "@/lib/api";
import { RecruiterDashboardClient } from "@/components/dashboard/RecruiterDashboardClient";

export const dynamic = "force-dynamic";

export default async function RecruiterDashboardPage() {
  let data: any = null;

  try {
    data = await api("/api/v1/me/recruiter-dashboard");
  } catch {}

  return <RecruiterDashboardClient data={data} />;
}
