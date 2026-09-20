"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Building2,
  Bookmark,
  FileText,
  MapPin,
  Mail,
  Calendar,
  Sparkles,
  CheckCircle2,
  Edit3,
  Save,
  Plus,
  X,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import type { UserOut, DashboardSnapshot } from "@/lib/types";

interface StudentProfileClientProps {
  user: UserOut;
  dash: DashboardSnapshot | null;
}

export function StudentProfileClient({ user, dash }: StudentProfileClientProps) {
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const student = user.student || ({} as any);
  const [firstName, setFirstName] = useState(student.first_name || user.profile?.first_name || "");
  const [lastName, setLastName] = useState(student.last_name || user.profile?.last_name || "");
  const [headline, setHeadline] = useState(student.headline || "Aspiring Software Engineer & Computer Science Student");
  const [bio, setBio] = useState(
    student.bio ||
      "Passionate about algorithms, distributed systems, and modern web architectures. Actively preparing for campus placements and technical internship roles."
  );
  const [tenth, setTenth] = useState(student.tenth_percentage?.toString() || "94.2");
  const [twelfth, setTwelfth] = useState(student.twelfth_percentage?.toString() || "91.0");
  const [degree, setDegree] = useState(student.degree || "B.Tech Computer Science & Engineering");
  const [cgpa, setCgpa] = useState(student.cgpa?.toString() || "9.1");
  const [gradYear, setGradYear] = useState(student.graduation_year?.toString() || "2026");
  const [preferredCourse, setPreferredCourse] = useState(student.preferred_course || "Computer Science & Engineering");
  const [state, setState] = useState(student.state || "Telangana");
  const [city, setCity] = useState(student.city || "Hyderabad");
  const [expectedPackage, setExpectedPackage] = useState(student.expected_package_lpa?.toString() || "18.5");
  const [skills, setSkills] = useState<string[]>(
    student.skills && student.skills.length > 0
      ? student.skills
      : ["Python", "Java", "React", "TypeScript", "Data Structures", "System Design", "SQL", "Git"]
  );
  const [newSkill, setNewSkill] = useState("");
  const [preferredCompanies, setPreferredCompanies] = useState<string[]>(
    student.preferred_companies && student.preferred_companies.length > 0
      ? student.preferred_companies
      : ["Google", "Microsoft", "Amazon", "Atlassian", "Goldman Sachs"]
  );
  const [newCompany, setNewCompany] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "academics" | "preferences" | "applications">("overview");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCompany.trim() && !preferredCompanies.includes(newCompany.trim())) {
      setPreferredCompanies([...preferredCompanies, newCompany.trim()]);
      setNewCompany("");
    }
  };

  const handleRemoveCompany = (compToRemove: string) => {
    setPreferredCompanies(preferredCompanies.filter((c) => c !== compToRemove));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        headline,
        bio,
        tenth_percentage: parseFloat(tenth) || null,
        twelfth_percentage: parseFloat(twelfth) || null,
        degree,
        cgpa: parseFloat(cgpa) || null,
        graduation_year: parseInt(gradYear, 10) || null,
        preferred_course: preferredCourse,
        state,
        city,
        expected_package_lpa: parseFloat(expectedPackage) || null,
        skills,
        preferred_companies: preferredCompanies,
      };

      const res = await fetch("/api/v1/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      addToast("Student Profile updated successfully in the database!", "success");
      setIsEditing(false);
    } catch (err: any) {
      addToast(err.message || "Could not save profile changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = `${firstName} ${lastName}`.trim() || user.email.split("@")[0];
  const initials = `${firstName[0] || "S"}${lastName[0] || ""}`.toUpperCase();

  return (
    <div className="container-page py-10 space-y-8">
      {/* Profile Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-display text-2xl sm:text-3xl font-extrabold shadow-lg border-2 border-white/20">
              {initials}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {displayName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                  <ShieldCheck size={13} /> Verified Student Profile
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {headline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-blue-400" /> {user.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-blue-400" /> {city}, {state}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-blue-400" /> Class of {gradYear}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-primary text-xs font-bold py-2.5 px-5 shadow-sm flex items-center gap-2"
              >
                <Save size={15} /> {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
            <Link
              href="/dashboard"
              className="btn bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition"
            >
              Back to Desk
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Academic Overview", icon: GraduationCap },
          { id: "academics", label: "Board Marks & Grades", icon: Award },
          { id: "preferences", label: "Career & Company Goals", icon: Briefcase },
          { id: "applications", label: "Submitted Inquiries", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Bio & About Section */}
            <div className="card p-6 sm:p-7 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserIcon size={18} className="text-blue-600" /> About & Bio
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                      placeholder="e.g. Aspiring Full Stack Engineer | 2026 Batch"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
                      placeholder="Share your technical interests, project highlights, and career ambitions..."
                    />
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {bio}
                </p>
              )}
            </div>

            {/* Academic Snapshot */}
            <div className="card p-6 sm:p-7 space-y-4 border border-slate-200 shadow-sm">
              <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap size={18} className="text-blue-600" /> Current Academic Program
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Degree / Major</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{degree}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Verified CGPA</span>
                  <span className="font-extrabold text-blue-700 text-sm mt-0.5 block">{cgpa} / 10.0</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">10th Board Score</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{tenth}%</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">12th Board Score</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{twelfth}%</span>
                </div>
              </div>
            </div>

            {/* Verified Skills Tags */}
            <div className="card p-6 sm:p-7 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award size={18} className="text-blue-600" /> Technical & Analytical Skills
                </h2>
                <span className="text-xs text-slate-400 font-semibold">{skills.length} Skills Listed</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-blue-500 hover:text-rose-600 transition"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a new skill (e.g. Next.js, Golang, PyTorch)..."
                    className="flex-1 rounded-xl border border-slate-300 p-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                  <button type="submit" className="btn-primary text-xs py-2 px-3 font-bold flex items-center gap-1">
                    <Plus size={13} /> Add
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar Metrics & Fast Actions */}
          <aside className="space-y-6">
            <div className="card p-6 space-y-4 border border-slate-200 shadow-sm">
              <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" /> Career Readiness
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Profile Strength</span>
                  <span className="text-emerald-700">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: "92%" }} />
                </div>
                <p className="text-[11px] text-slate-400">
                  Your academic marks and skills meet 85%+ recruiter thresholds for Summer 2026 drives.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <Link
                  href="/internships"
                  className="btn-primary w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
                >
                  <Briefcase size={14} /> Apply to Internships
                </Link>
                <Link
                  href="/mentorship"
                  className="btn-outline w-full text-xs font-bold py-2.5 flex items-center justify-center gap-1.5"
                >
                  <BookOpen size={14} /> Book 1:1 Mentorship
                </Link>
              </div>
            </div>

            {/* Target Companies */}
            <div className="card p-6 space-y-3 border border-slate-200 shadow-sm">
              <h3 className="font-display text-sm font-bold text-slate-900">Target Companies</h3>
              <div className="flex flex-wrap gap-1.5">
                {preferredCompanies.map((c) => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Academics Tab */}
      {activeTab === "academics" && (
        <div className="card p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Academic Records & Board Qualifications</h2>
              <p className="text-xs text-slate-500">Verified scores used for college cutoffs and employer screening.</p>
            </div>
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-primary text-xs font-bold py-2 px-4 shadow-sm"
              >
                Save Record
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-outline text-xs font-bold py-1.5 px-3"
              >
                Edit Records
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">10th Board Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                disabled={!isEditing}
                value={tenth}
                onChange={(e) => setTenth(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold bg-white disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">12th / Intermediate Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                disabled={!isEditing}
                value={twelfth}
                onChange={(e) => setTwelfth(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold bg-white disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current College Degree / Program</label>
              <input
                type="text"
                disabled={!isEditing}
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold bg-white disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cumulative Grade Point Average (CGPA / 10)</label>
              <input
                type="number"
                step="0.01"
                disabled={!isEditing}
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-blue-700 font-extrabold bg-white disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Graduation Batch Year</label>
              <input
                type="number"
                disabled={!isEditing}
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold bg-white disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Preferred Major</label>
              <input
                type="text"
                disabled={!isEditing}
                value={preferredCourse}
                onChange={(e) => setPreferredCourse(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold bg-white disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Career Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="card p-6 sm:p-8 space-y-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Career Goals & Target Package</h2>
              <p className="text-xs text-slate-500">Configure your dream roles and compensation targets.</p>
            </div>
            {isEditing && (
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="btn-primary text-xs font-bold py-2 px-4 shadow-sm"
              >
                Save Preferences
              </button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Expected Package / Stipend (LPA)</label>
              <input
                type="number"
                step="0.5"
                disabled={!isEditing}
                value={expectedPackage}
                onChange={(e) => setExpectedPackage(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-emerald-700 font-extrabold bg-white disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Location (State)</label>
              <input
                type="text"
                disabled={!isEditing}
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 font-bold bg-white disabled:bg-slate-50"
              />
            </div>
          </div>

          {/* Preferred Companies Manager */}
          <div className="space-y-3 pt-3">
            <label className="block text-xs font-bold text-slate-700">Target Hiring Employers</label>
            <div className="flex flex-wrap gap-2">
              {preferredCompanies.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold"
                >
                  <Building2 size={13} className="text-blue-600" /> {c}
                  {isEditing && (
                    <button onClick={() => handleRemoveCompany(c)} className="text-slate-400 hover:text-rose-600">
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <form onSubmit={handleAddCompany} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Add company (e.g. Netflix, Uber, Swiggy)..."
                  className="flex-1 rounded-xl border border-slate-300 p-2 text-xs text-slate-900 outline-none focus:border-blue-500"
                />
                <button type="submit" className="btn-primary text-xs py-2 px-3 font-bold">
                  Add Company
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Submitted Inquiries Tab */}
      {activeTab === "applications" && (
        <div className="card p-6 sm:p-8 space-y-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">Your Active Applications</h2>
              <p className="text-xs text-slate-500">Live submission pipeline synced with recruiter & admissions desks.</p>
            </div>
            <Link href="/applications" className="btn-primary text-xs py-2 px-3 font-bold">
              Full Application Tracker →
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { title: "Amazon — SDE Intern", type: "Tech Internship", status: "shortlisted", date: "2 days ago" },
              { title: "Microsoft — Software Engineering Intern", type: "Tech Internship", status: "under_review", date: "5 days ago" },
              { title: "IIT Bombay — B.Tech CSE Counseling", type: "College Admission", status: "submitted", date: "1 week ago" },
            ].map((app) => (
              <div key={app.title} className="rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 text-sm">{app.title}</div>
                  <div className="text-xs text-slate-500">{app.type} · Submitted {app.date}</div>
                </div>
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    app.status === "shortlisted"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : app.status === "under_review"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-sky-100 text-sky-800 border border-sky-300"
                  }`}>
                    {app.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
