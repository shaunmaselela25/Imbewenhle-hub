import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/copy/messages";
import { field, fillValid, idempotencyKey, renderForm, validValues } from "../helpers/enquiryForm";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

describe("S2 submit", () => {
  it("T-US1-1 goes to S3 only after the server responds (BR7)", async () => {
    let respond!: (value: { status: "ok" }) => void;
    const submit = vi.fn(() => new Promise((resolve) => (respond = resolve)));
    const { user } = renderForm(submit);

    await fillValid(user);
    await user.click(field.submit());

    expect(submit).toHaveBeenCalledWith({
      ...validValues,
      category: "automation",
      urgency: "high",
      budget: undefined,
      idempotencyKey,
    });
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: messages["submit.buttonBusy"] })).toBeDisabled();

    respond({ status: "ok" });

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/enquire/submitted"));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
