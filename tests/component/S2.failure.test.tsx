import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/copy/messages";
import { field, fillValid, renderForm, validValues } from "../helpers/enquiryForm";

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

function expectValuesKept() {
  expect(field.name()).toHaveValue(validValues.name);
  expect(field.organisation()).toHaveValue(validValues.organisation);
  expect(field.email()).toHaveValue(validValues.email);
  expect(field.category()).toHaveValue("automation");
  expect(field.problem()).toHaveValue(validValues.problem);
  expect(field.outcome()).toHaveValue(validValues.outcome);
  expect(field.urgency()).toHaveValue("high");
}

describe("S2 failure", () => {
  it("T-US1-4 shows submit.failed and keeps every value when the server fails", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "error", message: "submit.failed" });
    const { user } = renderForm(submit);

    await fillValid(user);
    await user.click(field.submit());

    expect(await screen.findByRole("alert")).toHaveTextContent(messages["submit.failed"]);
    expectValuesKept();
    expect(replace).not.toHaveBeenCalled();
  });

  it("T-US1-4 shows submit.failed and keeps every value when the request throws", async () => {
    const submit = vi.fn().mockRejectedValue(new Error("Network down"));
    const { user } = renderForm(submit);

    await fillValid(user);
    await user.click(field.submit());

    expect(await screen.findByRole("alert")).toHaveTextContent(messages["submit.failed"]);
    expectValuesKept();
  });

  it("T-US1-4 reuses the same idempotency key when retrying", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "error", message: "submit.rateLimited" });
    const { user } = renderForm(submit);

    await fillValid(user);
    await user.click(field.submit());
    expect(await screen.findByRole("alert")).toHaveTextContent(messages["submit.rateLimited"]);
    await user.click(field.submit());

    expect(submit).toHaveBeenCalledTimes(2);
    expect(submit.mock.calls[0][0].idempotencyKey).toBe(submit.mock.calls[1][0].idempotencyKey);
  });
});
