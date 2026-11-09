import { Alert } from "@/components/Alert";
import { PageState } from "@/components/PageState";
import { StatusBadge } from "@/components/StatusBadge";
import { CatalogueError } from "@/features/catalogue/CatalogueError";
import { formatDate } from "@/lib/copy/formatDate";
import { messages } from "@/lib/copy/messages";
import type { MyEnquiryResult } from "./getMyEnquiry";

export function EnquiryDetail({ result }: { result: MyEnquiryResult }) {
  if (result.status === "error") return <CatalogueError />;
  if (result.status === "notFound") return <PageState state="notFound" />;

  const { enquiry } = result;

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3 rounded-lg border border-border bg-background p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl">{enquiry.reference}</h1>
          <StatusBadge status={enquiry.status} />
        </div>
        <p className="font-semibold">{enquiry.category}</p>
        <p className="text-sm text-text-muted">
          {messages["detail.submitted"]}: <span>{formatDate(enquiry.submittedAt)}</span>
        </p>
      </section>

      {enquiry.status === "awaiting_client" && (
        <Alert type="warning">{messages["detail.awaitingClient"]}</Alert>
      )}

      <section className="flex flex-col gap-2 rounded-lg bg-surface p-5">
        <h2 className="text-lg">{messages["enquiry.label.problem"]}</h2>
        <p className="text-sm text-text-muted">{enquiry.problem}</p>
      </section>

      <section className="flex flex-col gap-2 rounded-lg bg-surface p-5">
        <h2 className="text-lg">{messages["enquiry.label.outcome"]}</h2>
        <p className="text-sm text-text-muted">{enquiry.outcome}</p>
      </section>
    </div>
  );
}
