import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "@/components/Alert";

describe("Alert", () => {
  it('T-C-6 sets role="alert" for an error', () => {
    render(<Alert type="error">Failed</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  it.each(["success", "warning", "info"] as const)("T-C-6 %s is not an alert", (type) => {
    render(<Alert type={type}>Message</Alert>);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByText("Message")).toBeInTheDocument();
  });
});
