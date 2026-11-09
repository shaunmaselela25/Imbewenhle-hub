import type { SupabaseClient } from "@supabase/supabase-js";
import type { EnquiryStatus } from "@/lib/rules/status";
import type { Database } from "@/lib/supabase/database.types";
import type { EnquirySummary } from "./getMyEnquiries";

export type EnquiryDetails = EnquirySummary & {
  problem: string;
  outcome: string;
  submittedAt: string;
};

export type MyEnquiryResult =
  | { status: "ok"; enquiry: EnquiryDetails }
  | { status: "notFound" }
  | { status: "error" };

export async function getMyEnquiry(
  client: SupabaseClient<Database>,
  reference: string,
): Promise<MyEnquiryResult> {
  const { data, error } = await client
    .from("client_enquiry_view")
    .select(
      "public_reference, category_title, status, latest_update, problem_description, desired_outcome, created_at",
    )
    .eq("public_reference", reference)
    .maybeSingle();

  if (error) return { status: "error" };
  if (!data) return { status: "notFound" };

  return {
    status: "ok",
    enquiry: {
      reference: data.public_reference!,
      category: data.category_title!,
      status: data.status as EnquiryStatus,
      latestUpdate: data.latest_update,
      problem: data.problem_description!,
      outcome: data.desired_outcome!,
      submittedAt: data.created_at!,
    },
  };
}
