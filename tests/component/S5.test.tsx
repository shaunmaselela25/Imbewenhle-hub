import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OfflineNotice } from "@/components/OfflineNotice";
import { MyEnquiries } from "@/features/status/MyEnquiries";
import { messages } from "@/lib/copy/messages";

const enquiries = [
  {
    reference: "IMB-SEEDA00002",
    category: "Systems Integration",
    status: "in_delivery" as const,
    latestUpdate: "The integration design has been agreed.",
  },
  {
    reference: "IMB-SEEDA00001",
    category: "Automation",
    status: "new" as const,
    latestUpdate: null,
  },
];

describe("S5 client dashboard", () => {
  afterEach(() => vi.restoreAllMocks());

  it("T-US2-1 shows each enquiry's reference, category, status and latest update", () => {
    render(<MyEnquiries result={{ status: "ok", enquiries }} />);

    expect(screen.getByRole("link", { name: /IMB-SEEDA00002/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /IMB-SEEDA00001/ })).toBeInTheDocument();
    expect(screen.getByText("Systems Integration")).toBeInTheDocument();
    expect(screen.getByText("In Delivery")).toBeInTheDocument();
    expect(screen.getByText("The integration design has been agreed.")).toBeInTheDocument();
    expect(screen.getByText(messages["detail.noUpdates"])).toBeInTheDocument();
  });

  it("T-US2-1 shows dashboard.empty with its action", () => {
    render(<MyEnquiries result={{ status: "ok", enquiries: [] }} />);
    expect(screen.getByText(messages["dashboard.empty"])).toBeInTheDocument();
    expect(screen.getByRole("link", { name: messages["dashboard.emptyAction"] })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("T-US2-1 shows error.load with a retry", () => {
    render(<MyEnquiries result={{ status: "error" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent(messages["error.load"]);
    expect(screen.getByRole("button", { name: messages["error.retry"] })).toBeInTheDocument();
  });

  it("T-S5-1 shows error.offline only while the browser is offline", () => {
    const onLine = vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    render(<OfflineNotice />);
    expect(screen.queryByText(messages["error.offline"])).not.toBeInTheDocument();

    onLine.mockReturnValue(false);
    act(() => void window.dispatchEvent(new Event("offline")));
    expect(screen.getByText(messages["error.offline"])).toBeInTheDocument();

    onLine.mockReturnValue(true);
    act(() => void window.dispatchEvent(new Event("online")));
    expect(screen.queryByText(messages["error.offline"])).not.toBeInTheDocument();
  });
});
