import { Suspense } from "react";
import { PageState } from "@/components/PageState";
import { EnquiryFormLoader } from "@/features/enquiry/EnquiryFormLoader";
import { messages } from "@/lib/copy/messages";

export default function EnquiryPage({ params }: { params: Promise<{ category: string }> }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-9">
      <h1 className="text-2xl">{messages["enquiry.heading"]}</h1>
      <Suspense fallback={<PageState state="loading" />}>
        <EnquiryFormLoader params={params} />
      </Suspense>
    </div>
  );
}
