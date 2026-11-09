import Link from "next/link";
import { messages } from "@/lib/copy/messages";
import { buttonClasses } from "./Button";

type ServiceCardProps = {
  slug: string;
  title: string;
  description: string;
};

export function ServiceCard({ slug, title, description }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-lg bg-surface p-5">
      <h3 className="text-lg">{title}</h3>
      <p className="flex-1 text-sm text-text-muted">{description}</p>
      <Link href={`/enquire/${slug}`} className={`${buttonClasses("primary")} self-start`}>
        {messages["catalogue.enquire"]}
        <span className="sr-only"> {title}</span>
      </Link>
    </article>
  );
}
