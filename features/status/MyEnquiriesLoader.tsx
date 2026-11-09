import { requireClient } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import { getMyEnquiries } from "./getMyEnquiries";
import { MyEnquiries } from "./MyEnquiries";

export async function MyEnquiriesLoader() {
  await requireClient();
  return <MyEnquiries result={await getMyEnquiries(await createClient())} />;
}
