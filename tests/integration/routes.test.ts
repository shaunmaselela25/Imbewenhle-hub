import { describe, expect, it, vi } from "vitest";
import { requireAdmin, requireClient, requireStaff } from "@/lib/auth/guards";
import { accounts, anonClient, signedInClient } from "../helpers/auth";

const { serverClient } = vi.hoisted(() => ({ serverClient: vi.fn() }));

vi.mock("@/lib/supabase/server", () => ({ createClient: serverClient }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
}));

async function signedInAs(email: string) {
  serverClient.mockResolvedValue(await signedInClient(email));
}

describe("server route checks, without the proxy", () => {
  it.each([accounts.consultant, accounts.admin])("T-SEC-20a requireStaff allows %s", async (email) => {
    await signedInAs(email);
    expect((await requireStaff()).email).toBe(email);
  });

  it("T-SEC-20b requireStaff sends a client to S5", async () => {
    await signedInAs(accounts.clientA);
    await expect(requireStaff()).rejects.toThrow("redirect:/dashboard");
  });

  it("T-SEC-20b requireStaff sends a logged-out visitor to S4", async () => {
    serverClient.mockResolvedValue(anonClient());
    await expect(requireStaff()).rejects.toThrow("redirect:/sign-in");
  });

  it("T-SEC-20a requireAdmin allows an administrator", async () => {
    await signedInAs(accounts.admin);
    expect((await requireAdmin()).role).toBe("admin");
  });

  it("T-SEC-20b requireAdmin sends a consultant to S7", async () => {
    await signedInAs(accounts.consultant);
    await expect(requireAdmin()).rejects.toThrow("redirect:/staff");
  });

  it("T-SEC-20b requireAdmin sends a client to S5", async () => {
    await signedInAs(accounts.clientA);
    await expect(requireAdmin()).rejects.toThrow("redirect:/dashboard");
  });

  it("T-SEC-20a requireClient allows a client", async () => {
    await signedInAs(accounts.clientA);
    expect((await requireClient()).role).toBe("client");
  });

  it("T-SEC-20b requireClient sends staff to S7", async () => {
    await signedInAs(accounts.consultant);
    await expect(requireClient()).rejects.toThrow("redirect:/staff");
  });
});
