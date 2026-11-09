import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageState } from "@/components/PageState";
import { messages } from "@/lib/copy/messages";

describe("PageState", () => {
  it("T-C-14 shows the loading message", () => {
    render(<PageState state="loading" />);
    expect(screen.getByText(messages["page.loading"])).toBeInTheDocument();
  });

  it("T-C-14 shows the screen's own empty message", () => {
    render(<PageState state="empty" message={messages["dashboard.empty"]} />);
    expect(screen.getByText(messages["dashboard.empty"])).toBeInTheDocument();
  });

  it("T-C-14 shows not found", () => {
    render(<PageState state="notFound" />);
    expect(screen.getByText(messages["error.notFound"])).toBeInTheDocument();
  });

  it.each([
    ["error", "error.load"],
    ["offline", "error.offline"],
  ] as const)("T-C-14 shows %s with a working retry", async (state, key) => {
    const onRetry = vi.fn();
    render(<PageState state={state} onRetry={onRetry} />);
    expect(screen.getByText(messages[key])).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: messages["error.retry"] }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
