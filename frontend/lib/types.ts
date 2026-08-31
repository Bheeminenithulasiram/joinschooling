// TypeScript types mirroring backend Pydantic DTOs.

export type Pagination = { page: number; page_size: number; total: number; has_next: boolean };

export type Tokens = { access_token: string; refresh_token: string; token_type: string; expires_in: number };

export type StudentProfile = {
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  headline?: string | null;
  tenth_percentage?: number | null;
  twelfth_percentage?: number | null;
  cgpa?: number | null;
  preferred_course?: string | null;
  budget_min_lpa?: number | null;
  budget_max_lpa?: number | null;
  state?: string | null;
  city?: string | null;
  hostel_required?: boolean | null;
  expected_package_lpa?: number | null;
  skills: string[];
  preferred_companies: string[];
};

export type UserOut = {
  id: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  profile?: StudentProfile | null;
};

export type CollegeCard = {
  id: string;
  slug: string;
  name: string;
  short_name?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  city: string;
  state: string;
  type: string;
  naac_grade?: string | null;
  nirf_rank?: number | null;
  avg_package_lpa?: number | null;
  highest_package_lpa?: number | null;
  placement_percent?: number | null;
  rating: number;
  reviews_count: number;
};

export type CourseOut = {
  id: string;
  name: string;
  degree_level: string;
  duration_years: number;
  total_seats?: number | null;
  fees_per_year_lpa?: number | null;
  entrance_exams: string[];
};

export type PlacementYearOut = {
  year: number;
  students_placed?: number | null;
  total_eligible?: number | null;
  highest_package_lpa?: number | null;
  avg_package_lpa?: number | null;
  top_recruiters: string[];
};

export type CollegeDetail = CollegeCard & {
  about?: string | null;
  website?: string | null;
  infrastructure: Record<string, unknown>;
  facilities: string[];
  hostel_available: boolean;
  hostel_fee_lpa?: number | null;
  admission_process?: string | null;
  courses: CourseOut[];
  placements: PlacementYearOut[];
};

export type PagedColleges = { items: CollegeCard[]; pagination: Pagination };

export type CompanyOut = { id: string; name: string; slug: string; logo_url?: string | null; industry?: string | null };

export type InternshipCard = {
  id: string;
  slug: string;
  title: string;
  domain: string;
  work_mode: "remote" | "hybrid" | "onsite";
  duration_months: number;
  stipend_min?: number | null;
  stipend_max?: number | null;
  location_city?: string | null;
  posted_at: string;
  apply_deadline?: string | null;
  company?: CompanyOut | null;
};

export type InternshipDetail = InternshipCard & {
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  eligibility_batches: string[];
};

export type PagedInternships = { items: InternshipCard[]; pagination: Pagination };

export type ApplicationOut = { id: string; target_kind: string; target_id: string; status: string; submitted_at: string };

export type DashboardStats = { applications: number; saved_colleges: number; saved_internships: number; unread_notifs: number };

export type DashboardSnapshot = {
  stats: DashboardStats;
  recent_applications: ApplicationOut[];
  recommended_colleges: CollegeCard[];
  upcoming_deadlines: any[];
};

export type AiFinderMatch = {
  college: CollegeCard;
  match_score: number;
  pros: string[];
  cons: string[];
  predicted_package_lpa?: number | null;
  admission_probability?: number | null;
};

export type AiFinderResponse = { run_id: string; recommendations: AiFinderMatch[] };
