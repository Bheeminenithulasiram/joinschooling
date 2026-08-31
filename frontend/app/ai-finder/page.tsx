import { PageHeader } from "@/components/ui/PageHeader";
import AiFinderForm from "./AiFinderForm";

export default function AiFinderPage() {
  return (
    <>
      <PageHeader eyebrow="AI-Powered" title="AI College Finder" subtitle="Answer 8 questions. Get a personalized shortlist ranked by match score & admission probability." />
      <div className="container-page py-10">
        <AiFinderForm />
      </div>
    </>
  );
}
