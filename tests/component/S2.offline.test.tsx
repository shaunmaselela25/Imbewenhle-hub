import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/copy/messages";
import { field, fillValid, renderForm, validValues } from "../helpers/enquiryForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("S2 offline", () => {
  afterEach(() => vi.restoreAllMocks());

  it("T-S2-1 shows error.offline, sends nothing and keeps the answers", async () => {
    const { user, submit } = renderForm();
    await fillValid(user);
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);

    await user.click(field.submit());

    expect(screen.getByRole("alert")).toHaveTextContent(messages["error.offline"]);
    expect(submit).not.toHaveBeenCalled();
    expect(field.email()).toHaveValue(validValues.email);
  });
});
