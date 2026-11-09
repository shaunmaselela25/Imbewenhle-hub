import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextField } from "@/components/TextField";
import { messages } from "@/lib/copy/messages";

describe("TextField", () => {
  it("T-C-2 links the error by aria-describedby and announces required", () => {
    render(
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        error={messages["form.email.required"]}
      />,
    );

    const field = screen.getByRole("textbox", { name: "Email" });
    expect(field).toBeRequired();
    expect(field).toHaveAttribute("type", "email");
    expect(field).toHaveAccessibleDescription(messages["form.email.required"]);
    expect(field).toHaveAttribute("aria-invalid", "true");
  });

  it("T-C-2 shows no error state when valid", () => {
    render(<TextField label="Name" name="name" />);
    const field = screen.getByRole("textbox", { name: "Name" });
    expect(field).not.toBeRequired();
    expect(field).not.toHaveAttribute("aria-invalid");
    expect(field).not.toHaveAttribute("aria-describedby");
  });
});
