import type { SupabaseClient } from "@supabase/supabase-js";
import type { EnquiryStatus } from "@/lib/rules/status";
import type { Database } from "@/lib/supabase/database.types";

export type EnquirySummary = {
  reference: string;
  category: string;
  status: EnquiryStatus;
  latestUpdate: string | null;
};

export type MyEnquiriesResult = { status: "ok"; enquiries: EnquirySummary[] } | { status: "error" };

export async function getMyEnquiries(client: SupabaseClient<Database>): Promise<MyEnquiriesResult> {
  const { data, error } = await client
    .from("client_enquiry_view")
    .select("public_reference, category_title, status, latest_update")
    .order("created_at", { ascending: false });

  if (error) return { status: "error" };

  return {
    status: "ok",
    enquiries: data.map((row) => ({
      reference: row.public_reference!,
      category: row.category_title!,
      status: row.status as EnquiryStatus,
      latestUpdate: row.latest_update,
    })),
  };
}
