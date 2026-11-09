import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("setup", () => {
  it("T-SETUP-2 renders a component and finds its text", () => {
    render(<p>Imbewenhle</p>);
    expect(screen.getByText("Imbewenhle")).toBeInTheDocument();
  });
});
