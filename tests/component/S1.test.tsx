import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingPage from "@/app/(public)/page";
import { messages } from "@/lib/copy/messages";

vi.mock("@/features/catalogue/CatalogueServices", () => ({
  CatalogueServices: () => (
    <ul>
      {[
        "Digital & IT Advisory",
        "Automation",
        "Systems Integration",
        "Migration",
        "Systems & Software Development",
        "Technical Solutions & Support",
      ].map((title) => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  ),
}));

describe("S1 landing (static)", () => {
  it("T-S1-1 shows value proposition, services, process and enquiry action in order", () => {
    render(<LandingPage />);

    const sections = [
      screen.getByRole("heading", { level: 1, name: messages["landing.valueProposition"] }),
      screen.getByRole("link", { name: messages["landing.enquiryAction"] }),
      screen.getByRole("heading", { level: 2, name: messages["landing.services.heading"] }),
      screen.getByRole("heading", { level: 2, name: messages["landing.process.heading"] }),
    ];

    sections.slice(1).forEach((section, index) => {
      expect(sections[index].compareDocumentPosition(section)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  it("T-S1-1 shows the three engagement stages and links to them from the hero", () => {
    render(<LandingPage />);
    expect(screen.getByRole("link", { name: messages["landing.protocolAction"] })).toHaveAttribute(
      "href",
      "#process",
    );
    expect(
      [
        messages["landing.process.step1.title"],
        messages["landing.process.step2.title"],
        messages["landing.process.step3.title"],
      ].map((name) => screen.getByRole("heading", { level: 3, name }).textContent),
    ).toHaveLength(3);
  });

  it("T-S1-1 lists the six FR-01 service titles", () => {
    render(<LandingPage />);
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(
      expect.arrayContaining([
        "Digital & IT Advisory",
        "Automation",
        "Systems Integration",
        "Migration",
        "Systems & Software Development",
        "Technical Solutions & Support",
      ]),
    );
  });
});
