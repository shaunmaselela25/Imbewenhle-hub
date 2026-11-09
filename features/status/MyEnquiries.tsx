import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { EnquiryCard } from "@/components/EnquiryCard";
import { PageState } from "@/components/PageState";
import { CatalogueError } from "@/features/catalogue/CatalogueError";
import { messages } from "@/lib/copy/messages";
import type { MyEnquiriesResult } from "./getMyEnquiries";

export function MyEnquiries({ result }: { result: MyEnquiriesResult }) {
  if (result.status === "error") return <CatalogueError />;

  if (result.enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <PageState state="empty" message={messages["dashboard.empty"]} />
        <Link href="/" className={buttonClasses("primary")}>
          {messages["dashboard.emptyAction"]}
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {result.enquiries.map((enquiry) => (
        <li key={enquiry.reference}>
          <EnquiryCard {...enquiry} />
        </li>
      ))}
    </ul>
  );
}
