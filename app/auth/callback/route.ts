import type { EmailOtpType, User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { homeFor, safeNext, type Role } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const supabase = await createClient();
  let user: User | null = null;

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    user = data.user;
  } else if (tokenHash && type) {
    const { data } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    user = data.user;
  }

  if (!user) return redirectTo("/sign-in?error=expired");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const home = homeFor((profile?.role as Role | undefined) ?? "client");
  return redirectTo(safeNext(searchParams.get("next")) ?? home);
}
