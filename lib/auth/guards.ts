import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homeFor, isStaff, type Role } from "./routes";

export type Profile = {
  id: string;
  email: string;
  role: Role;
  name: string | null;
  organisation: string | null;
};

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, role, name, organisation")
    .eq("id", user.id)
    .maybeSingle();

  return data as Profile | null;
}

async function requireProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect("/sign-in");
  return profile;
}

export async function requireClient(): Promise<Profile> {
  const profile = await requireProfile();
  if (isStaff(profile.role)) redirect(homeFor(profile.role));
  return profile;
}

export async function requireStaff(): Promise<Profile> {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) redirect(homeFor(profile.role));
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireStaff();
  if (profile.role !== "admin") redirect("/staff");
  return profile;
}
