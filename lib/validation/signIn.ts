import type { MessageKey } from "@/lib/copy/messages";
import { emailField } from "./enquiry";

export function validateSignInEmail(email: string): MessageKey | null {
  const result = emailField.safeParse(email);
  return result.success ? null : (result.error.issues[0].message as MessageKey);
}
