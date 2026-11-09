import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EnquiryDetail } from "@/features/status/EnquiryDetail";
import { messages } from "@/lib/copy/messages";

const enquiry = {
  reference: "IMB-SEEDB00001",
  category: "Migration",
  status: "awaiting_client" as const,
  latestUpdate: "Please confirm how many customer records you have.",
  problem: "We need to move our customer records from an old desktop database.",
  outcome: "All customer records in the new system.",
  submittedAt: "2026-11-04T10:00:00Z",
};

describe("S6 client enquiry detail", () => {
  it("T-US2-3 shows the status and that action is required when awaiting the client", () => {
    render(<EnquiryDetail result={{ status: "ok", enquiry }} />);

    expect(screen.getByRole("heading", { name: "IMB-SEEDB00001" })).toBeInTheDocument();
    expect(screen.getByText("Awaiting Client")).toBeInTheDocument();
    expect(screen.getByText(messages["detail.awaitingClient"])).toBeInTheDocument();
    expect(screen.getByText("Migration")).toBeInTheDocument();
    expect(screen.getByText(enquiry.problem)).toBeInTheDocument();
    expect(screen.getByText(enquiry.outcome)).toBeInTheDocument();
    expect(screen.getByText("4 Nov 2026")).toBeInTheDocument();
  });

  it("T-US2-3 does not ask for action in any other status", () => {
    render(<EnquiryDetail result={{ status: "ok", enquiry: { ...enquiry, status: "new" } }} />);
    expect(screen.queryByText(messages["detail.awaitingClient"])).not.toBeInTheDocument();
  });

  it("T-US2-3 shows error.notFound", () => {
    render(<EnquiryDetail result={{ status: "notFound" }} />);
    expect(screen.getByText(messages["error.notFound"])).toBeInTheDocument();
  });

  it("T-US2-3 shows error.load with a retry", () => {
    render(<EnquiryDetail result={{ status: "error" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent(messages["error.load"]);
  });
});
