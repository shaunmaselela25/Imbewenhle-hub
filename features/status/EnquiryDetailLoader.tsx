import { requireClient } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { EnquiryDetail } from "./EnquiryDetail";
import { getMyEnquiry } from "./getMyEnquiry";

export async function EnquiryDetailLoader({ params }: { params: Promise<{ reference: string }> }) {
  await requireClient();
  const { reference } = await params;
  return <EnquiryDetail result={await getMyEnquiry(await createClient(), reference)} />;
}
