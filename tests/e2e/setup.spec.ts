import { expect, test } from "@playwright/test";

test("T-SETUP-5 landing page title contains Imbewenhle", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Imbewenhle/);
});
