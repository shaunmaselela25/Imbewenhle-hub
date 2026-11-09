import { render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import { EnquiryForm } from "@/features/enquiry/EnquiryForm";
import { messages } from "@/lib/copy/messages";

const description = "Description to be supplied by Imbewenhle.";

export const categories = [
  { slug: "automation", title: "Automation", description },
  { slug: "migration", title: "Migration", description },
];

export const idempotencyKey = "60000000-0000-4000-8000-000000000001";

export const field = {
  name: () => screen.getByRole("textbox", { name: messages["enquiry.label.name"] }),
  organisation: () => screen.getByRole("textbox", { name: messages["enquiry.label.organisation"] }),
  email: () => screen.getByRole("textbox", { name: messages["enquiry.label.email"] }),
  category: () => screen.getByRole("combobox", { name: messages["enquiry.label.category"] }),
  problem: () => screen.getByRole("textbox", { name: messages["enquiry.label.problem"] }),
  outcome: () => screen.getByRole("textbox", { name: messages["enquiry.label.outcome"] }),
  urgency: () => screen.getByRole("combobox", { name: messages["enquiry.label.urgency"] }),
  submit: () => screen.getByRole("button", { name: messages["submit.button"] }),
};

export function renderForm(submit = vi.fn()) {
  render(
    <EnquiryForm
      categories={categories}
      selectedSlug="automation"
      idempotencyKey={idempotencyKey}
      submit={submit}
    />,
  );
  return { user: userEvent.setup(), submit };
}

export const validValues = {
  name: "Naledi Khumalo",
  organisation: "Khumalo Logistics",
  email: "client.a@example.test",
  problem: "Our dispatch team copies orders between sheets.",
  outcome: "One daily order list.",
};

export async function fillValid(user: UserEvent) {
  await user.type(field.name(), validValues.name);
  await user.type(field.organisation(), validValues.organisation);
  await user.type(field.email(), validValues.email);
  await user.type(field.problem(), validValues.problem);
  await user.type(field.outcome(), validValues.outcome);
  await user.selectOptions(field.urgency(), "high");
}
