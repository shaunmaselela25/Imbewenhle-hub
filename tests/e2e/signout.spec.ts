import { expect, test } from "@playwright/test";
import { accounts } from "../helpers/auth";
import { signIn } from "./auth-helpers";

test("T-AUTH-4 after Sign out, S5 redirects to S4", async ({ page }) => {
  await signIn(page, accounts.clientA);
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard$/);
});
