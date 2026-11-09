import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServiceCard } from "@/components/ServiceCard";
import { messages } from "@/lib/copy/messages";

describe("ServiceCard", () => {
  it("T-C-7 gives the action an accessible name including the service title", () => {
    render(
      <ServiceCard
        slug="automation"
        title="Automation"
        description="Description to be supplied by Imbewenhle."
      />,
    );

    expect(screen.getByRole("heading", { name: "Automation" })).toBeInTheDocument();
    expect(screen.getByText("Description to be supplied by Imbewenhle.")).toBeInTheDocument();

    const action = screen.getByRole("link", { name: /Automation/ });
    expect(action).toHaveAttribute("href", "/enquire/automation");
    expect(action).toHaveTextContent(messages["catalogue.enquire"]);
  });
});
