import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const options = { auth: { persistSession: false, autoRefreshToken: false } };

export const accounts = {
  admin: "admin@imbewenhle.test",
  consultant: "consultant@imbewenhle.test",
  clientA: "client.a@example.test",
  clientB: "client.b@example.test",
};

export const adminClient = () =>
  createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, options);

export const anonClient = () =>
  createClient<Database>(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, options);

export async function magicLinkHash(email: string): Promise<string> {
  const { data, error } = await adminClient().auth.admin.generateLink({ type: "magiclink", email });
  if (error) throw error;
  return data.properties.hashed_token;
}

export async function signedInClient(email: string) {
  const client = anonClient();
  const { error } = await client.auth.verifyOtp({
    token_hash: await magicLinkHash(email),
    type: "magiclink",
  });
  if (error) throw error;
  return client;
}

export async function createConfirmedClient(testId: string, name: string, organisation: string) {
  const email = `${testId}-${randomUUID()}@example.test`;
  const admin = adminClient();
  const { data, error } = await admin.auth.admin.createUser({ email, email_confirm: true });
  if (error) throw error;
  await admin.from("profiles").update({ name, organisation }).eq("id", data.user.id);
  return email;
}
