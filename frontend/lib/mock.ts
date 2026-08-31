// Mock data mirroring the FastAPI backend shapes so the UI is fully populated
// without a live server for the static export preview.

export type College = {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  type: "government" | "private" | "deemed" | "autonomous";
  city: string;
  state: string;
  nirf_rank?: number;
  avg_package_lpa?: number;
  placement_percent?: number;
  rating: number;
  reviews_count: number;
  hostel_available: boolean;
  facilities: string[];
  banner: string;
  tag?: string;
};

export const colleges: College[] = [
  {
    id: "1", slug: "iit-bombay", name: "Indian Institute of Technology Bombay", short_name: "IIT Bombay",
    type: "government", city: "Mumbai", state: "Maharashtra", nirf_rank: 3,
    avg_package_lpa: 21.8, placement_percent: 98, rating: 4.9, reviews_count: 5420,
    hostel_available: true, facilities: ["Library", "Sports", "Labs", "Hostel"],
    banner: "linear-gradient(135deg,#7c3aed,#0ea5e9)", tag: "Top NIRF",
  },
  {
    id: "2", slug: "vnr-vjiet", name: "VNR VJIET", short_name: "VNR VJIET",
    type: "autonomous", city: "Hyderabad", state: "Telangana", nirf_rank: 154,
    avg_package_lpa: 7.2, placement_percent: 92, rating: 4.4, reviews_count: 1210,
    hostel_available: true, facilities: ["Wi-Fi", "Labs", "Hostel", "Cafeteria"],
    banner: "linear-gradient(135deg,#f43f5e,#f59e0b)",
  },
  {
    id: "3", slug: "gitam-hyderabad", name: "GITAM University, Hyderabad", short_name: "GITAM",
    type: "deemed", city: "Hyderabad", state: "Telangana", nirf_rank: 101,
    avg_package_lpa: 6.5, placement_percent: 88, rating: 4.2, reviews_count: 980,
    hostel_available: true, facilities: ["Library", "Auditorium", "Gym"],
    banner: "linear-gradient(135deg,#22c55e,#0ea5e9)",
  },
  {
    id: "4", slug: "kl-university", name: "KL University", short_name: "KLU",
    type: "deemed", city: "Vijayawada", state: "Andhra Pradesh", nirf_rank: 45,
    avg_package_lpa: 8.1, placement_percent: 94, rating: 4.5, reviews_count: 1440,
    hostel_available: true, facilities: ["Innovation Labs", "Sports", "Hostel"],
    banner: "linear-gradient(135deg,#6366f1,#ec4899)", tag: "Rising",
  },
  {
    id: "5", slug: "bvrit", name: "BV Raju Institute of Technology", short_name: "BVRIT",
    type: "autonomous", city: "Narsapur", state: "Telangana", nirf_rank: 200,
    avg_package_lpa: 5.6, placement_percent: 85, rating: 4.1, reviews_count: 640,
    hostel_available: true, facilities: ["Wi-Fi", "Labs", "Hostel"],
    banner: "linear-gradient(135deg,#0ea5e9,#22d3ee)",
  },
  {
    id: "6", slug: "iiit-hyderabad", name: "IIIT Hyderabad", short_name: "IIIT-H",
    type: "deemed", city: "Hyderabad", state: "Telangana", nirf_rank: 47,
    avg_package_lpa: 26.4, placement_percent: 99, rating: 4.8, reviews_count: 3100,
    hostel_available: true, facilities: ["Research Labs", "Hostel", "Sports"],
    banner: "linear-gradient(135deg,#a855f7,#3b82f6)", tag: "Elite",
  },
];

export type Internship = {
  id: string; slug: string; title: string; company: string; logo: string;
  work_mode: "remote" | "hybrid" | "onsite";
  city?: string; stipend_min?: number; stipend_max?: number;
  duration_months: number; domain: string; skills: string[];
  posted_at: string; is_active: boolean;
};

