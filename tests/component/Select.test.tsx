import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "@/components/Select";
import { messages } from "@/lib/copy/messages";

const options = [
  { value: "low", label: messages["urgency.label.low"] },
  { value: "high", label: messages["urgency.label.high"] },
];

describe("Select", () => {
  it("T-C-4 shows the label, options and error", () => {
    render(
      <Select
        label="Urgency"
        name="urgency"
        required
        placeholder="Choose"
        options={options}
        error={messages["form.urgency.required"]}
      />,
    );

    const field = screen.getByRole("combobox", { name: "Urgency" });
    expect(field).toBeRequired();
    expect(field).toHaveAccessibleDescription(messages["form.urgency.required"]);
    expect(screen.getByRole("option", { name: "Choose" })).toHaveValue("");
    expect(screen.getByRole("option", { name: "Low" })).toHaveValue("low");
    expect(screen.getByRole("option", { name: "High" })).toHaveValue("high");
  });
});
