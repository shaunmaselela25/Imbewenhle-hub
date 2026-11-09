import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PrivacyPage from "@/app/(public)/privacy/page";
import { MarkdownContent } from "@/components/MarkdownContent";

describe("S11 privacy notice", () => {
  it("T-S11-1 shows content/privacy.md with headings", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Privacy notice" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(0);
  });

  it("T-S11-1 renders headings, paragraphs and lists as plain text", () => {
    render(<MarkdownContent source={"# One\n\n## Two\n\nA <b>paragraph</b>.\n\n- First\n- Second"} />);
    expect(screen.getByRole("heading", { level: 1, name: "One" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Two" })).toBeInTheDocument();
    expect(screen.getByText("A <b>paragraph</b>.")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["First", "Second"]);
  });
});
