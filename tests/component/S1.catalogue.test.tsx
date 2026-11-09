import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesSection } from "@/features/catalogue/ServicesSection";

const description = "Description to be supplied by Imbewenhle.";

const categories = [
  { slug: "digital-it-advisory", title: "Digital & IT Advisory", description },
  { slug: "automation", title: "Automation", description },
  { slug: "systems-integration", title: "Systems Integration", description },
  { slug: "migration", title: "Migration", description },
  { slug: "systems-software-development", title: "Systems & Software Development", description },
  { slug: "technical-solutions-support", title: "Technical Solutions & Support", description },
];

describe("S1 service catalogue", () => {
  it("T-US1-1 shows six ServiceCards with title, description and Enquire action, in sort order", () => {
    render(<ServicesSection result={{ status: "ok", categories }} />);

    expect(screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual(
      categories.map((category) => category.title),
    );
    expect(screen.getAllByText(description)).toHaveLength(6);
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual(
      categories.map((category) => `/enquire/${category.slug}`),
    );
  });
});
