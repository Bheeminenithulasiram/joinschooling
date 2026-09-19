import { apiPublic, api } from "@/lib/api";
import { internships as mockInternships } from "@/lib/mock";
import { InternshipDetailClient } from "@/components/internships/InternshipDetailClient";

export const dynamic = "force-dynamic";

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let internship: any = null;

  try {
    internship = await apiPublic(`/api/v1/internships/${slug}`);
  } catch {}

  if (!internship || !internship.id) {
    internship = mockInternships.find((i) => i.slug === slug || i.id === slug);
  }

  if (!internship) {
    internship = mockInternships[0];
  }

  let initiallySaved = false;
  try {
    const saved = await api<any[]>("/api/v1/saved");
    if (saved && Array.isArray(saved)) {
      initiallySaved = saved.some((s) => s.kind === "internship" && (s.target_id === internship.id || s.target_id === internship.slug));
    }
  } catch {}

  return <InternshipDetailClient internship={internship} initiallySaved={initiallySaved} />;
}
