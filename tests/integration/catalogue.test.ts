import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getCategories } from "@/features/catalogue/getCategories";
import type { Database } from "@/lib/supabase/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const options = { auth: { persistSession: false } };
const anon = createClient<Database>(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, options);
const admin = createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, options);

const slug = `t-int-1-${randomUUID()}`;

const expectedSlugs = [
  "digital-it-advisory",
  "automation",
  "systems-integration",
  "migration",
  "systems-software-development",
  "technical-solutions-support",
];

describe("OP1 list active categories", () => {
  beforeAll(async () => {
    const { error } = await admin.from("service_categories").insert({
      slug,
      title: `Inactive ${slug}`,
      description: "A service hidden from the catalogue.",
      is_active: false,
      sort_order: 0,
    });
    expect(error).toBeNull();
  });

  afterAll(async () => {
    await admin.from("service_categories").delete().eq("slug", slug);
  });

  it("T-INT-1 returns the 6 active categories in order for anon", async () => {
    const result = await getCategories(anon);
    expect(result.status).toBe("ok");
    expect(result.status === "ok" && result.categories.map((category) => category.slug)).toEqual(
      expectedSlugs,
    );
  });

  // The service-role client bypasses RLS, as staff reads do for inactive rows (SEC1).
  it("T-INT-1 excludes an inactive category even for a client that can read it", async () => {
    const result = await getCategories(admin);
    expect(result.status === "ok" && result.categories.map((category) => category.slug)).toEqual(
      expectedSlugs,
    );
  });
});
