// Rich database-grade mock data powering the JoinSchooling (EduConnect) ecosystem.
// Supports standalone Vercel preview & fallback when remote FastAPI server is not active.

export type College = {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  type: "government" | "private" | "deemed" | "autonomous";
  city: string;
  state: string;
  nirf_rank?: number;
  established_year: number;
  avg_package_lpa: number;
  highest_package_lpa: number;
  placement_percent: number;
  fees_per_year_lpa: number;
  rating: number;
  reviews_count: number;
  hostel_available: boolean;
  hostel_fee_lpa: number;
  facilities: string[];
  banner_url?: string;
  logo_url?: string;
  tag?: string;
  about: string;
  website: string;
  admission_process: string;
  courses: {
    id: string;
    name: string;
    degree_level: string;
    duration_years: number;
    fees_per_year_lpa: number;
    total_seats: number;
    cutoff_rank?: string;
    entrance_exams: string[];
  }[];
  placements: {
    year: number;
    avg_package_lpa: number;
    highest_package_lpa: number;
    students_placed: number;
    total_eligible: number;
    top_recruiters: string[];
  }[];
  reviews: {
    id: string;
    author: string;
    batch: number;
    rating: number;
    title: string;
    comment: string;
    date: string;
  }[];
};

export const colleges: College[] = [
  {
    id: "col-1",
    slug: "iit-bombay",
    name: "Indian Institute of Technology Bombay",
    short_name: "IIT Bombay",
    type: "government",
    city: "Mumbai",
    state: "Maharashtra",
    nirf_rank: 3,
    established_year: 1958,
    avg_package_lpa: 21.8,
    highest_package_lpa: 168.0,
    placement_percent: 98,
    fees_per_year_lpa: 2.2,
    rating: 4.9,
    reviews_count: 5420,
    hostel_available: true,
    hostel_fee_lpa: 0.4,
    facilities: ["Supercomputer Cluster", "Olympic Sports Complex", "Central Library", "Innovation Incubation Hub", "Hostel & Dining", "Medical Center"],
    tag: "Top NIRF #3",
    about: "IIT Bombay is recognized worldwide as a leader in engineering education and research. Renowned for its cutting-edge infrastructure, stellar faculty, and unmatched entrepreneurial ecosystem.",
    website: "https://www.iitb.ac.in",
    admission_process: "Admission to B.Tech courses is strictly via JEE Advanced following JEE Main qualification through JoSAA counseling.",
    courses: [
      { id: "c1-1", name: "Computer Science and Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.2, total_seats: 170, cutoff_rank: "AIR 1 - 67", entrance_exams: ["JEE Advanced"] },
      { id: "c1-2", name: "Electrical Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.2, total_seats: 120, cutoff_rank: "AIR 70 - 420", entrance_exams: ["JEE Advanced"] },
      { id: "c1-3", name: "Mechanical Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.2, total_seats: 150, cutoff_rank: "AIR 450 - 1500", entrance_exams: ["JEE Advanced"] },
      { id: "c1-4", name: "Data Science & Artificial Intelligence", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.3, total_seats: 60, cutoff_rank: "AIR 15 - 120", entrance_exams: ["JEE Advanced"] },
    ],
    placements: [
      { year: 2025, avg_package_lpa: 21.8, highest_package_lpa: 168.0, students_placed: 1420, total_eligible: 1450, top_recruiters: ["Google", "Microsoft", "Jane Street", "Apple", "Qualcomm", "Amazon"] },
      { year: 2024, avg_package_lpa: 21.2, highest_package_lpa: 150.0, students_placed: 1380, total_eligible: 1420, top_recruiters: ["Rubrik", "Optiver", "Uber", "Goldman Sachs"] }
    ],
    reviews: [
      { id: "r1", author: "Aakash Mehta", batch: 2024, rating: 5, title: "Unrivaled peer group and boundless exposure", comment: "The freedom to explore research, startups, and top tech companies is unmatched anywhere in Asia.", date: "2025-08-12" },
      { id: "r2", author: "Sneha Patil", batch: 2023, rating: 4.8, title: "World-class professors and vibrant campus life", comment: "Mood Indigo and Techfest are memories for a lifetime. Placement season is electric.", date: "2025-04-19" }
    ]
  },
  {
    id: "col-2",
    slug: "iiit-hyderabad",
    name: "International Institute of Information Technology Hyderabad",
    short_name: "IIIT Hyderabad",
    type: "deemed",
    city: "Hyderabad",
    state: "Telangana",
    nirf_rank: 47,
    established_year: 1998,
    avg_package_lpa: 26.4,
    highest_package_lpa: 102.0,
    placement_percent: 99,
    fees_per_year_lpa: 3.6,
    rating: 4.8,
    reviews_count: 3100,
    hostel_available: true,
    hostel_fee_lpa: 0.6,
    facilities: ["Kohli Center on Intelligent Systems", "Language Technologies Lab", "24/7 Coding Hubs", "Robotics Lab", "Hostel"],
    tag: "Coding & AI Mecca",
    about: "IIIT Hyderabad is premier autonomous research university focusing on core computer science, artificial intelligence, NLP, and computer vision with high research output.",
    website: "https://www.iiit.ac.in",
    admission_process: "Admissions through JEE Main score, UGEE (Undergraduate Engineering Entrance), and Olympiad channels.",
    courses: [
      { id: "c2-1", name: "Computer Science and Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 3.6, total_seats: 150, cutoff_rank: "JEE Main 99.8+ %ile", entrance_exams: ["JEE Main", "UGEE"] },
      { id: "c2-2", name: "Electronics and Communication", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 3.6, total_seats: 90, cutoff_rank: "JEE Main 99.2+ %ile", entrance_exams: ["JEE Main", "UGEE"] },
      { id: "c2-3", name: "CSE + Master of Science by Research", degree_level: "Dual Degree", duration_years: 5, fees_per_year_lpa: 3.6, total_seats: 60, cutoff_rank: "UGEE Rank < 100", entrance_exams: ["UGEE"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 26.4, highest_package_lpa: 102.0, students_placed: 340, total_eligible: 345, top_recruiters: ["Apple", "Meta", "Google", "Bloomberg", "Tower Research", "NVIDIA"] }
    ],
    reviews: [
      { id: "r2-1", author: "Karthik V.", batch: 2024, rating: 4.9, title: "The premier coding culture in India", comment: "If your goal is deep computer science or competitive programming, there is no place better.", date: "2025-06-10" }
    ]
  },
  {
    id: "col-3",
    slug: "vnr-vjiet",
    name: "Vallurupalli Nageswara Rao Vignana Jyothi Institute of Engineering and Technology",
    short_name: "VNR VJIET",
    type: "autonomous",
    city: "Hyderabad",
    state: "Telangana",
    nirf_rank: 112,
    established_year: 1995,
    avg_package_lpa: 7.8,
    highest_package_lpa: 48.0,
    placement_percent: 94,
    fees_per_year_lpa: 1.35,
    rating: 4.5,
    reviews_count: 1450,
    hostel_available: true,
    hostel_fee_lpa: 0.8,
    facilities: ["Advanced IoT Center", "Smart Library", "Design Thinking Lab", "Hostel", "Auditorium", "Sports Grounds"],
    tag: "Top Telangana Autonomous",
    about: "VNR VJIET is one of the highest-rated engineering institutions in Hyderabad, known for project-based active learning, high placement rates, and robust corporate tie-ups.",
    website: "https://www.vnrvjiet.ac.in",
    admission_process: "70% seats allocated through TG EAPCET (Convener Quota), 30% through Management/JEE Quota.",
    courses: [
      { id: "c3-1", name: "Computer Science and Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 1.35, total_seats: 240, cutoff_rank: "EAPCET < 2500", entrance_exams: ["TG EAPCET", "JEE Main"] },
      { id: "c3-2", name: "Artificial Intelligence & Machine Learning", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 1.35, total_seats: 180, cutoff_rank: "EAPCET < 3800", entrance_exams: ["TG EAPCET"] },
      { id: "c3-3", name: "Information Technology", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 1.35, total_seats: 180, cutoff_rank: "EAPCET < 4500", entrance_exams: ["TG EAPCET"] },
      { id: "c3-4", name: "Electronics and Communication Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 1.35, total_seats: 240, cutoff_rank: "EAPCET < 7000", entrance_exams: ["TG EAPCET"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 7.8, highest_package_lpa: 48.0, students_placed: 1650, total_eligible: 1750, top_recruiters: ["Amazon", "ServiceNow", "JPMorgan Chase", "Deloitte", "Oracle", "TCS"] }
    ],
    reviews: [
      { id: "r3-1", author: "Pranathi Reddy", batch: 2024, rating: 4.6, title: "Great placement support and disciplined academics", comment: "VNR helped me secure an internship at JPMorgan Chase in my 3rd year.", date: "2025-07-02" }
    ]
  },
  {
    id: "col-4",
    slug: "bits-pilani-hyderabad",
    name: "Birla Institute of Technology and Science, Pilani - Hyderabad Campus",
    short_name: "BITS Hyderabad",
    type: "deemed",
    city: "Hyderabad",
    state: "Telangana",
    nirf_rank: 20,
    established_year: 2008,
    avg_package_lpa: 18.2,
    highest_package_lpa: 60.5,
    placement_percent: 96,
    fees_per_year_lpa: 5.4,
    rating: 4.7,
    reviews_count: 2200,
    hostel_available: true,
    hostel_fee_lpa: 0.5,
    facilities: ["Practice School (PS-I & PS-II)", "0% Attendance Policy", "Modern Tech Center", "Swimming Complex", "Maker Space"],
    tag: "Top Private Elite",
    about: "BITS Pilani Hyderabad delivers world-class science and engineering programs with its flexible curriculum, Practice School industry internship program, and strong global alumni network.",
    website: "https://www.bits-pilani.ac.in/hyderabad",
    admission_process: "Admission through BITSAT (Birla Institute of Technology and Science Admission Test).",
    courses: [
      { id: "c4-1", name: "Computer Science", degree_level: "B.E.", duration_years: 4, fees_per_year_lpa: 5.4, total_seats: 180, cutoff_rank: "BITSAT 290+", entrance_exams: ["BITSAT"] },
      { id: "c4-2", name: "Electronics & Communication", degree_level: "B.E.", duration_years: 4, fees_per_year_lpa: 5.4, total_seats: 120, cutoff_rank: "BITSAT 260+", entrance_exams: ["BITSAT"] },
      { id: "c4-3", name: "Economics + Computer Science", degree_level: "Dual Degree", duration_years: 5, fees_per_year_lpa: 5.4, total_seats: 60, cutoff_rank: "BITSAT 245+", entrance_exams: ["BITSAT"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 18.2, highest_package_lpa: 60.5, students_placed: 980, total_eligible: 1020, top_recruiters: ["Microsoft", "Google", "Goldman Sachs", "DE Shaw", "Texas Instruments"] }
    ],
    reviews: [
      { id: "r4-1", author: "Rohan Iyer", batch: 2024, rating: 4.8, title: "Unbeatable industry exposure with Practice School", comment: "The 6-month PS-2 semester directly converted into a full-time return offer.", date: "2025-05-14" }
    ]
  },
  {
    id: "col-5",
    slug: "vit-vellore",
    name: "Vellore Institute of Technology",
    short_name: "VIT Vellore",
    type: "deemed",
    city: "Vellore",
    state: "Tamil Nadu",
    nirf_rank: 11,
    established_year: 1984,
    avg_package_lpa: 9.2,
    highest_package_lpa: 102.0,
    placement_percent: 92,
    fees_per_year_lpa: 2.0,
    rating: 4.4,
    reviews_count: 8500,
    hostel_available: true,
    hostel_fee_lpa: 0.9,
    facilities: ["Smart Classrooms", "International Guest Lecturers", "Food Courts", "Olympic Gym", "Hackathon Arenas"],
    tag: "Super Dream Offers",
    about: "VIT Vellore offers a comprehensive flexible credit system (FFCS) allowing students to design their own timetable, professors, and subject sequencing with immense campus recruitment drives.",
    website: "https://www.vit.ac.in",
    admission_process: "Admission is conducted through VITEEE (VIT Engineering Entrance Examination).",
    courses: [
      { id: "c5-1", name: "Computer Science and Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.0, total_seats: 1200, cutoff_rank: "VITEEE Rank 1 - 7000", entrance_exams: ["VITEEE"] },
      { id: "c5-2", name: "Information Technology", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.0, total_seats: 400, cutoff_rank: "VITEEE Rank 7000 - 15000", entrance_exams: ["VITEEE"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 9.2, highest_package_lpa: 102.0, students_placed: 8400, total_eligible: 9100, top_recruiters: ["Microsoft", "Motorq", "Amazon", "Cognizant", "Wipro", "Intel"] }
    ],
    reviews: [
      { id: "r5-1", author: "Varun Sharma", batch: 2024, rating: 4.3, title: "Gigantic placement drives with 900+ companies visiting", comment: "If you prepare DSA and maintain an 8.5+ CGPA, you are guaranteed a high package offer.", date: "2025-06-25" }
    ]
  },
  {
    id: "col-6",
    slug: "kl-university",
    name: "Koneru Lakshmaiah Education Foundation (KL University)",
    short_name: "KL University",
    type: "deemed",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    nirf_rank: 28,
    established_year: 1980,
    avg_package_lpa: 8.5,
    highest_package_lpa: 58.0,
    placement_percent: 95,
    fees_per_year_lpa: 2.5,
    rating: 4.5,
    reviews_count: 2100,
    hostel_available: true,
    hostel_fee_lpa: 0.75,
    facilities: ["Specialization Honors Tracks", "Center of Excellence Labs", "AC Hostels", "Indoor Sports Arena", "Industry Certifications"],
    tag: "Top Andhra Ranked",
    about: "KL University is known for mandatory global certifications, practice-based engineering education, and aggressive placement training with top product and services companies.",
    website: "https://www.kluniversity.in",
    admission_process: "Admission through KLEEE, JEE Main, or AP EAPCET scores.",
    courses: [
      { id: "c6-1", name: "Computer Science and Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.5, total_seats: 1500, cutoff_rank: "KLEEE Rank 1 - 5000", entrance_exams: ["KLEEE", "JEE Main"] },
      { id: "c6-2", name: "AI and Data Science", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.6, total_seats: 600, cutoff_rank: "KLEEE Rank < 6000", entrance_exams: ["KLEEE"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 8.5, highest_package_lpa: 58.0, students_placed: 3800, total_eligible: 4000, top_recruiters: ["Amazon", "Cisco", "Siemens", "TCS Digital", "Infosys"] }
    ],
    reviews: [
      { id: "r6-1", author: "Sai Teja", batch: 2024, rating: 4.5, title: "Intensive training that gives you an edge in interviews", comment: "The university pays for AWS and Azure certifications which helped a lot on my resume.", date: "2025-04-11" }
    ]
  },
  {
    id: "col-7",
    slug: "gitam-hyderabad",
    name: "GITAM Deemed to be University, Hyderabad Campus",
    short_name: "GITAM Hyderabad",
    type: "deemed",
    city: "Hyderabad",
    state: "Telangana",
    nirf_rank: 67,
    established_year: 2009,
    avg_package_lpa: 6.8,
    highest_package_lpa: 46.5,
    placement_percent: 89,
    fees_per_year_lpa: 2.8,
    rating: 4.2,
    reviews_count: 1350,
    hostel_available: true,
    hostel_fee_lpa: 0.85,
    facilities: ["Venture Development Center", "Central Library", "Hostel", "Auditorium", "Cricket Stadium"],
    tag: "Entrepreneurship & Growth",
    about: "GITAM Hyderabad offers multidisciplinary education, strong entrepreneurship incubation via VDC, and partnerships with Fortune 500 tech companies.",
    website: "https://www.gitam.edu",
    admission_process: "Admission through GAT (GITAM Admission Test) or JEE Main score.",
    courses: [
      { id: "c7-1", name: "Computer Science Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.8, total_seats: 480, cutoff_rank: "GAT Rank 1 - 3000", entrance_exams: ["GAT", "JEE Main"] },
      { id: "c7-2", name: "CSE with Cyber Security", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 2.8, total_seats: 120, cutoff_rank: "GAT Rank < 4500", entrance_exams: ["GAT"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 6.8, highest_package_lpa: 46.5, students_placed: 1200, total_eligible: 1350, top_recruiters: ["Amazon", "TCS", "Accenture", "Mindtree", "Oracle"] }
    ],
    reviews: [
      { id: "r7-1", author: "Manoj Kumar", batch: 2024, rating: 4.2, title: "Modern infrastructure and peaceful green campus", comment: "Faculty is very approachable and project opportunities are abundant.", date: "2025-05-30" }
    ]
  },
  {
    id: "col-8",
    slug: "bvrit-narsapur",
    name: "B.V. Raju Institute of Technology (BVRIT)",
    short_name: "BVRIT",
    type: "autonomous",
    city: "Narsapur",
    state: "Telangana",
    nirf_rank: 142,
    established_year: 1997,
    avg_package_lpa: 6.2,
    highest_package_lpa: 44.0,
    placement_percent: 88,
    fees_per_year_lpa: 1.25,
    rating: 4.3,
    reviews_count: 980,
    hostel_available: true,
    hostel_fee_lpa: 0.7,
    facilities: ["Assistive Technology Lab", "Eco-friendly Campus", "Robotics Club", "Hostels", "Sports Ground"],
    tag: "High ROI Autonomous",
    about: "BVRIT is renowned for its Vishnu Educational ecosystem, social innovation labs, and strong placement pipelines with leading software product companies.",
    website: "https://www.bvrit.ac.in",
    admission_process: "Admission through TG EAPCET Convener Quota and Management quota.",
    courses: [
      { id: "c8-1", name: "Computer Science and Engineering", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 1.25, total_seats: 300, cutoff_rank: "EAPCET < 5500", entrance_exams: ["TG EAPCET"] },
      { id: "c8-2", name: "Information Technology", degree_level: "B.Tech", duration_years: 4, fees_per_year_lpa: 1.25, total_seats: 180, cutoff_rank: "EAPCET < 8500", entrance_exams: ["TG EAPCET"] }
    ],
    placements: [
      { year: 2025, avg_package_lpa: 6.2, highest_package_lpa: 44.0, students_placed: 1100, total_eligible: 1250, top_recruiters: ["Virtusa", "Amazon", "Capgemini", "Accenture", "TCS"] }
    ],
    reviews: [
      { id: "r8-1", author: "Nikhil G.", batch: 2024, rating: 4.4, title: "Great value for money and solid coding clubs", comment: "The Vishnu coding club prepares you right from 2nd year.", date: "2025-06-18" }
    ]
  }
];

export type Internship = {
  id: string;
  slug: string;
  title: string;
  company: string;
  company_id?: string;
  logo: string;
  logo_url?: string;
  work_mode: "remote" | "hybrid" | "onsite";
  city?: string;
  state?: string;
  stipend_min: number;
  stipend_max: number;
  stipend_currency: string;
  duration_months: number;
  openings: number;
  domain: string;
  skills: string[];
  posted_at: string;
  apply_deadline: string;
  is_active: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  eligibility_batches: string[];
};

export const internships: Internship[] = [
  {
    id: "int-1",
    slug: "amazon-sde-intern",
    title: "Software Development Engineer (SDE) Intern",
    company: "Amazon",
    logo: "🟠",
    work_mode: "hybrid",
    city: "Hyderabad",
    state: "Telangana",
    stipend_min: 80000,
    stipend_max: 110000,
    stipend_currency: "INR",
    duration_months: 6,
    openings: 25,
    domain: "Software",
    skills: ["Java", "Data Structures", "Algorithms", "AWS", "System Design"],
    posted_at: "2026-09-01",
    apply_deadline: "2026-10-30",
    is_active: true,
    description: "Amazon is looking for passionate SDE Interns to build large-scale cloud services, high-throughput backend APIs, and customer-facing features on Amazon.in and AWS.",
    responsibilities: [
      "Design, implement, test, and deploy clean, scalable Java/C++ backend services.",
      "Collaborate with senior engineers to architect reliable distributed microservices.",
      "Optimize SQL/NoSQL database queries and reduce latency for millions of daily shoppers."
    ],
    requirements: [
      "Enrolled in B.Tech/M.Tech in CS, IT, ECE, or related fields (2026/2027 batch).",
      "Strong foundation in OOP, DSA, time/space complexity analysis.",
      "Proficiency in Java, C++, or Python with hands-on project experience."
    ],
    benefits: [
      "Stipend of ₹80,000 - ₹1,10,000 per month.",
      "Full PPO (Pre-Placement Offer) conversion opportunity based on internship performance.",
      "Free meal vouchers, modern laptop kit, and health insurance."
    ],
    eligibility_batches: ["2026", "2027"]
  },
  {
    id: "int-2",
    slug: "google-step-intern",
    title: "STEP Intern (Student Training in Engineering Program)",
    company: "Google",
    logo: "🟢",
    work_mode: "onsite",
    city: "Bengaluru",
    state: "Karnataka",
    stipend_min: 100000,
    stipend_max: 140000,
    stipend_currency: "INR",
    duration_months: 3,
    openings: 15,
    domain: "Software",
    skills: ["C++", "Python", "Data Structures", "Algorithms"],
    posted_at: "2026-09-05",
    apply_deadline: "2026-10-25",
    is_active: true,
    description: "Google STEP is a developmental internship program focused on providing first- and second-year undergraduate students with hands-on technical industry experience.",
    responsibilities: [
      "Work in a pair-programming model on challenging production features.",
      "Attend technical seminars, mentorship sessions, and code review workshops with Google staff."
    ],
    requirements: [
      "1st or 2nd year undergraduate students in Computer Science or related degree.",
      "Demonstrated problem-solving abilities and curiosity for technology."
    ],
    benefits: [
      "Monthly stipend of ₹1,00,000 - ₹1,40,000.",
      "Comprehensive accommodation subsidy and roundtrip flight reimbursement.",
      "Dedicated 1-on-1 mentorship with senior Google engineers."
    ],
    eligibility_batches: ["2027", "2028"]
  },
  {
    id: "int-3",
    slug: "microsoft-ai-research-intern",
    title: "AI Research & Applied ML Intern",
    company: "Microsoft",
    logo: "🟦",
    work_mode: "hybrid",
    city: "Hyderabad",
    state: "Telangana",
    stipend_min: 90000,
    stipend_max: 125000,
    stipend_currency: "INR",
    duration_months: 6,
    openings: 10,
    domain: "AI/ML",
    skills: ["Python", "PyTorch", "Transformers", "LLMs", "RAG", "Vector DBs"],
    posted_at: "2026-09-10",
    apply_deadline: "2026-11-15",
    is_active: true,
    description: "Join Microsoft Research & Copilot teams to fine-tune Foundation Models, build retrieval-augmented generation pipelines, and optimize transformer inference.",
    responsibilities: [
      "Train, fine-tune, and evaluate deep learning architectures for enterprise NLP tasks.",
      "Implement embedding indexers, re-ranking logic, and automated evaluation benchmarks."
    ],
    requirements: [
      "Strong background in Linear Algebra, Probability, Deep Learning fundamentals.",
      "Experience with PyTorch, HuggingFace Transformers, and LangChain/LlamaIndex."
    ],
    benefits: [
      "₹90,000 - ₹1,25,000 / month stipend.",
      "Access to high-compute Azure H100 GPU clusters.",
      "Co-authorship on research publications and fast-track fulltime hiring."
    ],
    eligibility_batches: ["2026", "2027"]
  },
  {
    id: "int-4",
    slug: "flipkart-fullstack-intern",
    title: "Full-Stack Web Engineering Intern",
    company: "Flipkart",
    logo: "🟡",
    work_mode: "onsite",
    city: "Bengaluru",
    state: "Karnataka",
    stipend_min: 60000,
    stipend_max: 80000,
    stipend_currency: "INR",
    duration_months: 6,
    openings: 20,
    domain: "Web",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "Redis"],
    posted_at: "2026-09-08",
    apply_deadline: "2026-10-31",
    is_active: true,
    description: "Build high-speed e-commerce user journeys for Big Billion Days sales events handling 100,000+ requests per second.",
    responsibilities: [
      "Develop ultra-fast, responsive web interfaces in React, Next.js, and TypeScript.",
      "Build REST/GraphQL APIs and optimize Redis caching layers."
    ],
    requirements: [
      "Proficient in Modern JavaScript/TypeScript, React hooks, and state management.",
      "Familiarity with web performance, SSR, and REST API design."
    ],
    benefits: [
      "₹60,000 - ₹80,000 / month stipend.",
      "PPO opportunities for final year students.",
      "Free daily breakfast & lunch at Flipkart HQ."
    ],
    eligibility_batches: ["2026"]
  },
  {
    id: "int-5",
    slug: "zomato-mobile-app-intern",
    title: "Mobile App Developer Intern (React Native / Flutter)",
    company: "Zomato",
    logo: "🔴",
    work_mode: "remote",
    stipend_min: 45000,
    stipend_max: 65000,
    stipend_currency: "INR",
    duration_months: 4,
    openings: 8,
    domain: "Mobile",
    skills: ["React Native", "Flutter", "TypeScript", "State Management"],
    posted_at: "2026-09-12",
    apply_deadline: "2026-11-05",
    is_active: true,
    description: "Craft buttery-smooth mobile ordering and delivery tracking flows for 50M+ active Zomato foodies across India.",
    responsibilities: [
      "Build interactive mobile features with 60 FPS animations.",
      "Integrate real-time socket events and geo-location tracking."
    ],
    requirements: [
      "Prior experience building mobile apps with React Native or Flutter.",
      "Portfolio of deployed apps or open-source GitHub projects."
    ],
    benefits: [
      "₹45,000 - ₹65,000 / month remote stipend.",
      "Flexible working hours and Zomato Gold credits."
    ],
    eligibility_batches: ["2026", "2027"]
  },
  {
    id: "int-6",
    slug: "uber-data-analytics-intern",
    title: "Data Analytics & Operations Intern",
    company: "Uber",
    logo: "⚫",
    work_mode: "hybrid",
    city: "Hyderabad",
    state: "Telangana",
    stipend_min: 70000,
    stipend_max: 95000,
    stipend_currency: "INR",
    duration_months: 6,
    openings: 12,
    domain: "Data",
    skills: ["SQL", "Python", "Tableau", "Statistical Modeling", "A/B Testing"],
    posted_at: "2026-09-14",
    apply_deadline: "2026-11-10",
    is_active: true,
    description: "Analyze rider dispatch times, dynamic pricing elasticity, and driver incentives to optimize Uber India mobility metrics.",
    responsibilities: [
      "Write complex SQL queries and build automated Tableau executive dashboards.",
      "Run statistical A/B tests to evaluate pricing changes and driver promotions."
    ],
    requirements: [
      "Strong command of SQL, Python data libraries (Pandas/NumPy), and business acumen.",
      "Ability to communicate actionable insights from ambiguous datasets."
    ],
    benefits: [
      "₹70,000 - ₹95,000 / month stipend.",
      "Uber ride credits and premium equipment."
    ],
    eligibility_batches: ["2026", "2027"]
  }
];

export type Workshop = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  instructor: string;
  instructor_role: string;
  date: string;
  duration: string;
  mode: "online" | "offline";
  price: number;
  original_price: number;
  seats: number;
  seats_left: number;
  category: string;
  hero: string;
  curriculum: string[];
  certificate_provided: boolean;
};

export const workshops: Workshop[] = [
  {
    id: "w-1",
    slug: "gen-ai-bootcamp",
    title: "Generative AI & LLM Systems Bootcamp",
    provider: "JoinSchooling Academy",
    instructor: "Dr. Arvind Rao",
    instructor_role: "Ex-Google Brain Scientist",
    date: "2026-10-05",
    duration: "2 Days (10 Hours)",
    mode: "online",
    price: 999,
    original_price: 3999,
    seats: 150,
    seats_left: 23,
    category: "AI/ML",
    hero: "linear-gradient(135deg,#7c3aed,#22d3ee)",
    curriculum: ["Foundations of Transformer Attention", "Building RAG with Vector Stores", "Fine-tuning Llama-3 locally", "Production AI Agents & Tool Calling"],
    certificate_provided: true
  },
  {
    id: "w-2",
    slug: "react-19-nextjs-mastery",
    title: "Full-Stack Next.js 15 & React 19 Mastery",
    provider: "GeeksForGeeks Pro",
    instructor: "Karan Verma",
    instructor_role: "Staff Engineer @ Swiggy",
    date: "2026-10-12",
    duration: "1 Day (6 Hours)",
    mode: "online",
    price: 499,
    original_price: 1999,
    seats: 250,
    seats_left: 45,
    category: "Web",
    hero: "linear-gradient(135deg,#f43f5e,#f59e0b)",
    curriculum: ["React Server Components & Actions", "Streaming SSR & Suspense", "PostgreSQL & Prisma Integration", "Vercel Zero-Config CI/CD"],
    certificate_provided: true
  },
  {
    id: "w-3",
    slug: "dsa-interview-accelerator",
    title: "DSA & System Design Interview Accelerator",
    provider: "Coding Ninjas Elite",
    instructor: "Naveen Singla",
    instructor_role: "Principal Architect @ Amazon",
    date: "2026-10-19",
    duration: "3 Days (12 Hours)",
    mode: "offline",
    price: 1499,
    original_price: 4999,
    seats: 60,
    seats_left: 8,
    category: "DSA",
    hero: "linear-gradient(135deg,#22c55e,#0ea5e9)",
    curriculum: ["Graph Algorithms & DP Patterns", "High-Throughput Distributed Cache Design", "Rate Limiters & Microservice Architecture", "Live Mock Interviews"],
    certificate_provided: true
  },
  {
    id: "w-4",
    slug: "product-management-101",
    title: "Tech Product Management & Growth 101",
    provider: "GrowthSchool",
    instructor: "Meera Sen",
    instructor_role: "VP Product @ Flipkart",
    date: "2026-10-26",
    duration: "2 Days (8 Hours)",
    mode: "online",
    price: 799,
    original_price: 2499,
    seats: 100,
    seats_left: 17,
    category: "PM",
    hero: "linear-gradient(135deg,#6366f1,#ec4899)",
    curriculum: ["PRD Writing & User Story Mapping", "North Star Metrics & Retention Funnels", "A/B Testing Frameworks", "Product Case Study Breakdown"],
    certificate_provided: true
  }
];

export type Hackathon = {
  id: string;
  slug: string;
  title: string;
  org: string;
  start: string;
  end: string;
  prize_pool: number;
  theme: string;
  mode: "online" | "hybrid" | "onsite";
  hero?: string;
  location?: string;
  team_size: string;
  perks: string[];
  tracks: string[];
};

export const hackathons: Hackathon[] = [
  {
    id: "h-1",
    slug: "smart-india-hackathon-2026",
    title: "Smart India Hackathon 2026",
    org: "Ministry of Education, Govt of India",
    start: "2026-11-15",
    end: "2026-11-17",
    prize_pool: 5000000,
    theme: "Nation-Scale Public Tech Solutions",
    mode: "hybrid",
    location: "Nodal Centers across India",
    team_size: "6 Members (Min 1 Female)",
    perks: ["₹1,00,000 Winner Prize per Problem", "Direct Central Ministry Recognition", "Fast-track Govt Incubator Grants"],
    tracks: ["Smart Agriculture", "Clean Energy & EV", "Healthcare & Telemedicine", "Disaster Management"]
  },
  {
    id: "h-2",
    slug: "flipkart-grid-7",
    title: "Flipkart GRiD 7.0 — Engineering Challenge",
    org: "Flipkart",
    start: "2026-10-01",
    end: "2026-11-20",
    prize_pool: 1500000,
    theme: "Next-Gen E-Commerce & Robotics",
    mode: "online",
    team_size: "1–3 Members",
    perks: ["Top Finalists get direct PPIs for SDE-1", "MacBook Pro for 1st Place", "₹15 Lakh Cash Pool"],
    tracks: ["AI Product Visual Search", "Warehouse Automated Drone Navigation", "Fraud Detection at Scale"]
  },
  {
    id: "h-3",
    slug: "hack36-iiit-allahabad",
    title: "Hack36 2026 — Annual 36-Hour Hackathon",
    org: "IIIT Allahabad",
    start: "2026-10-28",
    end: "2026-10-30",
    prize_pool: 600000,
    theme: "Open Innovation, Web3 & FinTech",
    mode: "onsite",
    location: "IIIT Allahabad Campus",
    team_size: "2–4 Members",
    perks: ["Free Food & Accommodation", "Exclusive Sponsor Swag Bags", "Angel Investor Pitch Sessions"],
    tracks: ["Open Innovation", "DeFi & Web3", "AI Agents", "AR/VR Interfaces"]
  }
];

export type Scholarship = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  amount_lpa: number;
  eligibility: string;
  min_percentage: number;
  max_annual_income_lpa?: number;
  deadline: string;
  category: "merit" | "need" | "minority" | "sports";
  documents_required: string[];
};

export const scholarships: Scholarship[] = [
  {
    id: "s-1",
    slug: "inspire-scholarship",
    title: "INSPIRE Scholarship for Higher Education (SHE)",
    provider: "Department of Science & Technology, Govt of India",
    amount_lpa: 0.8,
    eligibility: "Top 1% rankers in Class 12 board exams enrolled in Natural/Basic Sciences.",
    min_percentage: 92,
    deadline: "2026-10-31",
    category: "merit",
    documents_required: ["12th Marksheet", "College Enrollment Certificate", "Bank Passbook", "Aadhaar Card"]
  },
  {
    id: "s-2",
    slug: "reliance-foundation-ug",
    title: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    amount_lpa: 2.0,
    eligibility: "Merit-cum-means scholarship for 1st year degree students with household income < ₹15 LPA.",
    min_percentage: 60,
    max_annual_income_lpa: 15.0,
    deadline: "2026-10-15",
    category: "need",
    documents_required: ["Family Income Certificate", "Aptitude Test Scorecard", "12th Marksheet", "Admission Fee Receipt"]
  },
  {
    id: "s-3",
    slug: "pm-yasasvi-scheme",
    title: "PM YASASVI National Scholarship Scheme",
    provider: "Ministry of Social Justice and Empowerment",
    amount_lpa: 1.25,
    eligibility: "OBC, EBC, and DNT students studying in Top identified schools/colleges with income < ₹2.5 LPA.",
    min_percentage: 75,
    max_annual_income_lpa: 2.5,
    deadline: "2026-11-20",
    category: "minority",
    documents_required: ["Caste Certificate", "Income Certificate (< ₹2.5L)", "Bonafide Certificate", "Marksheet"]
  },
  {
    id: "s-4",
    slug: "hdfc-badhte-kadam",
    title: "HDFC Bank Parivartan's ECSS Scholarship",
    provider: "HDFC Bank",
    amount_lpa: 0.75,
    eligibility: "Students facing sudden financial crisis or family hardship pursuing UG degrees.",
    min_percentage: 55,
    max_annual_income_lpa: 6.0,
    deadline: "2026-11-30",
    category: "need",
    documents_required: ["Crisis Proof / Income Proof", "Previous Year Marksheet", "Fee Structure Slip"]
  }
];

export type Roadmap = {
  id: string;
  slug: string;
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  duration_weeks: number;
  salary_range_lpa: string;
  hero: string;
  description: string;
  steps: {
    title: string;
    description: string;
    topics: string[];
    recommended_projects: string[];
  }[];
};

export const roadmaps: Roadmap[] = [
  {
    id: "r-1",
    slug: "full-stack-web-developer",
    title: "Full-Stack Web Developer",
    level: "beginner",
    duration_weeks: 16,
    salary_range_lpa: "₹8 LPA - ₹28 LPA",
    hero: "linear-gradient(135deg,#f43f5e,#f59e0b)",
    description: "Master modern web development from HTML/CSS/JS fundamentals to React 19, Next.js 15, Node.js, PostgreSQL, and scalable deployment.",
    steps: [
      { title: "1. Web Foundations & JavaScript", description: "Semantic HTML5, CSS Grid/Flexbox, ES6+ JavaScript, Async/Await, DOM manipulation.", topics: ["HTML5", "CSS3", "JavaScript ES6+", "Fetch API", "Git/GitHub"], recommended_projects: ["Responsive Portfolio", "Interactive Weather App"] },
      { title: "2. Modern Frontend with React & Next.js", description: "Component lifecycle, React Hooks, Tailwind CSS, App Router, SSR & Server Actions.", topics: ["React 19", "Next.js 15", "Tailwind CSS", "Zustand State", "Lucide Icons"], recommended_projects: ["E-Commerce Storefront", "Task Management Kanban"] },
      { title: "3. Backend Architecture & Databases", description: "RESTful API engineering, JWT Authentication, relational schema design with PostgreSQL.", topics: ["Node.js/Express", "PostgreSQL", "Prisma ORM", "JWT & Bcrypt", "Redis Cache"], recommended_projects: ["Multi-Tenant SaaS API", "Real-Time Chat Engine"] },
      { title: "4. Deployment, CI/CD & DevOps", description: "Docker containerization, automated GitHub Actions workflows, Vercel & AWS hosting.", topics: ["Docker", "GitHub Actions", "Vercel", "AWS S3 / EC2", "Monitoring"], recommended_projects: ["Production Microservice Cluster"] }
    ]
  },
  {
    id: "r-2",
    slug: "ai-machine-learning-engineer",
    title: "AI & Machine Learning Engineer",
    level: "advanced",
    duration_weeks: 24,
    salary_range_lpa: "₹12 LPA - ₹45 LPA",
    hero: "linear-gradient(135deg,#7c3aed,#0ea5e9)",
    description: "Go from linear algebra and Python data science to fine-tuning Foundation LLMs, building multi-agent systems, and deploying GPU inference servers.",
    steps: [
      { title: "1. Math & Data Science Core", description: "Linear algebra, multivariable calculus, probability, Pandas, NumPy, and statistical testing.", topics: ["Python 3", "NumPy", "Pandas", "Matplotlib/Seaborn", "Scikit-Learn"], recommended_projects: ["House Price Predictive Regressor", "Customer Churn Classifier"] },
      { title: "2. Deep Learning & Computer Vision / NLP", description: "Neural network backpropagation, CNN architectures, RNNs, and Attention mechanisms.", topics: ["PyTorch", "TensorFlow", "CNNs", "RNN/LSTM", "Transformers"], recommended_projects: ["Medical Imaging X-Ray Classifier", "Sentiment Analysis Pipeline"] },
      { title: "3. Large Language Models & GenAI", description: "Tokenization, Prompt Engineering, Retrieval-Augmented Generation (RAG), and LoRA fine-tuning.", topics: ["HuggingFace", "LangChain", "Vector DBs (Pinecone/Milvus)", "Ollama", "LoRA/QLoRA"], recommended_projects: ["Enterprise Knowledge Base RAG", "Autonomous Code Review Agent"] },
      { title: "4. MLOps & Production Model Serving", description: "FastAPI inference serving, model quantization (GGUF), Docker, Triton Inference Server.", topics: ["FastAPI", "vLLM", "Docker", "MLflow", "Kubernetes"], recommended_projects: ["Sub-100ms LLM Streaming API"] }
    ]
  }
];

export type Alumni = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  batch: number;
  college: string;
  skills: string[];
  open_to_mentor: boolean;
  linkedin_url?: string;
  bio: string;
};

export const alumni: Alumni[] = [
  {
    id: "alm-1",
    name: "Priya Sharma",
    avatar: "PS",
    role: "Senior Software Engineer",
    company: "Amazon",
    batch: 2020,
    college: "VNR VJIET",
    skills: ["System Design", "AWS", "Java", "Distributed Systems"],
    open_to_mentor: true,
    bio: "Cracked Amazon off-campus in 2020. Happy to conduct mock interviews and review resumes for 3rd/4th year students."
  },
  {
    id: "alm-2",
    name: "Rohan Verma",
    avatar: "RV",
    role: "Applied AI Research Engineer",
    company: "Microsoft",
    batch: 2021,
    college: "IIIT Hyderabad",
    skills: ["PyTorch", "LLMs", "NLP", "Python"],
    open_to_mentor: true,
    bio: "Working on Azure OpenAI Copilot integrations. Mentoring students passionate about research and machine learning."
  },
  {
    id: "alm-3",
    name: "Ananya Gupta",
    avatar: "AG",
    role: "Senior Product Manager",
    company: "Flipkart",
    batch: 2019,
    college: "IIT Bombay",
    skills: ["Product Strategy", "Growth Metrics", "UI/UX", "A/B Testing"],
    open_to_mentor: true,
    bio: "Ex-APM at Google, now leading checkout conversion at Flipkart. Available for career transitions into PM."
  },
  {
    id: "alm-4",
    name: "Kunal Reddy",
    avatar: "KR",
    role: "Staff Data Scientist",
    company: "Google",
    batch: 2018,
    college: "BITS Hyderabad",
    skills: ["BigQuery", "Statistical Modeling", "Python", "MLOps"],
    open_to_mentor: true,
    bio: "Passionate about helping tier-2/3 college students break into tier-1 tech companies."
  }
];

export type CollegeInquiry = {
  id: string;
  college_id?: string;
  college_name: string;
  student_name: string;
  email: string;
  phone: string;
  tenth_percentage: number;
  twelfth_percentage: number;
  preferred_course: string;
  message?: string;
  status: "new" | "contacted" | "interview_scheduled" | "admitted" | "rejected";
  submitted_at: string;
};

export const mockCollegeInquiries: CollegeInquiry[] = [
  { id: "inq-1", college_name: "VNR VJIET", student_name: "Rahul M.", email: "rahul.m@gmail.com", phone: "+91 98451 22310", tenth_percentage: 95.4, twelfth_percentage: 92.0, preferred_course: "Computer Science and Engineering", message: "Interested in hostel accommodations and scholarship availability.", status: "new", submitted_at: "2026-09-18T10:30:00Z" },
  { id: "inq-2", college_name: "VNR VJIET", student_name: "Sneha Rao", email: "sneha.rao@yahoo.com", phone: "+91 98765 43210", tenth_percentage: 91.2, twelfth_percentage: 89.5, preferred_course: "Artificial Intelligence & Data Science", message: "Can I get fee waiver details for state top rankers?", status: "contacted", submitted_at: "2026-09-17T14:15:00Z" },
  { id: "inq-3", college_name: "IIT Bombay", student_name: "Aditya Verma", email: "aditya.v@outlook.com", phone: "+91 91234 56780", tenth_percentage: 98.0, twelfth_percentage: 96.4, preferred_course: "Computer Science and Engineering", message: "JoSAA round 1 branch change options inquiry.", status: "interview_scheduled", submitted_at: "2026-09-16T09:00:00Z" }
];

export type RecruiterApplicant = {
  id: string;
  internship_id: string;
  internship_title: string;
  candidate_name: string;
  candidate_email: string;
  college_name: string;
  degree: string;
  cgpa: number;
  graduation_year: number;
  skills: string[];
  resume_url: string;
  status: "applied" | "screening" | "shortlisted" | "interview" | "hired" | "rejected";
  applied_at: string;
};

export const mockRecruiterApplicants: RecruiterApplicant[] = [
  { id: "app-1", internship_id: "int-1", internship_title: "Software Development Engineer (SDE) Intern", candidate_name: "Kiran Kumar", candidate_email: "kiran.k@educonnect.dev", college_name: "VNR VJIET", degree: "B.Tech CSE", cgpa: 9.1, graduation_year: 2026, skills: ["Java", "DSA", "AWS", "Spring Boot"], resume_url: "https://example.com/resume_kiran.pdf", status: "shortlisted", applied_at: "2026-09-15T11:20:00Z" },
  { id: "app-2", internship_id: "int-1", internship_title: "Software Development Engineer (SDE) Intern", candidate_name: "Divya N.", candidate_email: "divya.n@educonnect.dev", college_name: "IIIT Hyderabad", degree: "B.Tech CSE", cgpa: 9.4, graduation_year: 2026, skills: ["C++", "DSA", "Distributed Systems"], resume_url: "https://example.com/resume_divya.pdf", status: "interview", applied_at: "2026-09-14T16:45:00Z" },
  { id: "app-3", internship_id: "int-3", internship_title: "AI Research & Applied ML Intern", candidate_name: "Arunav Sen", candidate_email: "arunav.s@educonnect.dev", college_name: "IIT Bombay", degree: "B.Tech EE", cgpa: 8.9, graduation_year: 2026, skills: ["Python", "PyTorch", "Transformers", "RAG"], resume_url: "https://example.com/resume_arunav.pdf", status: "screening", applied_at: "2026-09-16T08:10:00Z" }
];

export const stats = {
  colleges: 12500,
  internships: 8400,
  workshops: 320,
  alumni: 42000,
  active_students: 4500000,
  partner_companies: 520,
  scholarship_pool_cr: 120
};

export const domains = ["Software", "AI/ML", "Data", "Web", "Mobile", "Cloud", "Cybersecurity", "Product", "Embedded"];
export const states = ["Telangana", "Andhra Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh", "West Bengal", "Gujarat"];
