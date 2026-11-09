import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    coverage: { include: ["lib/rules/**", "lib/validation/**"] },
    projects: [
      {
        extends: true,
        test: { name: "unit", environment: "node", include: ["tests/unit/**/*.test.ts"] },
      },
      {
        extends: true,
        test: {
          name: "component",
          environment: "jsdom",
          // Form tests type each character, which can exceed 5 seconds on a busy machine.
          testTimeout: 20_000,
          include: ["tests/component/**/*.test.tsx"],
          setupFiles: ["tests/helpers/setup-component.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          testTimeout: 20_000,
          include: ["tests/integration/**/*.test.ts"],
        },
      },
    ],
  },
});
