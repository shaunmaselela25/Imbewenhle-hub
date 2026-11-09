import { SiteHeader } from "@/components/SiteHeader";
import { getProfile } from "@/lib/auth/guards";

export async function SessionHeader() {
  const profile = await getProfile();
  return <SiteHeader role={profile?.role} />;
}
