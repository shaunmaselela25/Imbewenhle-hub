import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { messages } from "@/lib/copy/messages";
import { field, renderForm } from "../helpers/enquiryForm";

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn() }) }));

describe("S2 category and privacy", () => {
  it("T-US1-6 shows the selected category, the privacy explanation and the link", () => {
    renderForm();

    expect(field.category()).toHaveDisplayValue("Automation");
    expect(screen.getByText(messages["privacy.explanation"])).toBeInTheDocument();
    expect(screen.getByRole("link", { name: messages["privacy.link"] })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("T-US1-6 lists the fields in PRD order", () => {
    renderForm();

    const order = [
      field.name(), field.organisation(), field.email(), field.category(),
      field.problem(), field.outcome(), field.urgency(),
      screen.getByRole("combobox", { name: new RegExp(messages["enquiry.label.budget"]) }),
    ];

    order.slice(1).forEach((control, index) => {
      expect(order[index].compareDocumentPosition(control)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });
});
