import Link from "next/link";
import { formatMessage, messages } from "@/lib/copy/messages";

type ServiceCardProps = {
  slug: string;
  title: string;
  description: string;
  position?: number;
};

export function ServiceCard({ slug, title, description, position }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg border border-border bg-background p-5">
      {position !== undefined && (
        <p className="text-xs font-semibold text-text-muted">
          {formatMessage("catalogue.practice", { number: String(position).padStart(2, "0") })}
        </p>
      )}
      <h3 className="text-lg">{title}</h3>
      <p className="flex-1 text-sm text-text-muted">{description}</p>
      <Link
        href={`/enquire/${slug}`}
        className="inline-flex min-h-button items-center justify-between gap-2 rounded-md bg-surface px-4 text-sm font-semibold text-primary-hover hover:bg-border"
      >
        <span>
          {messages["catalogue.enquire"]}
          <span className="sr-only"> {title}</span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
