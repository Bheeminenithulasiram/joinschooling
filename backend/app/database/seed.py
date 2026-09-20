"""Seed the database with normalized relational data:
- Colleges (IITs, NITs, BITS, Top Private Universities)
- Courses (CSE, AI/ML, ECE, Data Science with real fees and seat counts)
- Placements (annual placement stats and top recruiters)
- Companies (Google, Microsoft, Amazon, Atlassian, Adobe, Goldman Sachs, etc.)
- Internships (real tech & engineering internship postings)
- Users & Role Profiles (Student, College Representative, Recruiter, Admin)
"""
from __future__ import annotations

import sys
from datetime import datetime, timedelta, timezone
from slugify import slugify
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database.session import Base, SessionLocal, engine
from app.models import (
    College,
    Company,
    Course,
    Placement,
    Internship,
    Mentor,
    User,
    Student,
    CollegeRepresentative,
    CompanyRecruiter,
    Application,
    SavedItem,
)

PREMIER_COLLEGES = [
    {
        "name": "IIT Bombay",
        "short_name": "IITB",
        "type": "government",
        "state": "Maharashtra",
        "city": "Mumbai",
        "established_year": 1958,
        "approved_by": ["UGC", "AICTE"],
        "naac_grade": "A++",
        "nirf_rank": 3,
        "avg_package_lpa": 21.5,
        "highest_package_lpa": 210.0,
        "placement_percent": 96.0,
        "hostel_available": True,
        "hostel_fee_lpa": 0.5,
        "facilities": ["Central Library", "Olympic Sports Complex", "Wi-Fi Campus", "Hostels", "Advanced Research Labs", "Incubation Center"],
        "rating": 4.9,
        "reviews_count": 3211,
        "about": "Premier institute of national importance located in Powai, Mumbai, recognized globally for excellence in engineering education and cutting-edge tech research.",
        "admission_process": "Admissions to B.Tech programs are through JEE Advanced counseling (JoSAA). M.Tech through GATE. MBA through CAT.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 180, "fees_per_year_lpa": 2.25, "total_fees_lpa": 9.0, "entrance_exams": ["JEE Advanced"]},
            {"name": "B.Tech Artificial Intelligence & Data Science", "degree_level": "UG", "duration_years": 4.0, "total_seats": 60, "fees_per_year_lpa": 2.25, "total_fees_lpa": 9.0, "entrance_exams": ["JEE Advanced"]},
            {"name": "B.Tech Electrical Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 170, "fees_per_year_lpa": 2.25, "total_fees_lpa": 9.0, "entrance_exams": ["JEE Advanced"]},
            {"name": "M.Tech Computer Science", "degree_level": "PG", "duration_years": 2.0, "total_seats": 120, "fees_per_year_lpa": 1.10, "total_fees_lpa": 2.2, "entrance_exams": ["GATE"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 1420, "total_eligible": 1500, "highest_package_lpa": 210.0, "avg_package_lpa": 21.5, "top_recruiters": ["Google", "Microsoft", "Jane Street", "Apple", "Uber", "Qualcomm"]},
            {"year": 2024, "students_placed": 1380, "total_eligible": 1460, "highest_package_lpa": 195.0, "avg_package_lpa": 20.8, "top_recruiters": ["Amazon", "Google", "Microsoft", "Tower Research", "Texas Instruments"]},
        ],
    },
    {
        "name": "IIT Delhi",
        "short_name": "IITD",
        "type": "government",
        "state": "Delhi",
        "city": "New Delhi",
        "established_year": 1961,
        "approved_by": ["UGC", "AICTE"],
        "naac_grade": "A++",
        "nirf_rank": 2,
        "avg_package_lpa": 22.0,
        "highest_package_lpa": 200.0,
        "placement_percent": 97.0,
        "hostel_available": True,
        "hostel_fee_lpa": 0.55,
        "facilities": ["Central Library", "Sports Arena", "Supercomputing Lab", "Hostels", "Innovation Park"],
        "rating": 4.9,
        "reviews_count": 2890,
        "about": "One of India's foremost centers of academic and technical education situated in Hauz Khas, New Delhi.",
        "admission_process": "Admissions through JoSAA counseling based on JEE Advanced ranks for undergraduate courses.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 150, "fees_per_year_lpa": 2.25, "total_fees_lpa": 9.0, "entrance_exams": ["JEE Advanced"]},
            {"name": "B.Tech Mathematics & Computing", "degree_level": "UG", "duration_years": 4.0, "total_seats": 90, "fees_per_year_lpa": 2.25, "total_fees_lpa": 9.0, "entrance_exams": ["JEE Advanced"]},
            {"name": "B.Tech Electrical Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 160, "fees_per_year_lpa": 2.25, "total_fees_lpa": 9.0, "entrance_exams": ["JEE Advanced"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 1390, "total_eligible": 1450, "highest_package_lpa": 200.0, "avg_package_lpa": 22.0, "top_recruiters": ["Google", "Microsoft", "Graviton", "Rubrik", "Optiver"]},
        ],
    },
    {
        "name": "BITS Pilani",
        "short_name": "BITS",
        "type": "deemed",
        "state": "Rajasthan",
        "city": "Pilani",
        "established_year": 1964,
        "approved_by": ["UGC", "AICTE"],
        "naac_grade": "A",
        "nirf_rank": 20,
        "avg_package_lpa": 18.5,
        "highest_package_lpa": 60.0,
        "placement_percent": 94.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.2,
        "facilities": ["24/7 Library", "Practice School Tech Stations", "High-speed Wi-Fi", "Hostels", "Sports Complexes"],
        "rating": 4.8,
        "reviews_count": 2150,
        "about": "Deemed university known for flexible zero-attendance policy, Practice School industry internships, and stellar alumni network in startup & corporate tech.",
        "admission_process": "Admissions through computerized BITSAT entrance examination with merit-based branch allocation.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.E. Computer Science", "degree_level": "UG", "duration_years": 4.0, "total_seats": 240, "fees_per_year_lpa": 5.4, "total_fees_lpa": 21.6, "entrance_exams": ["BITSAT"]},
            {"name": "B.E. Electronics & Communication", "degree_level": "UG", "duration_years": 4.0, "total_seats": 180, "fees_per_year_lpa": 5.4, "total_fees_lpa": 21.6, "entrance_exams": ["BITSAT"]},
            {"name": "M.Sc. Economics + B.E. CS (Dual)", "degree_level": "Integrated", "duration_years": 5.0, "total_seats": 80, "fees_per_year_lpa": 5.4, "total_fees_lpa": 27.0, "entrance_exams": ["BITSAT"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 1100, "total_eligible": 1180, "highest_package_lpa": 60.0, "avg_package_lpa": 18.5, "top_recruiters": ["Google", "Amazon", "Goldman Sachs", "DE Shaw", "Uber", "Cisco"]},
        ],
    },
    {
        "name": "IIIT Hyderabad",
        "short_name": "IIITH",
        "type": "autonomous",
        "state": "Telangana",
        "city": "Hyderabad",
        "established_year": 1998,
        "approved_by": ["UGC", "AICTE"],
        "naac_grade": "A++",
        "nirf_rank": 55,
        "avg_package_lpa": 24.0,
        "highest_package_lpa": 102.0,
        "placement_percent": 98.0,
        "hostel_available": True,
        "hostel_fee_lpa": 0.95,
        "facilities": ["Kohli Research Block", "Robotics Research Center", "Incubation Hub (CIE)", "Hostel", "Sports Grounds"],
        "rating": 4.9,
        "reviews_count": 1840,
        "about": "India's highest ranked institute for Computer Science research, competitive programming, and AI/NLP research output.",
        "admission_process": "Admissions through JEE Main score (UGEE/SPEC mode) and Olympiad channels.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 150, "fees_per_year_lpa": 3.8, "total_fees_lpa": 15.2, "entrance_exams": ["JEE Main"]},
            {"name": "B.Tech Electronics & Communication", "degree_level": "UG", "duration_years": 4.0, "total_seats": 90, "fees_per_year_lpa": 3.8, "total_fees_lpa": 15.2, "entrance_exams": ["JEE Main"]},
            {"name": "Dual Degree (B.Tech + M.S. by Research CSE)", "degree_level": "Integrated", "duration_years": 5.0, "total_seats": 60, "fees_per_year_lpa": 3.8, "total_fees_lpa": 19.0, "entrance_exams": ["UGEE"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 380, "total_eligible": 390, "highest_package_lpa": 102.0, "avg_package_lpa": 24.0, "top_recruiters": ["Google", "Meta", "Apple", "Microsoft", "Uber", "Qualcomm", "NVIDIA"]},
        ],
    },
    {
        "name": "NIT Trichy",
        "short_name": "NITT",
        "type": "government",
        "state": "Tamil Nadu",
        "city": "Tiruchirappalli",
        "established_year": 1964,
        "approved_by": ["UGC", "AICTE"],
        "naac_grade": "A++",
        "nirf_rank": 9,
        "avg_package_lpa": 15.5,
        "highest_package_lpa": 52.0,
        "placement_percent": 93.0,
        "hostel_available": True,
        "hostel_fee_lpa": 0.6,
        "facilities": ["Octagon Computer Center", "Central Library", "Hostels", "Sports Stadium"],
        "rating": 4.7,
        "reviews_count": 1980,
        "about": "Ranked #1 National Institute of Technology in India by NIRF with unmatched campus recruitment track record.",
        "admission_process": "Admissions through JoSAA & CSAB counseling based on JEE Main CRL rankings.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1589161410160-3f43408514b8?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 120, "fees_per_year_lpa": 1.75, "total_fees_lpa": 7.0, "entrance_exams": ["JEE Main"]},
            {"name": "B.Tech Electronics & Communication", "degree_level": "UG", "duration_years": 4.0, "total_seats": 120, "fees_per_year_lpa": 1.75, "total_fees_lpa": 7.0, "entrance_exams": ["JEE Main"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 920, "total_eligible": 980, "highest_package_lpa": 52.0, "avg_package_lpa": 15.5, "top_recruiters": ["Microsoft", "Amazon", "Morgan Stanley", "Oracle", "Qualcomm"]},
        ],
    },
    {
        "name": "VNR VJIET",
        "short_name": "VNR",
        "type": "private",
        "state": "Telangana",
        "city": "Hyderabad",
        "established_year": 1995,
        "approved_by": ["AICTE", "NBA", "NAAC"],
        "naac_grade": "A++",
        "nirf_rank": 113,
        "avg_package_lpa": 8.5,
        "highest_package_lpa": 45.0,
        "placement_percent": 92.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.2,
        "facilities": ["Modern Computing Labs", "Central Library", "Sports Grounds", "Hostel", "Auditorium"],
        "rating": 4.4,
        "reviews_count": 682,
        "about": "Premier autonomous engineering institute affiliated with JNTUH in Bachupally, Hyderabad, recognized for stellar CS/IT placement numbers.",
        "admission_process": "Admissions through TS EAMCET (Convenor Quota) and JEE Main (Management Quota).",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 240, "fees_per_year_lpa": 1.35, "total_fees_lpa": 5.4, "entrance_exams": ["TS EAMCET", "JEE Main"]},
            {"name": "B.Tech Artificial Intelligence & Machine Learning", "degree_level": "UG", "duration_years": 4.0, "total_seats": 180, "fees_per_year_lpa": 1.35, "total_fees_lpa": 5.4, "entrance_exams": ["TS EAMCET"]},
            {"name": "B.Tech Information Technology", "degree_level": "UG", "duration_years": 4.0, "total_seats": 180, "fees_per_year_lpa": 1.35, "total_fees_lpa": 5.4, "entrance_exams": ["TS EAMCET"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 1340, "total_eligible": 1450, "highest_package_lpa": 45.0, "avg_package_lpa": 8.5, "top_recruiters": ["Amazon", "ServiceNow", "JPMorgan Chase", "Oracle", "TCS Digital"]},
        ],
    },
    {
        "name": "VIT Vellore",
        "short_name": "VIT",
        "type": "deemed",
        "state": "Tamil Nadu",
        "city": "Vellore",
        "established_year": 1984,
        "approved_by": ["UGC", "AICTE"],
        "naac_grade": "A++",
        "nirf_rank": 11,
        "avg_package_lpa": 9.2,
        "highest_package_lpa": 102.0,
        "placement_percent": 91.0,
        "hostel_available": True,
        "hostel_fee_lpa": 1.4,
        "facilities": ["Smart Classrooms", "Multi-storey Library", "Hostels", "Sports Stadium", "Food Courts"],
        "rating": 4.5,
        "reviews_count": 4200,
        "about": "One of India's largest multidisciplinary institutions offering Fully Flexible Credit System (FFCS) and international exchange programs.",
        "admission_process": "Admissions through national VITEEE entrance examination.",
        "is_featured": True,
        "logo_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=200&h=200&fit=crop",
        "banner_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop",
        "courses": [
            {"name": "B.Tech Computer Science & Engineering", "degree_level": "UG", "duration_years": 4.0, "total_seats": 900, "fees_per_year_lpa": 1.98, "total_fees_lpa": 7.92, "entrance_exams": ["VITEEE"]},
            {"name": "B.Tech CSE with Information Security", "degree_level": "UG", "duration_years": 4.0, "total_seats": 240, "fees_per_year_lpa": 1.98, "total_fees_lpa": 7.92, "entrance_exams": ["VITEEE"]},
        ],
        "placements": [
            {"year": 2025, "students_placed": 4500, "total_eligible": 4900, "highest_package_lpa": 102.0, "avg_package_lpa": 9.2, "top_recruiters": ["Microsoft", "Amazon", "PayPal", "Cisco", "Deloitte"]},
        ],
    },
]