export const internships: Internship[] = [
  { id: "i1", slug: "amazon-sde-intern", title: "SDE Intern", company: "Amazon", logo: "🟠",
    work_mode: "hybrid", city: "Hyderabad", stipend_min: 80000, stipend_max: 110000,
    duration_months: 6, domain: "Software", skills: ["Java", "DSA", "AWS"],
    posted_at: "2026-07-20", is_active: true },
  { id: "i2", slug: "ms-research-intern", title: "Research Intern - AI", company: "Microsoft", logo: "🟦",
    work_mode: "onsite", city: "Bengaluru", stipend_min: 90000, stipend_max: 120000,
    duration_months: 3, domain: "AI/ML", skills: ["Python", "PyTorch", "NLP"],
    posted_at: "2026-07-18", is_active: true },
  { id: "i3", slug: "google-step", title: "STEP Intern", company: "Google", logo: "🟢",
    work_mode: "onsite", city: "Bengaluru", stipend_min: 100000, stipend_max: 140000,
    duration_months: 3, domain: "Software", skills: ["C++", "DSA", "Algorithms"],
    posted_at: "2026-07-15", is_active: true },
  { id: "i4", slug: "tcs-fullstack", title: "Full-Stack Intern", company: "TCS", logo: "🔷",
    work_mode: "remote", stipend_min: 25000, stipend_max: 40000,
    duration_months: 6, domain: "Web", skills: ["React", "Node.js", "SQL"],
    posted_at: "2026-07-10", is_active: true },
  { id: "i5", slug: "zs-data-science", title: "Data Science Intern", company: "ZS Associates", logo: "🟣",
    work_mode: "hybrid", city: "Pune", stipend_min: 50000, stipend_max: 70000,
    duration_months: 6, domain: "Data", skills: ["Python", "SQL", "Statistics"],
    posted_at: "2026-07-08", is_active: true },
  { id: "i6", slug: "infosys-mobile", title: "Mobile Dev Intern", company: "Infosys", logo: "🟡",
    work_mode: "remote", stipend_min: 20000, stipend_max: 30000,
    duration_months: 4, domain: "Mobile", skills: ["Flutter", "Firebase"],
    posted_at: "2026-07-05", is_active: true },
];

export type Workshop = {
  id: string; slug: string; title: string; provider: string; date: string;
  mode: "online" | "offline"; price: number; seats: number; category: string; hero: string;
};
export const workshops: Workshop[] = [
  { id: "w1", slug: "gen-ai-bootcamp", title: "Generative AI Bootcamp", provider: "Scaler",
    date: "2026-08-04", mode: "online", price: 999, seats: 120, category: "AI/ML",
    hero: "linear-gradient(135deg,#7c3aed,#22d3ee)" },
  { id: "w2", slug: "react-mastery", title: "React 19 Mastery", provider: "GeeksForGeeks",
    date: "2026-08-12", mode: "online", price: 499, seats: 200, category: "Web",
    hero: "linear-gradient(135deg,#f43f5e,#f59e0b)" },
  { id: "w3", slug: "dsa-crash", title: "DSA Crash Course", provider: "Coding Ninjas",
    date: "2026-08-18", mode: "offline", price: 1499, seats: 40, category: "DSA",
    hero: "linear-gradient(135deg,#22c55e,#0ea5e9)" },
  { id: "w4", slug: "product-mgmt", title: "Product Management 101", provider: "GrowthSchool",
    date: "2026-08-22", mode: "online", price: 799, seats: 80, category: "PM",
    hero: "linear-gradient(135deg,#6366f1,#ec4899)" },
];

export type Hackathon = {
  id: string; slug: string; title: string; org: string; start: string; end: string;
  prize_pool: number; theme: string; mode: "online" | "hybrid" | "onsite"; hero: string;
};
export const hackathons: Hackathon[] = [
  { id: "h1", slug: "smart-india-hackathon", title: "Smart India Hackathon 2026", org: "MoE India",
    start: "2026-09-15", end: "2026-09-17", prize_pool: 5000000, theme: "Nation-scale problems",
    mode: "hybrid", hero: "linear-gradient(135deg,#7c3aed,#0ea5e9)" },
  { id: "h2", slug: "flipkart-grid", title: "Flipkart GRiD 6.0", org: "Flipkart",
    start: "2026-10-01", end: "2026-11-30", prize_pool: 1200000, theme: "E-commerce Innovation",
    mode: "online", hero: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id: "h3", slug: "hack36", title: "Hack36 - IIIT Allahabad", org: "IIIT-A",
    start: "2026-08-30", end: "2026-08-31", prize_pool: 500000, theme: "Open Innovation",
    mode: "onsite", hero: "linear-gradient(135deg,#22c55e,#a855f7)" },
];

