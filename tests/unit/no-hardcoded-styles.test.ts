import { describe, expect, it } from "vitest";
import { readSourceFiles } from "../helpers/sourceFiles";

describe("styles", () => {
  it("T-SETUP-8 finds no hex colour or arbitrary px value in app and components", () => {
    const files = readSourceFiles(["app", "components"]);
    const offenders = files
      .filter(({ content }) => /#[0-9a-fA-F]{3,8}\b|-\[\d+(\.\d+)?px\]/.test(content))
      .map(({ path }) => path);

    expect(files.length).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
