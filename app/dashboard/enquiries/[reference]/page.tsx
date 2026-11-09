import { Suspense } from "react";
import { OfflineNotice } from "@/components/OfflineNotice";
import { PageState } from "@/components/PageState";
import { EnquiryDetailLoader } from "@/features/status/EnquiryDetailLoader";

export default function EnquiryDetailPage({ params }: { params: Promise<{ reference: string }> }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-9">
      <OfflineNotice />
      <Suspense fallback={<PageState state="loading" />}>
        <EnquiryDetailLoader params={params} />
      </Suspense>
    </div>
  );
}
