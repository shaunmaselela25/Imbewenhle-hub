import { createClient } from "@/lib/supabase/browser";

export async function sendSignInLink(email: string, next?: string): Promise<boolean> {
  const callback = new URL("/auth/callback", process.env.NEXT_PUBLIC_SITE_URL);
  if (next) callback.searchParams.set("next", next);

  const { error } = await createClient().auth.signInWithOtp({
    email,
    options: { emailRedirectTo: callback.toString() },
  });

  return !error;
}
