import { describe, expect, it } from "vitest";
import { tokens } from "@/theme/tokens";

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => {
    const value = parseInt(hex.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("design tokens", () => {
  it("T-SETUP-6 defines every Section 7.1 token with readable text colours", () => {
    expect(Object.keys(tokens.color).sort()).toEqual(
      [
        "background",
        "border",
        "error",
        "focus",
        "primary",
        "primaryHover",
        "success",
        "surface",
        "text",
        "textMuted",
        "warning",
      ].sort(),
    );
    expect(tokens.font.family).toContain("Inter");
    expect(Object.keys(tokens.font.size).sort()).toEqual(
      ["2xl", "3xl", "base", "lg", "sm", "xl", "xs"].sort(),
    );
    expect(tokens.font.weight).toEqual({ body: 400, heading: 600 });
    expect(Object.keys(tokens.space)).toHaveLength(12);
    expect(Object.keys(tokens.radius).sort()).toEqual(["lg", "md", "sm"]);
    expect(tokens.size).toEqual({ button: 44, touchMin: 44 });
    expect(tokens.breakpoint).toEqual({ md: 768, lg: 1024 });

    expect(contrast(tokens.color.text, tokens.color.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.color.textMuted, tokens.color.background)).toBeGreaterThanOrEqual(4.5);
  });
});
