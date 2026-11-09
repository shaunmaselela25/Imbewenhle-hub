import { expect, test } from "@playwright/test";
import { accounts, createConfirmedClient } from "../helpers/auth";
import { latestMagicLink, signIn } from "./auth-helpers";

test("T-NAV-1 logged out goes to S4, and a real email link returns to /dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard$/);

  await page.getByLabel("Email address").fill(accounts.clientB);
  await page.getByRole("button", { name: "Send sign-in link" }).click();
  await expect(page.getByText("Check your email for a sign-in link.")).toBeVisible();

  await page.goto(await latestMagicLink(accounts.clientB));

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: /IMB-SEEDB00001/ })).toBeVisible();
});

test("T-AUTH-3 an invalid link lands on S4 with signin.expired", async ({ page }) => {
  await page.goto("/auth/callback?token_hash=not-a-real-token&type=magiclink");
  await expect(page).toHaveURL(/\/sign-in\?error=expired$/);
  await expect(page.getByText("This sign-in link has expired or was already used.")).toBeVisible();
});

test("T-NAV-2 a client opening /staff goes to S5", async ({ page }) => {
  await signIn(page, accounts.clientA);
  await page.goto("/staff");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("T-NAV-3 a consultant opening /staff/admin/users goes to S7", async ({ page }) => {
  await signIn(page, accounts.consultant);
  await page.goto("/staff/admin/users");
  await expect(page).toHaveURL(/\/staff$/);
});

test("T-NAV-4 a signed-in client opening /sign-in is redirected by role", async ({ page }) => {
  await signIn(page, accounts.clientA);
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/dashboard$/);
});

test("T-NAV-4 a signed-in consultant opening /sign-in is redirected by role", async ({ page }) => {
  await signIn(page, accounts.consultant);
  await page.goto("/sign-in");
  await expect(page).toHaveURL(/\/staff$/);
});

test("T-NAV-5 a signed-in client's enquiry appears on S5, with S2 prefilled", async ({ page }) => {
  const email = await createConfirmedClient("t-nav-5", "Lerato Dube", "Dube Traders");
  await signIn(page, email);
  await expect(page.getByText("You have no enquiries yet.")).toBeVisible();

  await page.goto("/enquire/automation");
  await expect(page.getByLabel("Lead Contact Full Name")).toHaveValue("Lerato Dube");
  await expect(page.getByLabel("Organization / Legal Entity")).toHaveValue("Dube Traders");
  await expect(page.getByLabel("Corporate Email")).toHaveValue(email);
  await expect(page.getByLabel("Corporate Email")).not.toBeEditable();

  await page.getByLabel("Problem description").fill("Our dispatch team copies orders between sheets.");
  await page.getByLabel("Desired outcome").fill("One daily order list.");
  await page.getByLabel("Urgency").selectOption("low");
  await page.getByRole("button", { name: "Submit enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Enquiry received" })).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("link", { name: /IMB-/ })).toHaveCount(1);
  await expect(page.getByText("Automation")).toBeVisible();
});
