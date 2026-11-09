import { cookies } from "next/headers";
import { confirmationCookie } from "@/features/enquiry/confirmationCookie";

export async function POST() {
  (await cookies()).delete(confirmationCookie);
  return new Response(null, { status: 204 });
}
