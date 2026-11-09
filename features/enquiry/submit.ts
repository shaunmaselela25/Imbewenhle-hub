"use server";

import { cookies } from "next/headers";
import type { MessageKey } from "@/lib/copy/messages";
import { createClient } from "@/lib/supabase/server";
import { validateEnquiry, type EnquiryFieldErrors } from "@/lib/validation/enquiry";
import { confirmationCookie } from "./confirmationCookie";
import { persistEnquiry } from "./persistEnquiry";

export type SubmitResult =
  | { status: "ok" }
  | { status: "error"; message: MessageKey; fieldErrors?: EnquiryFieldErrors };

export async function submitEnquiry(input: unknown): Promise<SubmitResult> {
  const validation = validateEnquiry(input);
  if (!validation.ok) {
    return { status: "error", message: "form.errorSummary", fieldErrors: validation.errors };
  }

  const result = await persistEnquiry(await createClient(), validation.data);
  if (result.status === "error") return result;

  // BR7: this cookie is what S3 needs, so it exists only once the database has saved.
  (await cookies()).set(
    confirmationCookie,
    JSON.stringify({ reference: result.reference, email: validation.data.email }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600,
      path: "/",
    },
  );

  return { status: "ok" };
}
