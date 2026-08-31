import type { MetadataRoute } from "next";
import { apiPublic } from "@/lib/api";
import type { PagedColleges, PagedInternships } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://educonnect.example.com";

const STATIC_PATHS = [
  "",
  "/colleges",
  "/internships",
  "/ai-finder",
  "/scholarships",
  "/hackathons",
  "/workshops",
  "/roadmaps",
  "/career",
  "/alumni",
  "/compare",
  "/auth/login",
  "/auth/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${BASE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1.0 : 0.7,
  }));

  let colleges: MetadataRoute.Sitemap = [];
  let internships: MetadataRoute.Sitemap = [];
  try {
    const c = await apiPublic<PagedColleges>("/api/v1/colleges?page_size=1000");
    colleges = c.items.map((x) => ({
      url: `${BASE_URL}/colleges/${x.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch { /* backend unavailable — skip */ }

  try {
    const i = await apiPublic<PagedInternships>("/api/v1/internships?page_size=1000");
    internships = i.items.map((x) => ({
      url: `${BASE_URL}/internships/${x.slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch { /* backend unavailable — skip */ }

  return [...staticEntries, ...colleges, ...internships];
}
