import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TextArea } from "@/components/TextArea";
import { messages } from "@/lib/copy/messages";

describe("TextArea", () => {
  it("T-C-3 updates the counter while typing with min 30 and max 3000", async () => {
    render(<TextArea label="Problem" name="problem" min={30} max={3000} />);
    expect(screen.getByText("0 of 3000 characters")).toBeInTheDocument();

    await userEvent.type(screen.getByRole("textbox", { name: /Problem/ }), "abc");

    expect(screen.getByText("3 of 3000 characters")).toBeInTheDocument();
  });

  it("T-C-3 counts characters rather than UTF-16 units", async () => {
    render(<TextArea label="Problem" name="problem" max={3000} defaultValue="😀😀" />);
    expect(screen.getByText("2 of 3000 characters")).toBeInTheDocument();
  });

  it("T-C-3 links the error to the field", () => {
    const error = messages["form.problem.tooShort"];
    render(<TextArea label="Problem" name="problem" required max={3000} error={error} />);
    const field = screen.getByRole("textbox", { name: "Problem" });
    expect(field).toBeRequired();
    expect(field).toHaveAccessibleDescription(expect.stringContaining(error));
  });
});
