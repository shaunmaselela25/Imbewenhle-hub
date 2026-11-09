"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { TextArea } from "@/components/TextArea";
import { TextField } from "@/components/TextField";
import type { ServiceCategory } from "@/features/catalogue/getCategories";
import { messages, type MessageKey } from "@/lib/copy/messages";
import {
  budgetValues,
  urgencyValues,
  validateEnquiry,
  type EnquiryFieldErrors,
  type EnquiryInput,
} from "@/lib/validation/enquiry";
import type { SubmitResult } from "./submit";

type EnquiryFormProps = {
  categories: ServiceCategory[];
  selectedSlug: string;
  idempotencyKey: string;
  submit: (input: EnquiryInput) => Promise<SubmitResult>;
  profile?: { name: string | null; organisation: string | null; email: string };
};

const urgencyOptions = urgencyValues.map((value) => ({
  value,
  label: messages[`urgency.label.${value}`],
}));

const budgetOptions = budgetValues.map((value) => ({
  value,
  label: messages[`budget.label.${value}`],
}));

export function EnquiryForm({
  categories,
  selectedSlug,
  idempotencyKey,
  submit,
  profile,
}: EnquiryFormProps) {
  const router = useRouter();
  // Refreshing the route must not issue a new key: retries have to stay idempotent (BR9).
  const [formKey] = useState(idempotencyKey);
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [alert, setAlert] = useState<{ message: MessageKey; attempt: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alert) alertRef.current?.focus();
  }, [alert]);

  function showAlert(message: MessageKey) {
    setAlert((previous) => ({ message, attempt: (previous?.attempt ?? 0) + 1 }));
  }

  const errorFor = (field: keyof EnquiryFieldErrors) => {
    const key = errors[field];
    return key && messages[key];
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    if (!navigator.onLine) {
      setErrors({});
      showAlert("error.offline");
      return;
    }

    const values = Object.fromEntries(new FormData(event.currentTarget));
    const validation = validateEnquiry({ ...values, idempotencyKey: formKey });
    if (!validation.ok) {
      setErrors(validation.errors);
      showAlert("form.errorSummary");
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setErrors({});
    setAlert(null);

    try {
      const result = await submit(validation.data);
      if (result.status === "ok") {
        router.replace("/enquire/submitted");
        return;
      }
      setErrors(result.fieldErrors ?? {});
      showAlert(result.message);
    } catch {
      showAlert("submit.failed");
    }

    inFlight.current = false;
    setSubmitting(false);
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {alert && (
        <Alert ref={alertRef} tabIndex={-1} type="error">
          {messages[alert.message]}
        </Alert>
      )}

      <TextField
        label={messages["enquiry.label.name"]}
        name="name"
        autoComplete="name"
        defaultValue={profile?.name ?? undefined}
        required
        error={errorFor("name")}
      />
      <TextField
        label={messages["enquiry.label.organisation"]}
        name="organisation"
        autoComplete="organization"
        defaultValue={profile?.organisation ?? undefined}
        required
        error={errorFor("organisation")}
      />
      <TextField
        label={messages["enquiry.label.email"]}
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={profile?.email}
        readOnly={Boolean(profile)}
        required
        error={errorFor("email")}
      />
      <Select
        label={messages["enquiry.label.category"]}
        name="category"
        required
        placeholder={messages["form.choose"]}
        defaultValue={selectedSlug}
        options={categories.map(({ slug, title }) => ({ value: slug, label: title }))}
        error={errorFor("category")}
      />
      <TextArea
        label={messages["enquiry.label.problem"]}
        name="problem"
        required
        min={30}
        max={3000}
        error={errorFor("problem")}
      />
      <TextArea
        label={messages["enquiry.label.outcome"]}
        name="outcome"
        required
        min={10}
        max={1000}
        rows={3}
        error={errorFor("outcome")}
      />
      <Select
        label={messages["enquiry.label.urgency"]}
        name="urgency"
        required
        placeholder={messages["form.choose"]}
        options={urgencyOptions}
        error={errorFor("urgency")}
      />
      <Select
        label={`${messages["enquiry.label.budget"]} (${messages["form.optional"]})`}
        name="budget"
        placeholder={messages["form.choose"]}
        options={budgetOptions}
        error={errorFor("budget")}
      />

      <div className="flex flex-col gap-2 rounded-lg bg-surface p-4 text-sm text-text-muted">
        <p>{messages["privacy.explanation"]}</p>
        <Link href="/privacy" className="font-semibold text-primary-hover underline">
          {messages["privacy.link"]}
        </Link>
      </div>

      <Button type="submit" loading={submitting}>
        {messages[submitting ? "submit.buttonBusy" : "submit.button"]}
      </Button>
    </form>
  );
}
