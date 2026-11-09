import Link from "next/link";
import { messages } from "@/lib/copy/messages";
import type { EnquiryStatus } from "@/lib/rules/status";
import { StatusBadge } from "./StatusBadge";

type EnquiryCardProps = {
  reference: string;
  category: string;
  status: EnquiryStatus;
  latestUpdate: string | null;
};

export function EnquiryCard({ reference, category, status, latestUpdate }: EnquiryCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/dashboard/enquiries/${reference}`}
          className="inline-flex min-h-touch items-center font-semibold text-primary-hover underline"
        >
          {reference}
        </Link>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm font-semibold">{category}</p>
      <p className="text-sm text-text-muted">{latestUpdate ?? messages["detail.noUpdates"]}</p>
    </article>
  );
}
