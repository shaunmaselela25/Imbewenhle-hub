import { messages } from "@/lib/copy/messages";
import type { EnquiryStatus } from "@/lib/rules/status";

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-text">
      {messages[`status.label.${status}`]}
    </span>
  );
}