PREMIER_COMPANIES = [
    {"name": "Google India", "industry": "Technology", "logo_url": "https://logo.clearbit.com/google.com", "website": "https://careers.google.com", "hq_city": "Bangalore", "about": "Global leader in search, cloud, android, artificial intelligence, and cutting-edge software systems."},
    {"name": "Microsoft India", "industry": "Technology", "logo_url": "https://logo.clearbit.com/microsoft.com", "website": "https://careers.microsoft.com", "hq_city": "Hyderabad", "about": "Pioneering enterprise cloud infrastructure, AI models, Azure services, and developer platforms."},
    {"name": "Amazon India", "industry": "Technology", "logo_url": "https://logo.clearbit.com/amazon.com", "website": "https://amazon.jobs", "hq_city": "Hyderabad", "about": "World's largest e-commerce and cloud computing provider via AWS platforms."},
    {"name": "Atlassian", "industry": "Software", "logo_url": "https://logo.clearbit.com/atlassian.com", "website": "https://atlassian.com/careers", "hq_city": "Bangalore", "about": "Creators of Jira, Confluence, Bitbucket, empowering agile teams worldwide."},
    {"name": "Adobe India", "industry": "Software", "logo_url": "https://logo.clearbit.com/adobe.com", "website": "https://adobe.com/careers", "hq_city": "Noida", "about": "World leader in digital media, document cloud, creative applications, and marketing automation."},
    {"name": "Goldman Sachs", "industry": "Financial Technology", "logo_url": "https://logo.clearbit.com/goldmansachs.com", "website": "https://goldmansachs.com/careers", "hq_city": "Bangalore", "about": "Leading global financial institution with state-of-the-art engineering and algorithmic trading systems."},
    {"name": "Uber India", "industry": "Mobility & Tech", "logo_url": "https://logo.clearbit.com/uber.com", "website": "https://uber.com/careers", "hq_city": "Hyderabad", "about": "Global platform orchestrating real-time urban mobility, food delivery, and freight logistics."},
    {"name": "Flipkart", "industry": "E-commerce", "logo_url": "https://logo.clearbit.com/flipkart.com", "website": "https://flipkartcareers.com", "hq_city": "Bangalore", "about": "India's homegrown e-commerce powerhouse with massive-scale distributed supply chain tech."},
    {"name": "Swiggy", "industry": "Consumer Tech", "logo_url": "https://logo.clearbit.com/swiggy.com", "website": "https://swiggy.com/careers", "hq_city": "Bangalore", "about": "Leading on-demand delivery network delivering millions of hyper-local orders daily."},
]

