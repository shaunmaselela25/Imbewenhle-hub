import { render, screen } from "@testing-library/react";
import { use } from "react";
import { describe, expect, it, vi } from "vitest";
import LandingPage from "@/app/(public)/page";
import { ServicesSection } from "@/features/catalogue/ServicesSection";
import { messages } from "@/lib/copy/messages";

vi.mock("@/features/catalogue/CatalogueServices", () => {
  const neverLoads = new Promise<never>(() => {});
  return { CatalogueServices: () => use(neverLoads) };
});

describe("S1 catalogue states", () => {
  it("T-S1-2 shows the loading state while categories load", () => {
    render(<LandingPage />);
    expect(screen.getByText(messages["page.loading"])).toBeInTheDocument();
  });

  it("T-S1-2 shows the load error with a retry", () => {
    render(<ServicesSection result={{ status: "error" }} />);
    expect(screen.getByRole("alert")).toHaveTextContent(messages["error.load"]);
    expect(screen.getByRole("button", { name: messages["error.retry"] })).toBeInTheDocument();
  });

  it("T-S1-2 shows the empty state with zero categories", () => {
    render(<ServicesSection result={{ status: "ok", categories: [] }} />);
    expect(screen.getByText(messages["catalogue.empty"])).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
