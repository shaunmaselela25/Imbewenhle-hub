import type { SupabaseClient } from "@supabase/supabase-js";
import type { MessageKey } from "@/lib/copy/messages";
import type { Database } from "@/lib/supabase/database.types";
import type { EnquiryInput } from "@/lib/validation/enquiry";

export type PersistResult =
  | { status: "ok"; reference: string }
  | { status: "error"; message: MessageKey };

const errorMessages: Record<string, MessageKey> = {
  rate_limited: "submit.rateLimited",
  category_unavailable: "category.unavailable",
};

export async function persistEnquiry(
  client: SupabaseClient<Database>,
  input: EnquiryInput,
): Promise<PersistResult> {
  const { idempotencyKey, ...fields } = input;
  const { data, error } = await client.rpc("submit_enquiry", {
    p: { ...fields, idempotency_key: idempotencyKey },
  });

  if (error) return { status: "error", message: errorMessages[error.message] ?? "submit.failed" };
  return { status: "ok", reference: data };
}
