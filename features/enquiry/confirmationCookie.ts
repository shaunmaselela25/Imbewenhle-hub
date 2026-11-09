export const confirmationCookie = "confirmation";

export type Confirmation = { reference: string; email: string };

export function parseConfirmation(value: string | undefined): Confirmation | null {
  if (!value) return null;
  try {
    const { reference, email } = JSON.parse(value);
    return typeof reference === "string" && typeof email === "string" ? { reference, email } : null;
  } catch {
    return null;
  }
}
