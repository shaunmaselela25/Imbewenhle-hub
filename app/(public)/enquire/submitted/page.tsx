import { Suspense } from "react";
import { PageState } from "@/components/PageState";
import { ConfirmationContent } from "@/features/enquiry/ConfirmationContent";

export default function ConfirmationPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-9">
      <Suspense fallback={<PageState state="loading" />}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
