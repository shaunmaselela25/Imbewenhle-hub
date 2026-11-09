import { z } from "zod";
import type { MessageKey } from "@/lib/copy/messages";

export const urgencyValues = ["low", "medium", "high"] as const;
export const budgetValues = ["under_50k", "50k_150k", "150k_500k", "over_500k", "not_sure"] as const;

const emailFormat = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const characters = (value: string) => Array.from(value).length;

type LengthRule = {
  min: number;
  max: number;
  empty: MessageKey;
  tooShort: MessageKey;
  tooLong: MessageKey;
};

function text({ min, max, empty, tooShort, tooLong }: LengthRule) {
  return z
    .string({ error: empty })
    .trim()
    .superRefine((value, context) => {
      const count = characters(value);
      const message = count === 0 ? empty : count < min ? tooShort : count > max ? tooLong : null;
      if (message) context.addIssue({ code: "custom", message });
    });
}

const enquirySchema = z.object({
  name: text({
    min: 2,
    max: 100,
    empty: "form.name.required",
    tooShort: "form.name.length",
    tooLong: "form.name.length",
  }),
  organisation: text({
    min: 2,
    max: 150,
    empty: "form.organisation.required",
    tooShort: "form.organisation.length",
    tooLong: "form.organisation.length",
  }),
  email: z
    .string({ error: "form.email.required" })
    .trim()
    .superRefine((value, context) => {
      if (value === "") {
        context.addIssue({ code: "custom", message: "form.email.required" });
      } else if (characters(value) > 254 || !emailFormat.test(value)) {
        context.addIssue({ code: "custom", message: "form.email.format" });
      }
    }),
  category: z.string({ error: "form.category.required" }).min(1, "form.category.required"),
  problem: text({
    min: 30,
    max: 3000,
    empty: "form.problem.tooShort",
    tooShort: "form.problem.tooShort",
    tooLong: "form.problem.tooLong",
  }),
  outcome: text({
    min: 10,
    max: 1000,
    empty: "form.outcome.tooShort",
    tooShort: "form.outcome.tooShort",
    tooLong: "form.outcome.tooLong",
  }),
  urgency: z.enum(urgencyValues, { error: "form.urgency.required" }),
  budget: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.enum(budgetValues, { error: "submit.failed" }).optional(),
  ),
  idempotencyKey: z.uuid({ error: "submit.failed" }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type EnquiryField = keyof EnquiryInput;
export type EnquiryFieldErrors = Partial<Record<EnquiryField, MessageKey>>;

export type EnquiryValidation =
  | { ok: true; data: EnquiryInput }
  | { ok: false; errors: EnquiryFieldErrors };

export function validateEnquiry(input: unknown): EnquiryValidation {
  const result = enquirySchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };

  const errors: EnquiryFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as EnquiryField;
    errors[field] ??= issue.message as MessageKey;
  }
  return { ok: false, errors };
}
