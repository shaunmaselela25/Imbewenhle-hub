import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/SiteHeader";
import { messages } from "@/lib/copy/messages";

describe("SiteHeader", () => {
  it("T-C-15 shows Services and Sign in links when logged out", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: messages["nav.services"] })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: messages["nav.signIn"] })).toHaveAttribute(
      "href",
      "/sign-in",
    );
  });
});
