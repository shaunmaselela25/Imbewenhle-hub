import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmationContent } from "@/features/enquiry/ConfirmationContent";
import { formatMessage, messages } from "@/lib/copy/messages";

const { cookieValue, redirect } = vi.hoisted(() => ({
  cookieValue: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => cookieValue() }),
}));

const reference = "IMB-SEEDA00001";
const email = "client.a@example.test";

describe("S3 confirmation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
  });

  it("T-US1-5 shows the heading, reference, next steps and return link", async () => {
    cookieValue.mockReturnValue({ value: JSON.stringify({ reference, email }) });

    render(await ConfirmationContent());

    expect(screen.getByRole("heading", { name: messages["confirm.heading"] })).toBeInTheDocument();
    expect(screen.getByText(formatMessage("confirm.reference", { reference }))).toBeInTheDocument();
    expect(screen.getByText(messages["confirm.next1"])).toBeInTheDocument();
    expect(screen.getByText(formatMessage("confirm.next2", { email }))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: messages["confirm.return"] })).toHaveAttribute("href", "/");
  });

  it("T-US1-5 clears the cookie once the confirmation shows", async () => {
    cookieValue.mockReturnValue({ value: JSON.stringify({ reference, email }) });

    render(await ConfirmationContent());

    expect(fetch).toHaveBeenCalledWith(
      "/enquire/submitted/clear",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it.each([
    ["missing", undefined],
    ["unreadable", { value: "not json" }],
    ["incomplete", { value: JSON.stringify({ reference }) }],
  ])("T-US1-5 sends a %s cookie back to S1", async (_case, cookie) => {
    cookieValue.mockReturnValue(cookie);
    await expect(ConfirmationContent()).rejects.toThrow("redirect:/");
  });
});
