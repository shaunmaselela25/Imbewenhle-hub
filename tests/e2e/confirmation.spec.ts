import { expect, test } from "@playwright/test";
import { countEnquiries, submitValidEnquiry, uniqueEmail } from "./helpers";

test("T-S3-1 without a cookie the confirmation redirects to S1", async ({ page }) => {
  await page.goto("/enquire/submitted");
  await expect(page).toHaveURL(/localhost:3000\/$/);
});

test("T-S3-1 Back after submitting does not resubmit", async ({ page }) => {
  const email = uniqueEmail("t-s3-1");
  await page.goto("/");
  await page.getByRole("link", { name: /Automation/ }).click();
  await expect(page).toHaveURL(/\/enquire\/automation$/);
  await submitValidEnquiry(page, email);

  await page.goBack();

  await expect(page).toHaveURL(/localhost:3000\/$/);
  expect(await countEnquiries(email)).toBe(1);
});

test("T-S3-1 the confirmation cannot be reopened after it has been shown", async ({ page }) => {
  await page.goto("/enquire/automation");
  await submitValidEnquiry(page, uniqueEmail("t-s3-1"));
  await expect
    .poll(async () => (await page.context().cookies()).some(({ name }) => name === "confirmation"))
    .toBe(false);

  await page.goto("/enquire/submitted");

  await expect(page).toHaveURL(/localhost:3000\/$/);
});
