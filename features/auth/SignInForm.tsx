"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import { messages, type MessageKey } from "@/lib/copy/messages";
import { validateSignInEmail } from "@/lib/validation/signIn";
import { sendSignInLink } from "./sendSignInLink";

type SignInFormProps = {
  next?: string;
  expired?: boolean;
};

export function SignInForm({ next, expired = false }: SignInFormProps) {
  const [alert, setAlert] = useState<MessageKey | null>(expired ? "signin.expired" : null);
  const [fieldError, setFieldError] = useState<MessageKey | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setAlert(null);

    if (!navigator.onLine) {
      setFieldError(null);
      setAlert("error.offline");
      return;
    }

    const email = String(new FormData(event.currentTarget).get("email")).trim();
    const invalid = validateSignInEmail(email);
    setFieldError(invalid);
    if (invalid) return;

    setSending(true);
    try {
      if (await sendSignInLink(email, next)) {
        setSent(true);
      } else {
        setAlert("error.load");
      }
    } catch {
      setAlert("error.load");
    }
    setSending(false);
  }

  if (sent) return <Alert type="success">{messages["signin.sent"]}</Alert>;

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {alert && <Alert type="error">{messages[alert]}</Alert>}
      <p className="text-text-muted">{messages["signin.intro"]}</p>
      <TextField
        label={messages["signin.emailLabel"]}
        name="email"
        type="email"
        autoComplete="email"
        required
        error={fieldError ? messages[fieldError] : undefined}
      />
      <Button type="submit" loading={sending}>
        {messages["signin.button"]}
      </Button>
    </form>
  );
}
