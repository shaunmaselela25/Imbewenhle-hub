import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/copy/messages";
import { field, renderForm } from "../helpers/enquiryForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("S2 validation", () => {
  it("T-US1-2 shows the summary and each field's message, moves focus and sends nothing", async () => {
    const { user, submit } = renderForm();

    await user.click(field.submit());

    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent(messages["form.errorSummary"]);
    expect(summary).toHaveFocus();

    expect(field.name()).toHaveAccessibleDescription(messages["form.name.required"]);
    expect(field.organisation()).toHaveAccessibleDescription(messages["form.organisation.required"]);
    expect(field.email()).toHaveAccessibleDescription(messages["form.email.required"]);
    expect(field.problem()).toHaveAccessibleDescription(
      expect.stringContaining(messages["form.problem.tooShort"]),
    );
    expect(field.outcome()).toHaveAccessibleDescription(
      expect.stringContaining(messages["form.outcome.tooShort"]),
    );
    expect(field.urgency()).toHaveAccessibleDescription(messages["form.urgency.required"]);
    expect(submit).not.toHaveBeenCalled();
  });

  it("T-US1-2 shows the category message when no service is chosen", async () => {
    const { user } = renderForm();
    await user.selectOptions(field.category(), "");
    await user.click(field.submit());
    expect(field.category()).toHaveAccessibleDescription(messages["form.category.required"]);
  });
});
