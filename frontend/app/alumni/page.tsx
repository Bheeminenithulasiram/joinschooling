import { PageHeader } from "@/components/ui/PageHeader";
import { alumni } from "@/lib/mock";
import { AlumniClient } from "@/components/alumni/AlumniClient";

export default function AlumniPage() {
  return (
    <>
      <PageHeader
        eyebrow="42,000+ Verified Mentors"
        title="Alumni & Industry Mentors"
        subtitle="Connect 1-on-1 with alumni who've walked the path. Get resume reviews, mock interviews, career guidance, and company referrals."
      />
      <div className="container-page py-10">
        <AlumniClient mentors={alumni} />
      </div>
    </>
  );
}
