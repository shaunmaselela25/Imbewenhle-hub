import { describe, expect, it } from "vitest";
import { validateEnquiry } from "@/lib/validation/enquiry";

const valid = {
  name: "Naledi Khumalo",
  organisation: "Khumalo Logistics",
  email: "name@example.com",
  category: "automation",
  problem: "a".repeat(30),
  outcome: "b".repeat(10),
  urgency: "low",
  budget: "",
  idempotencyKey: "60000000-0000-4000-8000-000000000001",
};

function errorsFor(change: Record<string, unknown>) {
  const result = validateEnquiry({ ...valid, ...change });
  return result.ok ? {} : result.errors;
}

describe("enquiry schema", () => {
  it.each([
    [29, "form.problem.tooShort"],
    [30, undefined],
    [3000, undefined],
    [3001, "form.problem.tooLong"],
  ])("T-BR2-2 a problem of %i characters gives %s", (length, key) => {
    expect(errorsFor({ problem: "a".repeat(length) }).problem).toBe(key);
  });

  it("T-BR2-2 rejects a whitespace-only problem", () => {
    expect(errorsFor({ problem: " ".repeat(40) }).problem).toBe("form.problem.tooShort");
  });

  it.each([
    ["name@example.com", undefined],
    ["name@", "form.email.format"],
    ["@x.com", "form.email.format"],
    ["", "form.email.required"],
  ])("T-BR3-2 the email %j gives %s", (email, key) => {
    expect(errorsFor({ email }).email).toBe(key);
  });

  it.each([
    ["name", "", "form.name.required"],
    ["name", "a", "form.name.length"],
    ["name", "a".repeat(101), "form.name.length"],
    ["organisation", "", "form.organisation.required"],
    ["organisation", "a", "form.organisation.length"],
    ["organisation", "a".repeat(151), "form.organisation.length"],
    ["email", `${"a".repeat(250)}@b.co`, "form.email.format"],
    ["category", "", "form.category.required"],
    ["outcome", "a".repeat(9), "form.outcome.tooShort"],
    ["outcome", "a".repeat(1001), "form.outcome.tooLong"],
    ["urgency", "", "form.urgency.required"],
    ["urgency", "urgent", "form.urgency.required"],
  ])("T-BR12-2 %s = %j gives %s", (field, value, key) => {
    expect(errorsFor({ [field]: value })).toEqual({ [field]: key });
  });

  it.each(["", "under_50k", "50k_150k", "150k_500k", "over_500k", "not_sure"])(
    "T-BR12-2 accepts the budget %j",
    (budget) => {
      expect(validateEnquiry({ ...valid, budget }).ok).toBe(true);
    },
  );

  it("T-BR12-2 rejects a budget outside the allowed values", () => {
    expect(errorsFor({ budget: "lots" }).budget).toBe("submit.failed");
  });

  it("T-BR12-2 treats an empty budget as absent and trims text", () => {
    const result = validateEnquiry({ ...valid, name: "  Naledi Khumalo  " });
    expect(result.ok && result.data).toMatchObject({ name: "Naledi Khumalo", budget: undefined });
  });
});
