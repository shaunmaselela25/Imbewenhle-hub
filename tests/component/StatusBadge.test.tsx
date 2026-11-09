import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["new", "New"],
    ["under_review", "Under Review"],
    ["awaiting_client", "Awaiting Client"],
    ["proposal_prepared", "Proposal Prepared"],
    ["accepted", "Accepted"],
    ["in_delivery", "In Delivery"],
    ["completed", "Completed"],
    ["closed", "Closed"],
  ] as const)("T-C-5 %s shows %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
