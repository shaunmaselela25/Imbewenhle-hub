import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "@/features/enquiry/EnquiryForm";
import { categories, field, idempotencyKey } from "../helpers/enquiryForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("S2 signed in", () => {
  it("T-NAV-5 prefills name, organisation and email, with email read-only", () => {
    render(
      <EnquiryForm
        categories={categories}
        selectedSlug="automation"
        idempotencyKey={idempotencyKey}
        submit={vi.fn()}
        profile={{
          name: "Naledi Khumalo",
          organisation: "Khumalo Logistics",
          email: "client.a@example.test",
        }}
      />,
    );

    expect(field.name()).toHaveValue("Naledi Khumalo");
    expect(field.organisation()).toHaveValue("Khumalo Logistics");
    expect(field.email()).toHaveValue("client.a@example.test");
    expect(field.email()).toHaveAttribute("readonly");
    expect(field.name()).not.toHaveAttribute("readonly");
  });
});
