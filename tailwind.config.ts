import type { Config } from "tailwindcss";
import { tokens } from "./theme/tokens";

const toPx = (values: Record<string | number, number>) =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [key, `${value}px`]));

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: tokens.color.primary,
      "primary-hover": tokens.color.primaryHover,
      background: tokens.color.background,
      surface: tokens.color.surface,
      text: tokens.color.text,
      "text-muted": tokens.color.textMuted,
      border: tokens.color.border,
      focus: tokens.color.focus,
      error: tokens.color.error,
      success: tokens.color.success,
      warning: tokens.color.warning,
    },
    fontFamily: { sans: ["var(--font-inter)", tokens.font.family] },
    fontSize: toPx(tokens.font.size),
    fontWeight: {
      normal: String(tokens.font.weight.body),
      semibold: String(tokens.font.weight.heading),
    },
    spacing: {
      0: "0px",
      ...toPx(tokens.space),
      button: `${tokens.size.button}px`,
      touch: `${tokens.size.touchMin}px`,
    },
    borderRadius: { ...toPx(tokens.radius), full: "9999px" },
    screens: toPx(tokens.breakpoint),
  },
};

export default config;
