import { HeroSection } from "@/components/home/HeroSection";
import { EcosystemSection } from "@/components/home/EcosystemSection";
import { TopColleges3DStage } from "@/components/home/TopColleges3DStage";
import { InternshipsShowcase } from "@/components/home/InternshipsShowcase";
import { FaqSection } from "@/components/home/FaqSection";
import { BottomCtaSection } from "@/components/home/BottomCtaSection";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Search,
  ArrowRight,
  CheckCircle2,
  Check,
  Star,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Users,
  Flame,
  Trophy,
  Rocket,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";
import type { UserOut, PagedColleges, PagedInternships } from "@/lib/types";
import { colleges as fallbackColleges, internships as fallbackInternships } from "@/lib/mock";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let user: UserOut | null = null;
  let topColleges: any[] = fallbackColleges.slice(0, 5);
  let topInternships: any[] = fallbackInternships.slice(0, 4);

  try {
    const [u, cRes, iRes] = await Promise.all([
      api<UserOut>("/api/v1/me").catch(() => null),
      api<PagedColleges>("/api/v1/colleges?page_size=5").catch(() => null),
      api<PagedInternships>("/api/v1/internships?page_size=4").catch(() => null),
    ]);
    user = u;
    if (cRes && cRes.items && cRes.items.length > 0) topColleges = cRes.items.slice(0, 5);
    if (iRes && iRes.items && iRes.items.length > 0) topInternships = iRes.items.slice(0, 4);
  } catch {}

  // 5 Template Colleges fallback list with exact rank numbers
  const displayColleges = [
    {
      rank: 1,
      name: "IIT Bombay",
      location: "Mumbai, Maharashtra",
      rating: "4.9",
      reviews: "12k+",
      slug: "iit-bombay",
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 2,
      name: "VNR VJIET",
      location: "Hyderabad, Telangana",
      rating: "4.8",
      reviews: "8k+",
      slug: "vnr-vjiet",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 3,
      name: "GITAM University",
      location: "Visakhapatnam, AP",
      rating: "4.7",
      reviews: "6k+",
      slug: "gitam-university",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 4,
      name: "KL University",
      location: "Vijayawada, AP",
      rating: "4.7",
      reviews: "5k+",
      slug: "kl-university",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop",
    },
    {
      rank: 5,
      name: "BVRIT Hyderabad",
      location: "Hyderabad, Telangana",
      rating: "4.6",
      reviews: "4k+",
      slug: "bvrit-hyderabad",
      image: "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=300&auto=format&fit=crop",
    },
  ];

  // 4 Template Tech Internships
  const displayInternships = [
    {
      company: "Amazon",
      role: "Software Development Intern",
      tags: ["Java", "DSA", "System Design"],
      stipend: "₹30,000/mo",
      slug: "software-engineering-intern-amazon",
      logoBg: "bg-amber-50 text-amber-700",
      letter: "a",
    },
    {
      company: "Microsoft",
      role: "Software Engineering Intern",
      tags: ["Java", "DSA", "Cloud"],
      stipend: "₹120,000/mo",
      slug: "software-engineering-intern-microsoft",
      logoBg: "bg-blue-50 text-blue-600",
      letter: "MS",
    },
    {
      company: "TCS",
      role: "Data Science Intern",
      tags: ["Python", "ML", "SQL"],
      stipend: "₹25,000/mo",
      slug: "data-science-intern-tcs",
      logoBg: "bg-rose-50 text-rose-600",
      letter: "tcs",
    },
    {
      company: "ZS Associates",
      role: "Business Analytics Associate",
      tags: ["Java", "SQL", "Analytics"],
      stipend: "₹30,000/mo",
      slug: "business-analytics-associate-zs-associates",
      logoBg: "bg-slate-100 text-slate-800",
      letter: "ZS",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH ATTACHED METRIC STRIP (Dynamic Count-Up & Previews)   */}
      {/* ========================================================================= */}
      <HeroSection />

      {/* ========================================================================= */}
      {/* 2. "EXPLORE OUR ECOSYSTEM" (Interactive Expand Accordion from Gemini Share) */}
      {/* ========================================================================= */}
      <EcosystemSection />

      {/* ========================================================= */}
      {/* 3. "TOP ACCREDITED COLLEGES & UNIVERSITIES" (3D Stage)   */}
      {/* ========================================================= */}
      <TopColleges3DStage />

      {/* ========================================================= */}
      {/* 4. "LATEST VERIFIED TECH INTERNSHIPS" (Slant-Cut Hover)   */}
      {/* ========================================================= */}
      <InternshipsShowcase />

      {/* ========================================================= */}
      {/* 5. READY TO START YOUR JOURNEY BANNER                     */}
      {/* ========================================================= */}
      <section className="container-page" data-theme="dark">
        <div className="relative rounded-3xl p-7 sm:p-9 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden">
          {/* Subtle Background Pattern Accent */}
          <div className="absolute left-0 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Text with Icon */}
          <div className="flex items-center gap-4 z-10 text-center md:text-left">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold shadow-lg shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                Ready to Start Your Journey?
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md">
                Join thousands of students, colleges, and employers already on JoinSchooling.
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 z-10 shrink-0">
            <Link
              href="/auth/register?role=college_rep"
              prefetch={true}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold py-2.5 px-5 rounded-full backdrop-blur-xs transition"
            >
              Register as College
            </Link>
            <Link
              href="/auth/register?role=recruiter"
              prefetch={true}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-lg transition flex items-center gap-1.5"
            >
              Register as Employer →
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FAQ & CONSULTATION CTA SECTIONS (Streamlined Spacing)   */}
      {/* ========================================================= */}
      <div className="space-y-4 sm:space-y-6">
        <FaqSection />
        <BottomCtaSection />
      </div>
    </div>
  );
}
