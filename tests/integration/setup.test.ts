import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

describe("setup", () => {
  it("T-SETUP-4 reaches the local Supabase API", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const health = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
    });
    expect(health.status).toBe(200);

    const { error } = await createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    }).auth.admin.listUsers({ perPage: 1 });
    expect(error).toBeNull();
  });
});
