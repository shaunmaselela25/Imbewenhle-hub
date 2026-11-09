import { describe, expect, it } from "vitest";
import { readSourceFiles } from "../helpers/sourceFiles";

describe("secrets", () => {
  it("T-SETUP-7 keeps secret variable names out of app code", () => {
    const files = readSourceFiles(["app", "components", "features", "lib"]);
    const offenders = files
      .filter(({ content }) => /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_DB_URL/.test(content))
      .map(({ path }) => path);

    expect(files.length).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
