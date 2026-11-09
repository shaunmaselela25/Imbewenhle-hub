import { expect, test } from "@playwright/test";
import { accounts } from "../helpers/auth";
import { signIn } from "./auth-helpers";

test("T-US2-2 Naledi cannot open Pieter's enquiry by changing the URL", async ({ page }) => {
  await signIn(page, accounts.clientA);

  await page.goto("/dashboard/enquiries/IMB-SEEDB00001");

  await expect(page.getByText("We couldn't find that enquiry.")).toBeVisible();
  await expect(page.getByText("We need to move our customer records")).toHaveCount(0);
});

test("T-US2-1 Naledi sees her two enquiries and opens one", async ({ page }) => {
  await signIn(page, accounts.clientA);

  await expect(page.getByRole("link", { name: /IMB-SEEDA00001/ })).toBeVisible();
  await page.getByRole("link", { name: /IMB-SEEDA00002/ }).click();

  await expect(page).toHaveURL(/\/dashboard\/enquiries\/IMB-SEEDA00002$/);
  await expect(page.getByRole("heading", { name: "IMB-SEEDA00002" })).toBeVisible();
  // Next.js keeps the previous route in the page, hidden, for instant Back navigation.
  await expect(page.getByText("In Delivery").locator("visible=true")).toBeVisible();
});
