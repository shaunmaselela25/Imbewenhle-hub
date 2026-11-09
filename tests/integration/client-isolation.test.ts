import type { SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";
import { getMyEnquiries } from "@/features/status/getMyEnquiries";
import { getMyEnquiry } from "@/features/status/getMyEnquiry";
import type { Database } from "@/lib/supabase/database.types";
import { accounts, signedInClient } from "../helpers/auth";

const clientBEnquiryId = "10000000-0000-4000-8000-0000000000b1";
const clientBReference = "IMB-SEEDB00001";

describe("client isolation (AC3)", () => {
  let naledi: SupabaseClient<Database>;

  beforeAll(async () => {
    naledi = await signedInClient(accounts.clientA);
  });

  it("T-US2-2 OP5 lists only Naledi's two enquiries", async () => {
    const result = await getMyEnquiries(naledi);
    expect(result.status === "ok" && result.enquiries.map(({ reference }) => reference).sort()).toEqual([
      "IMB-SEEDA00001",
      "IMB-SEEDA00002",
    ]);
  });

  it("T-US2-2 OP6 returns Naledi's own enquiry", async () => {
    const result = await getMyEnquiry(naledi, "IMB-SEEDA00002");
    expect(result.status === "ok" && result.enquiry.category).toBe("Systems Integration");
  });

  it("T-US2-2 OP6 cannot open Pieter's enquiry by reference", async () => {
    expect(await getMyEnquiry(naledi, clientBReference)).toEqual({ status: "notFound" });
  });

  it("T-US2-2 the direct API returns 0 rows by reference, id or filters", async () => {
    const queries = [
      naledi.from("enquiries").select("id").eq("public_reference", clientBReference),
      naledi.from("enquiries").select("id").eq("id", clientBEnquiryId),
      naledi.from("enquiries").select("id").eq("requester_email", accounts.clientB),
      naledi.from("client_enquiry_view").select("id").eq("public_reference", clientBReference),
      naledi.from("client_enquiry_view").select("id").eq("id", clientBEnquiryId),
      naledi.from("updates").select("id").eq("enquiry_id", clientBEnquiryId),
      naledi.from("proposals").select("id").eq("enquiry_id", clientBEnquiryId),
      naledi.from("milestones").select("id").eq("enquiry_id", clientBEnquiryId),
    ];

    for (const query of queries) {
      const { data, error } = await query;
      expect(error).toBeNull();
      expect(data).toEqual([]);
    }
  });
});
