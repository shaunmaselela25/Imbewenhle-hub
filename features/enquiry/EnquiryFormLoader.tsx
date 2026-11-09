import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { CatalogueError } from "@/features/catalogue/CatalogueError";
import { getCategories } from "@/features/catalogue/getCategories";
import { createClient } from "@/lib/supabase/server";
import { EnquiryForm } from "./EnquiryForm";
import { submitEnquiry } from "./submit";

export async function EnquiryFormLoader({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const result = await getCategories(await createClient());

  if (result.status === "error") return <CatalogueError />;
  if (!result.categories.some(({ slug }) => slug === category)) {
    redirect("/?notice=category-unavailable");
  }

  return (
    <EnquiryForm
      categories={result.categories}
      selectedSlug={category}
      idempotencyKey={randomUUID()}
      submit={submitEnquiry}
    />
  );
}
