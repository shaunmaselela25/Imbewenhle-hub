import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/Button";

const variants = ["primary", "secondary", "danger"] as const;

describe("Button", () => {
  it.each(variants)("T-C-1 %s is clickable by default", async (variant) => {
    const onClick = vi.fn();
    render(<Button variant={variant} onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it.each(variants)("T-C-1 %s is not clickable when disabled", async (variant) => {
    const onClick = vi.fn();
    render(<Button variant={variant} disabled onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(variants)("T-C-1 %s is not clickable when loading and sets aria-busy", async (variant) => {
    const onClick = vi.fn();
    render(<Button variant={variant} loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
