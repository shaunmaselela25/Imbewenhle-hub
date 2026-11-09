import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignInForm } from "@/features/auth/SignInForm";
import { messages } from "@/lib/copy/messages";

const { sendSignInLink } = vi.hoisted(() => ({ sendSignInLink: vi.fn() }));
vi.mock("@/features/auth/sendSignInLink", () => ({ sendSignInLink }));

const emailField = () => screen.getByRole("textbox", { name: messages["signin.emailLabel"] });
const sendButton = () => screen.getByRole("button", { name: messages["signin.button"] });

describe("S4 sign in", () => {
  beforeEach(() => {
    sendSignInLink.mockReset();
  });
  afterEach(() => vi.restoreAllMocks());

  it("T-AUTH-1 shows signin.intro and signin.sent for a valid email", async () => {
    sendSignInLink.mockResolvedValue(true);
    render(<SignInForm next="/dashboard" />);
    expect(screen.getByText(messages["signin.intro"])).toBeInTheDocument();

    await userEvent.type(emailField(), "client.a@example.test");
    await userEvent.click(sendButton());

    expect(await screen.findByText(messages["signin.sent"])).toBeInTheDocument();
    expect(sendSignInLink).toHaveBeenCalledWith("client.a@example.test", "/dashboard");
  });

  it("T-AUTH-1 shows form.email.format for an invalid email and sends nothing", async () => {
    render(<SignInForm />);
    await userEvent.type(emailField(), "name@");
    await userEvent.click(sendButton());

    expect(emailField()).toHaveAccessibleDescription(messages["form.email.format"]);
    expect(sendSignInLink).not.toHaveBeenCalled();
  });

  it("T-AUTH-1 shows error.load and keeps the email when sending fails", async () => {
    sendSignInLink.mockResolvedValue(false);
    render(<SignInForm />);
    await userEvent.type(emailField(), "client.a@example.test");
    await userEvent.click(sendButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(messages["error.load"]);
    expect(emailField()).toHaveValue("client.a@example.test");
  });

  it("T-AUTH-3 shows signin.expired for an expired link", () => {
    render(<SignInForm expired />);
    expect(screen.getByRole("alert")).toHaveTextContent(messages["signin.expired"]);
  });

  it("T-AUTH-1 shows error.offline and sends nothing when offline", async () => {
    render(<SignInForm />);
    await userEvent.type(emailField(), "client.a@example.test");
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);

    await userEvent.click(sendButton());

    expect(screen.getByRole("alert")).toHaveTextContent(messages["error.offline"]);
    expect(sendSignInLink).not.toHaveBeenCalled();
  });

  it("T-AUTH-1 shows the busy button while sending", async () => {
    sendSignInLink.mockReturnValue(new Promise(() => {}));
    render(<SignInForm />);
    await userEvent.type(emailField(), "client.a@example.test");
    await userEvent.click(sendButton());

    expect(sendButton()).toBeDisabled();
    expect(sendButton()).toHaveAttribute("aria-busy", "true");
  });
});
