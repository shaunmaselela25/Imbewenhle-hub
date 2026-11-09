import { expect, test } from "@playwright/test";

test("T-E2E-0 selecting Migration opens its enquiry route", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Migration/ }).click();
  await expect(page).toHaveURL(/\/enquire\/migration$/);
});
