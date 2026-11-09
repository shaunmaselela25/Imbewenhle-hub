import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/SiteHeader";
import { messages } from "@/lib/copy/messages";

vi.mock("@/features/auth/signOut", () => ({ signOut: vi.fn() }));

const link = (name: string) => screen.queryByRole("link", { name });
const signOutButton = () => screen.getByRole("button", { name: messages["nav.signOut"] });

describe("SiteHeader variants", () => {
  it("T-C-15 shows My enquiries and Sign out for a client", () => {
    render(<SiteHeader role="client" />);
    expect(link(messages["nav.myEnquiries"])).toHaveAttribute("href", "/dashboard");
    expect(signOutButton()).toBeInTheDocument();
    expect(link(messages["nav.signIn"])).not.toBeInTheDocument();
    expect(link(messages["nav.queue"])).not.toBeInTheDocument();
  });

  it("T-C-15 shows Queue and Sign out for a consultant, without admin links", () => {
    render(<SiteHeader role="consultant" />);
    expect(link(messages["nav.queue"])).toHaveAttribute("href", "/staff");
    expect(signOutButton()).toBeInTheDocument();
    expect(link(messages["nav.servicesAdmin"])).not.toBeInTheDocument();
    expect(link(messages["nav.users"])).not.toBeInTheDocument();
  });

  it("T-C-15 adds the admin links for an administrator", () => {
    render(<SiteHeader role="admin" />);
    expect(link(messages["nav.queue"])).toHaveAttribute("href", "/staff");
    expect(link(messages["nav.servicesAdmin"])).toHaveAttribute("href", "/staff/admin/categories");
    expect(link(messages["nav.users"])).toHaveAttribute("href", "/staff/admin/users");
  });
});
