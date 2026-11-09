import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/copy/messages";
import { field, fillValid, renderForm } from "../helpers/enquiryForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("S2 double submit", () => {
  it("T-BR9-2 sends one request and shows the disabled busy button", async () => {
    const submit = vi.fn(() => new Promise(() => {}));
    const { user } = renderForm(submit);

    await fillValid(user);
    const button = field.submit();
    await user.dblClick(button);

    expect(submit).toHaveBeenCalledOnce();
    const busy = screen.getByRole("button", { name: messages["submit.buttonBusy"] });
    expect(busy).toBeDisabled();
    expect(busy).toHaveAttribute("aria-busy", "true");
  });
});
