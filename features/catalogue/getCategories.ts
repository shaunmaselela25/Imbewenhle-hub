import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export type ServiceCategory = Pick<
  Database["public"]["Tables"]["service_categories"]["Row"],
  "slug" | "title" | "description"
>;

export type CategoriesResult = { status: "ok"; categories: ServiceCategory[] } | { status: "error" };

// The filter is explicit because RLS lets staff read inactive categories too (SEC1).
export async function getCategories(client: SupabaseClient<Database>): Promise<CategoriesResult> {
  const { data, error } = await client
    .from("service_categories")
    .select("slug, title, description")
    .eq("is_active", true)
    .order("sort_order");

  return error ? { status: "error" } : { status: "ok", categories: data };
}
