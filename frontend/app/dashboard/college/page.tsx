import { api } from "@/lib/api";
import { CollegeDashboardClient } from "@/components/dashboard/CollegeDashboardClient";

export const dynamic = "force-dynamic";

export default async function CollegeDashboardPage() {
  let data: any = null;

  try {
    data = await api("/api/v1/me/college-dashboard");
  } catch {}

  return <CollegeDashboardClient data={data} />;
}
