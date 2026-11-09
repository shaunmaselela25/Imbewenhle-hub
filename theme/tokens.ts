export const tokens = {
  color: {
    primary: "#FE932C",
    primaryHover: "#904D00",
    background: "#FFFFFF",
    surface: "#F2F4F6",
    text: "#131B2E",
    textMuted: "#4B5550",
    border: "#E6E8EA",
    focus: "#1A56DB",
    error: "#B42318",
    success: "#067647",
    warning: "#B54708",
  },
  font: {
    family: "Inter, system-ui, sans-serif",
    size: { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 32 },
    weight: { body: 400, heading: 600 },
  },
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40, 9: 48, 10: 64, 11: 80, 12: 96 },
  radius: { sm: 4, md: 8, lg: 12 },
  size: { button: 44, touchMin: 44 },
  breakpoint: { md: 768, lg: 1024 },
} as const;
