import { PageHeader } from "@/components/ui/PageHeader";
import { alumni } from "@/lib/mock";
import { AlumniClient } from "@/components/alumni/AlumniClient";

export const metadata = {
  title: "1:1 Alumni Mentorship Hub — JoinSchooling",
  description: "Book 1:1 sessions with verified software engineers, product managers, and alumni from Google, Amazon, Microsoft, and IITs.",
};

export default function MentorshipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Verified Alumni & Industry Experts"
        title="1:1 Alumni Mentorship Hub"
        subtitle="Schedule 1:1 sessions for resume reviews, technical mock interviews, placement guidance, and company referrals with verified industry leaders."
      />
      <div className="container-page py-10">
        <AlumniClient mentors={alumni} />
      </div>
    </>
  );
}