export type Scholarship = {
  id: string; slug: string; title: string; provider: string; amount_lpa: number;
  eligibility: string; deadline: string; category: "merit" | "need" | "minority" | "sports";
};
export const scholarships: Scholarship[] = [
  { id: "s1", slug: "inspire-scholarship", title: "INSPIRE Scholarship", provider: "DST, GoI",
    amount_lpa: 0.8, eligibility: "Top 1% Class 12", deadline: "2026-09-30", category: "merit" },
  { id: "s2", slug: "reliance-foundation", title: "Reliance Foundation UG Scholarship",
    provider: "Reliance Foundation", amount_lpa: 2.0, eligibility: "Undergrad, merit-cum-need",
    deadline: "2026-10-15", category: "need" },
  { id: "s3", slug: "kishore-vaigyanik", title: "KVPY Fellowship", provider: "IISc",
    amount_lpa: 0.84, eligibility: "Science aptitude test", deadline: "2026-08-20", category: "merit" },
  { id: "s4", slug: "pm-yasasvi", title: "PM YASASVI Scholarship", provider: "MoSJE",
    amount_lpa: 1.25, eligibility: "OBC/EBC/DNT Class 9-12", deadline: "2026-11-05", category: "minority" },
];

export type Roadmap = { id: string; slug: string; title: string; level: "beginner" | "intermediate" | "advanced";
  steps: string[]; duration_weeks: number; hero: string; };
export const roadmaps: Roadmap[] = [
  { id: "r1", slug: "frontend-dev", title: "Frontend Developer", level: "beginner", duration_weeks: 12,
    steps: ["HTML/CSS", "JavaScript", "React", "Next.js", "TypeScript", "Testing"],
    hero: "linear-gradient(135deg,#f43f5e,#f59e0b)" },
  { id: "r2", slug: "data-scientist", title: "Data Scientist", level: "intermediate", duration_weeks: 20,
    steps: ["Python", "Statistics", "SQL", "ML", "Deep Learning", "MLOps"],
    hero: "linear-gradient(135deg,#7c3aed,#0ea5e9)" },
  { id: "r3", slug: "backend-dev", title: "Backend Developer", level: "beginner", duration_weeks: 14,
    steps: ["Language", "APIs", "DBs", "Caching", "Queues", "System Design"],
    hero: "linear-gradient(135deg,#22c55e,#0ea5e9)" },
  { id: "r4", slug: "ai-engineer", title: "AI Engineer", level: "advanced", duration_weeks: 24,
    steps: ["Python", "PyTorch", "Transformers", "LLMs", "RAG", "Deployment"],
    hero: "linear-gradient(135deg,#a855f7,#ec4899)" },
];

export type Alumni = {
  id: string; name: string; avatar: string; role: string; company: string;
  batch: number; college: string; skills: string[]; open_to_mentor: boolean;
};
export const alumni: Alumni[] = [
  { id: "a1", name: "Priya Sharma", avatar: "PS", role: "Senior SDE", company: "Amazon",
    batch: 2019, college: "VNR VJIET", skills: ["System Design", "AWS"], open_to_mentor: true },
  { id: "a2", name: "Rohan Verma", avatar: "RV", role: "ML Engineer", company: "Microsoft",
    batch: 2020, college: "IIIT Hyderabad", skills: ["PyTorch", "NLP"], open_to_mentor: true },
  { id: "a3", name: "Ananya Gupta", avatar: "AG", role: "Product Manager", company: "Flipkart",
    batch: 2018, college: "IIT Bombay", skills: ["Strategy", "SQL"], open_to_mentor: false },
  { id: "a4", name: "Kunal Reddy", avatar: "KR", role: "Data Scientist", company: "Google",
    batch: 2021, college: "IIIT Hyderabad", skills: ["ML", "Statistics"], open_to_mentor: true },
];

export const stats = { colleges: 12500, internships: 8400, workshops: 320, alumni: 42000 };

export const domains = ["Software", "AI/ML", "Data", "Web", "Mobile", "Cloud", "Cybersecurity", "Product"];
export const states = ["Telangana", "Andhra Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi"];
