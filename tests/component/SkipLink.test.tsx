import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SkipLink } from "@/components/SkipLink";

describe("SkipLink", () => {
  it('T-C-16 is first in tab order, targets #main and reads "Skip to content"', async () => {
    render(
      <>
        <SkipLink />
        <button>Next control</button>
      </>,
    );

    await userEvent.tab();

    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "#main");
    expect(link.className).toContain("focus:not-sr-only");
  });
});
