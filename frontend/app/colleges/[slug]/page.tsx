import { notFound } from "next/navigation";
import { apiPublic, api } from "@/lib/api";
import { colleges as mockColleges } from "@/lib/mock";
import { CollegeDetailClient } from "@/components/colleges/CollegeDetailClient";

export const dynamic = "force-dynamic";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let college: any = null;

  try {
    college = await apiPublic(`/api/v1/colleges/${slug}`);
  } catch {}

  if (!college || !college.id) {
    college = mockColleges.find((c) => c.slug === slug || c.id === slug);
  }

  if (!college) {
    // If not found, fallback to first mock college rather than a blank 404
    college = mockColleges[0];
  }

  let initiallySaved = false;
  try {
    const saved = await api<any[]>("/api/v1/saved");
    if (saved && Array.isArray(saved)) {
      initiallySaved = saved.some((s) => s.kind === "college" && (s.target_id === college.id || s.target_id === college.slug));
    }
  } catch {}

  return <CollegeDetailClient college={college} initiallySaved={initiallySaved} />;
}