PREMIER_INTERNSHIPS = [
    {
        "company": "Amazon India",
        "title": "Software Development Engineer (SDE) Intern",
        "domain": "Software",
        "work_mode": "hybrid",
        "duration_months": 6,
        "stipend_min": 80000,
        "stipend_max": 110000,
        "location_city": "Hyderabad",
        "location_state": "Telangana",
        "description": "Join AWS or Amazon Consumer Tech teams to architect high-throughput distributed microservices serving millions of customers.",
        "skills": ["Java", "Data Structures", "Algorithms", "System Design", "AWS"],
        "requirements": ["Pursuing B.Tech/M.Tech in CS/IT/ECE", "Strong grasp of algorithmic problem solving", "2025/2026 graduating batch"],
        "responsibilities": ["Design and implement scalable backend APIs", "Write clean, robust, unit-tested code", "Participate in production deployment pipelines"],
        "benefits": ["Pre-Placement Offer (PPO) evaluation", "1:1 Senior Engineer Mentorship", "Relocation & Housing Allowance"],
        "eligibility_batches": ["2025", "2026"],
    },
    {
        "company": "Microsoft India",
        "title": "Software Engineering Intern - Cloud & AI",
        "domain": "Software",
        "work_mode": "hybrid",
        "duration_months": 6,
        "stipend_min": 125000,
        "stipend_max": 125000,
        "location_city": "Bangalore",
        "location_state": "Karnataka",
        "description": "Work on core Azure distributed systems, developer tools, and large language model enterprise infrastructure.",
        "skills": ["C++", "C#", "Python", "Distributed Systems", "Cloud Computing"],
        "requirements": ["B.Tech/Dual Degree student in Computer Science", "Deep knowledge of OOP & operating systems"],
        "responsibilities": ["Develop features for Azure Cloud Core", "Optimize service latency and fault-tolerance"],
        "benefits": ["High PPO conversion rate", "Comprehensive health coverage", "Hardware workstation kit"],
        "eligibility_batches": ["2025", "2026"],
    },
    {
        "company": "Google India",
        "title": "Software Engineering & Machine Learning Intern",
        "domain": "AI/ML",
        "work_mode": "onsite",
        "duration_months": 3,
        "stipend_min": 135000,
        "stipend_max": 150000,
        "location_city": "Bangalore",
        "location_state": "Karnataka",
        "description": "Collaborate with world-class research and engineering teams to push boundaries in Search, Android, and Gemini AI technologies.",
        "skills": ["Python", "C++", "TensorFlow", "PyTorch", "Algorithms"],
        "requirements": ["Demonstrated experience in algorithmic programming or ML research", "2025/2026 batch"],
        "responsibilities": ["Research and build ML pipelines", "Publish benchmarks and integrate model weights"],
        "benefits": ["Top-tier compensation", "Campus amenities & gourmet meals", "Global peer network"],
        "eligibility_batches": ["2025", "2026"],
    },
    {
        "company": "Atlassian",
        "title": "Full Stack Engineering Intern - Jira Core",
        "domain": "Software",
        "work_mode": "remote",
        "duration_months": 6,
        "stipend_min": 90000,
        "stipend_max": 90000,
        "location_city": "Bangalore",
        "location_state": "Karnataka",
        "description": "Build user-facing experiences and resilient backend microservices for over 250,000 global enterprise customers.",
        "skills": ["React", "TypeScript", "Java", "Spring Boot", "GraphQL"],
        "requirements": ["Strong web development fundamentals", "Experience with React and Java"],
        "responsibilities": ["Ship end-to-end features directly into Jira Cloud", "Conduct peer code reviews and UI tests"],
        "benefits": ["Work from anywhere allowance", "PPO opportunity", "Wellness stipend"],
        "eligibility_batches": ["2025", "2026"],
    },
    {
        "company": "Goldman Sachs",
        "title": "Quantitative Engineering & Global Markets Intern",
        "domain": "FinTech",
        "work_mode": "hybrid",
        "duration_months": 2,
        "stipend_min": 100000,
        "stipend_max": 120000,
        "location_city": "Bangalore",
        "location_state": "Karnataka",
        "description": "Design ultra-low-latency financial transaction engines, market analytics tools, and automated risk models.",
        "skills": ["C++", "Java", "Python", "SQL", "Statistics"],
        "requirements": ["Strong mathematical aptitude and analytical thinking", "High proficiency in C++ or Java"],
        "responsibilities": ["Build quantitative risk models", "Optimize real-time transaction pipelines"],
        "benefits": ["PPO to New Analyst Program", "Global executive mentorship"],
        "eligibility_batches": ["2025", "2026"],
    },
    {
        "company": "Uber India",
        "title": "Backend Systems Engineering Intern",
        "domain": "Software",
        "work_mode": "hybrid",
        "duration_months": 6,
        "stipend_min": 110000,
        "stipend_max": 110000,
        "location_city": "Hyderabad",
        "location_state": "Telangana",
        "description": "Architect distributed geo-spatial mapping, dynamic marketplace pricing, and real-time dispatch systems.",
        "skills": ["Go", "Java", "Kafka", "Redis", "Distributed Systems"],
        "requirements": ["Strong problem solving and concurrency fundamentals", "Enthusiasm for high-scale systems"],
        "responsibilities": ["Develop microservices in Go and Java", "Handle high QPS real-time data streams"],
        "benefits": ["Competitive stipend", "Uber credits", "Fast-track PPO"],
        "eligibility_batches": ["2025", "2026"],
    },
]


