import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "tests/e2e",
  // Supabase keeps one active sign-in link per user, so parallel tests would cancel each other's.
  workers: 1,
  // The dev server compiles each route on first visit, which can take over 5 seconds.
  expect: { timeout: 20_000 },
  use: { baseURL },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
