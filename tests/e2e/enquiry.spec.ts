import { expect, test } from "@playwright/test";
import { submitValidEnquiry, uniqueEmail } from "./helpers";

test("T-E2E-1 a visitor picks a service, submits and sees an IMB- reference", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Automation/ }).click();
  await expect(page).toHaveURL(/\/enquire\/automation$/);
  await expect(page.getByLabel("Service")).toHaveValue("automation");

  await submitValidEnquiry(page, uniqueEmail("t-e2e-1"));

  await expect(page).toHaveURL(/\/enquire\/submitted$/);
  await expect(page.getByText(/Your reference is IMB-[0-9A-HJKMNP-TV-Z]{10}\./)).toBeVisible();
});

test("T-S2-2 an unknown service goes back to S1 with category.unavailable", async ({ page }) => {
  await page.goto("/enquire/no-such-service");
  await expect(page).toHaveURL(/\/\?notice=category-unavailable$/);
  await expect(
    page.getByText("This service is no longer available. Choose another service."),
  ).toBeVisible();
});
