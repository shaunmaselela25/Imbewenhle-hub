import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EnquiryCard } from "@/components/EnquiryCard";
import { messages } from "@/lib/copy/messages";

const enquiry = {
  reference: "IMB-SEEDA00002",
  category: "Systems Integration",
  status: "in_delivery" as const,
  latestUpdate: "The integration design has been agreed.",
};

describe("EnquiryCard", () => {
  it("T-C-8 links to S6 by reference and shows its details", () => {
    render(<EnquiryCard {...enquiry} />);
    expect(screen.getByRole("link", { name: /IMB-SEEDA00002/ })).toHaveAttribute(
      "href",
      "/dashboard/enquiries/IMB-SEEDA00002",
    );
    expect(screen.getByText("Systems Integration")).toBeInTheDocument();
    expect(screen.getByText("In Delivery")).toBeInTheDocument();
    expect(screen.getByText(enquiry.latestUpdate)).toBeInTheDocument();
  });

  it("T-C-8 shows detail.noUpdates with no update", () => {
    render(<EnquiryCard {...enquiry} latestUpdate={null} />);
    expect(screen.getByText(messages["detail.noUpdates"])).toBeInTheDocument();
  });
});
