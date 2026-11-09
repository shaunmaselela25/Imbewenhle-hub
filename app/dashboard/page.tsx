import { Suspense } from "react";
import { OfflineNotice } from "@/components/OfflineNotice";
import { PageState } from "@/components/PageState";
import { MyEnquiriesLoader } from "@/features/status/MyEnquiriesLoader";
import { messages } from "@/lib/copy/messages";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-9">
      <h1 className="text-2xl">{messages["dashboard.heading"]}</h1>
      <OfflineNotice />
      <Suspense fallback={<PageState state="loading" />}>
        <MyEnquiriesLoader />
      </Suspense>
    </div>
  );
}
