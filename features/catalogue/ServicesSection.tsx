import { PageState } from "@/components/PageState";
import { ServiceCard } from "@/components/ServiceCard";
import { messages } from "@/lib/copy/messages";
import { CatalogueError } from "./CatalogueError";
import type { CategoriesResult } from "./getCategories";

export function ServicesSection({ result }: { result: CategoriesResult }) {
  if (result.status === "error") return <CatalogueError />;

  if (result.categories.length === 0) {
    return <PageState state="empty" message={messages["catalogue.empty"]} />;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {result.categories.map((category, index) => (
        <li key={category.slug}>
          <ServiceCard {...category} position={index + 1} />
        </li>
      ))}
    </ul>
  );
}
