import { createClient } from "@/lib/supabase/server";
import { getCategories } from "./getCategories";
import { ServicesSection } from "./ServicesSection";

export async function CatalogueServices() {
  const result = await getCategories(await createClient());
  return <ServicesSection result={result} />;
}