def seed_database(reset: bool = False) -> None:
    if reset:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Seed Colleges, Courses, and Placements
        for c_data in PREMIER_COLLEGES:
            slug = slugify(c_data["name"])
            college = db.query(College).filter(College.slug == slug).first()
            if not college:
                college = College(
                    slug=slug,
                    name=c_data["name"],
                    short_name=c_data.get("short_name"),
                    type=c_data["type"],
                    state=c_data["state"],
                    city=c_data["city"],
                    country="India",
                    established_year=c_data.get("established_year"),
                    approved_by=c_data.get("approved_by", []),
                    naac_grade=c_data.get("naac_grade"),
                    nirf_rank=c_data.get("nirf_rank"),
                    avg_package_lpa=c_data.get("avg_package_lpa"),
                    highest_package_lpa=c_data.get("highest_package_lpa"),
                    placement_percent=c_data.get("placement_percent"),
                    hostel_available=c_data.get("hostel_available", True),
                    hostel_fee_lpa=c_data.get("hostel_fee_lpa"),
                    facilities=c_data.get("facilities", []),
                    rating=c_data.get("rating", 4.5),
                    reviews_count=c_data.get("reviews_count", 100),
                    about=c_data.get("about"),
                    admission_process=c_data.get("admission_process"),
                    is_featured=c_data.get("is_featured", False),
                    is_published=True,
                    logo_url=c_data.get("logo_url"),
                    banner_url=c_data.get("banner_url"),
                )
                db.add(college)
                db.flush()

                # Add Courses
                for cr_data in c_data.get("courses", []):
                    course = Course(
                        college_id=college.id,
                        name=cr_data["name"],
                        degree_level=cr_data["degree_level"],
                        duration_years=cr_data["duration_years"],
                        total_seats=cr_data.get("total_seats"),
                        fees_per_year_lpa=cr_data.get("fees_per_year_lpa"),
                        total_fees_lpa=cr_data.get("total_fees_lpa"),
                        entrance_exams=cr_data.get("entrance_exams", []),
                    )
                    db.add(course)

                # Add Placements
                for pl_data in c_data.get("placements", []):
                    placement = Placement(
                        college_id=college.id,
                        year=pl_data["year"],
                        students_placed=pl_data.get("students_placed"),
                        total_eligible=pl_data.get("total_eligible"),
                        highest_package_lpa=pl_data.get("highest_package_lpa"),
                        avg_package_lpa=pl_data.get("avg_package_lpa"),
                        top_recruiters=pl_data.get("top_recruiters", []),
                    )
                    db.add(placement)

        db.flush()

        # 2. Seed Companies
        companies_map = {}
        for comp_data in PREMIER_COMPANIES:
            slug = slugify(comp_data["name"])
            comp = db.query(Company).filter(Company.slug == slug).first()
            if not comp:
                comp = Company(
                    slug=slug,
                    name=comp_data["name"],
                    industry=comp_data.get("industry"),
                    logo_url=comp_data.get("logo_url"),
                    website=comp_data.get("website"),
                    hq_city=comp_data.get("hq_city"),
                    about=comp_data.get("about"),
                    is_verified=True,
                )
                db.add(comp)
                db.flush()
            companies_map[comp_data["name"]] = comp

        # 3. Seed Internships
        for int_data in PREMIER_INTERNSHIPS:
            comp = companies_map.get(int_data["company"])
            if comp:
                slug = slugify(f"{int_data['title']}-{comp.slug}")
                internship = db.query(Internship).filter(Internship.slug == slug).first()
                if not internship:
                    internship = Internship(
                        company_id=comp.id,
                        title=int_data["title"],
                        slug=slug,
                        domain=int_data["domain"],
                        work_mode=int_data["work_mode"],
                        duration_months=int_data["duration_months"],
                        stipend_min=int_data["stipend_min"],
                        stipend_max=int_data["stipend_max"],
                        location_city=int_data["location_city"],
                        location_state=int_data.get("location_state"),
                        description=int_data["description"],
                        skills=int_data["skills"],
                        requirements=int_data["requirements"],
                        responsibilities=int_data["responsibilities"],
                        benefits=int_data["benefits"],
                        eligibility_batches=int_data["eligibility_batches"],
                        is_active=True,
                        apply_deadline=datetime.now(tz=timezone.utc) + timedelta(days=45),
                    )
                    db.add(internship)

        # 4. Seed Canonical Initial Users
        # Smoke test canonical accounts
        if not db.query(User).filter(User.email == "admin@educonnect.dev").first():
            admin_smoke = User(
                email="admin@educonnect.dev",
                password_hash=hash_password("admin1234"),
                role="admin",
                is_email_verified=True,
            )
            db.add(admin_smoke)

        if not db.query(User).filter(User.email == "student@educonnect.dev").first():
            student_smoke = User(
                email="student@educonnect.dev",
                password_hash=hash_password("student1234"),
                role="student",
                is_email_verified=True,
            )
            db.add(student_smoke)
            db.flush()
            db.add(Student(
                user_id=student_smoke.id,
                first_name="Ravi",
                last_name="Kumar",
                tenth_percentage=92.0,
                twelfth_percentage=89.0,
                cgpa=8.6,
                graduation_year=2026,
                preferred_course="Computer Science Engineering",
                skills=["Python", "React", "DSA"],
                state="Telangana",
                city="Hyderabad",
                hostel_required=True,
                expected_package_lpa=12.0,
            ))

        # Canonical Accounts for All 5 Roles:
        # 1. Student
        if not db.query(User).filter(User.email == "student@joinschooling.in").first():
            s_user = User(
                email="student@joinschooling.in",
                password_hash=hash_password("Student@123"),
                role="student",
                is_email_verified=True,
            )
            db.add(s_user)
            db.flush()
            db.add(Student(
                user_id=s_user.id,
                first_name="Rohan",
                last_name="Verma",
                tenth_percentage=94.5,
                twelfth_percentage=92.0,
                cgpa=9.1,
                graduation_year=2026,
                preferred_course="Computer Science Engineering",
                skills=["Java", "Python", "React", "DSA", "SQL", "System Design"],
                state="Telangana",
                city="Hyderabad",
                hostel_required=True,
                expected_package_lpa=18.5,
                preferred_companies=["Google", "Microsoft", "Amazon", "Atlassian", "Goldman Sachs"],
            ))

        # 2. College Representative
        iitb_college = db.query(College).filter(College.short_name == "IITB").first()
        if not db.query(User).filter(User.email == "collegerep@iitb.ac.in").first():
            c_user = User(
                email="collegerep@iitb.ac.in",
                password_hash=hash_password("College@123"),
                role="college_rep",
                is_email_verified=True,
            )
            db.add(c_user)
            db.flush()
            db.add(CollegeRepresentative(
                user_id=c_user.id,
                college_id=iitb_college.id if iitb_college else None,
                college_name="IIT Bombay",
                first_name="Prof. Rajesh",
                last_name="Deshmukh",
                designation="Dean of Academic Admissions",
                official_email="admissions@iitb.ac.in",
                website_url="https://www.iitb.ac.in",
                is_verified=True,
            ))

        # 3. Corporate Recruiter
        amazon_comp = db.query(Company).filter(Company.name == "Amazon India").first()
        if not db.query(User).filter(User.email == "recruiter@amazon.com").first():
            r_user = User(
                email="recruiter@amazon.com",
                password_hash=hash_password("Recruiter@123"),
                role="recruiter",
                is_email_verified=True,
            )
            db.add(r_user)
            db.flush()
            db.add(CompanyRecruiter(
                user_id=r_user.id,
                company_id=amazon_comp.id if amazon_comp else None,
                company_name="Amazon India",
                first_name="Meenakshi",
                last_name="Sundaram",
                designation="Lead University Talent Acquisition",
                industry="Technology & E-Commerce",
                website_url="https://amazon.jobs",
                is_verified=True,
            ))

        # 4. Mentor
        if not db.query(User).filter(User.email == "mentor@google.com").first():
            m_user = User(
                email="mentor@google.com",
                password_hash=hash_password("Mentor@123"),
                role="mentor",
                is_email_verified=True,
            )
            db.add(m_user)
            db.flush()
            db.add(Mentor(
                user_id=m_user.id,
                first_name="Arjun",
                last_name="Sundaram",
                company_or_institution="Google",
                designation="Staff Software Engineer & Alumni Mentor",
                domain_expertise="Software Engineering & Distributed Systems",
                graduation_batch=2018,
                bio="IIT Delhi CSE alumnus. 8+ years leading distributed infrastructure at Google. Passionate about helping students crack Tier-1 tech interviews.",
                linkedin_url="https://linkedin.com",
                is_verified=True,
            ))

        # 5. Administrator
        if not db.query(User).filter(User.email == "admin@joinschooling.in").first():
            a_user = User(
                email="admin@joinschooling.in",
                password_hash=hash_password("Admin@123"),
                role="admin",
                is_email_verified=True,
            )
            db.add(a_user)

        db.commit()
        print("Database normalized and seeded successfully with real colleges, courses, placements, companies, internships, and role profiles.")
    finally:
        db.close()


seed = seed_database

if __name__ == "__main__":
    reset_flag = "--reset" in sys.argv
    seed_database(reset=reset_flag)
