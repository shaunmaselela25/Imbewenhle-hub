import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { persistEnquiry } from "@/features/enquiry/persistEnquiry";
import { submitEnquiry } from "@/features/enquiry/submit";
import type { Database } from "@/lib/supabase/database.types";
import type { EnquiryInput } from "@/lib/validation/enquiry";

const { cookieSet, serverClient } = vi.hoisted(() => ({ cookieSet: vi.fn(), serverClient: vi.fn() }));

vi.mock("next/headers", () => ({ cookies: async () => ({ set: cookieSet }) }));
vi.mock("@/lib/supabase/server", () => ({ createClient: serverClient }));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const options = { auth: { persistSession: false } };
const anon = createClient<Database>(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, options);
const admin = createClient<Database>(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, options);

function enquiry(testId: string, change: Partial<EnquiryInput> = {}): EnquiryInput {
  return {
    name: "Test Person",
    organisation: "Test Organisation",
    email: `${testId}-${randomUUID()}@example.test`,
    category: "automation",
    problem: "a".repeat(30),
    outcome: "b".repeat(10),
    urgency: "low",
    idempotencyKey: randomUUID(),
    ...change,
  };
}

async function rowsFor(idempotencyKey: string) {
  const { data } = await admin
    .from("enquiries")
    .select("public_reference")
    .eq("idempotency_key", idempotencyKey);
  return data ?? [];
}

describe("OP2 submit enquiry", () => {
  beforeEach(() => cookieSet.mockClear());

  it("T-US1-1 saves a valid enquiry and returns a BR1 reference", async () => {
    const input = enquiry("t-us1-1");
    const result = await persistEnquiry(anon, input);

    expect(result.status === "ok" && result.reference).toMatch(/^IMB-[0-9A-HJKMNP-TV-Z]{10}$/);
    expect(await rowsFor(input.idempotencyKey)).toHaveLength(1);
  });

  it("T-US1-3 rejects invalid input that bypasses the browser and creates no row", async () => {
    const input = enquiry("t-us1-3", { problem: "too short" });
    const result = await persistEnquiry(anon, input);

    expect(result).toEqual({ status: "error", message: "submit.failed" });
    expect(await rowsFor(input.idempotencyKey)).toHaveLength(0);
  });

  it("T-BR9-3 returns one row and one reference for a repeated key", async () => {
    const input = enquiry("t-br9-3");
    const first = await persistEnquiry(anon, input);
    const second = await persistEnquiry(anon, input);

    expect(second).toEqual(first);
    expect(await rowsFor(input.idempotencyKey)).toHaveLength(1);
  });

  it("T-BR13-2 returns submit.rateLimited for the sixth submission from one email", async () => {
    const email = `t-br13-2-${randomUUID()}@example.test`;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await persistEnquiry(anon, enquiry("t-br13-2", { email }))).status).toBe("ok");
    }

    expect(await persistEnquiry(anon, enquiry("t-br13-2", { email }))).toEqual({
      status: "error",
      message: "submit.rateLimited",
    });
  });

  it("T-US1-3 maps an unavailable category to its message", async () => {
    expect(await persistEnquiry(anon, enquiry("t-us1-3", { category: "no-such-service" }))).toEqual({
      status: "error",
      message: "category.unavailable",
    });
  });

  it("T-BR7-1 sets no confirmation cookie when the RPC errors", async () => {
    serverClient.mockResolvedValue({
      rpc: async () => ({ data: null, error: { message: "boom" } }),
    });

    const result = await submitEnquiry(enquiry("t-br7-1"));

    expect(result).toEqual({ status: "error", message: "submit.failed" });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("T-BR7-1 sets no confirmation cookie when validation fails", async () => {
    const result = await submitEnquiry(enquiry("t-br7-1", { email: "name@" }));

    expect(result).toEqual({
      status: "error",
      message: "form.errorSummary",
      fieldErrors: { email: "form.email.format" },
    });
    expect(cookieSet).not.toHaveBeenCalled();
  });

  it("T-BR7-1 sets the short-lived confirmation cookie only after the server saves", async () => {
    serverClient.mockResolvedValue(anon);
    const input = enquiry("t-br7-1");

    const result = await submitEnquiry(input);

    expect(result).toEqual({ status: "ok" });
    expect(await rowsFor(input.idempotencyKey)).toHaveLength(1);
    const [name, value, cookie] = cookieSet.mock.calls[0];
    expect(name).toBe("confirmation");
    expect(JSON.parse(value).email).toBe(input.email);
    expect(JSON.parse(value).reference).toMatch(/^IMB-/);
    expect(cookie).toMatchObject({ httpOnly: true, sameSite: "lax", maxAge: 600 });
  });
});
