import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { expect, type Page } from "@playwright/test";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export function uniqueEmail(testId: string) {
  return `${testId}-${randomUUID()}@example.test`;
}

export async function countEnquiries(email: string) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  const { count } = await admin
    .from("enquiries")
    .select("id", { count: "exact", head: true })
    .eq("requester_email", email);
  return count;
}

export async function submitValidEnquiry(page: Page, email: string) {
  await page.getByLabel("Lead Contact Full Name").fill("Test Person");
  await page.getByLabel("Organization / Legal Entity").fill("Test Organisation");
  await page.getByLabel("Corporate Email").fill(email);
  await page.getByLabel("Problem description").fill("Our dispatch team copies orders between sheets.");
  await page.getByLabel("Desired outcome").fill("One daily order list.");
  await page.getByLabel("Urgency").selectOption("medium");
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Enquiry received" })).toBeVisible();
}
