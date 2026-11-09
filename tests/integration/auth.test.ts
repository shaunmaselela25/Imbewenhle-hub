import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/auth/callback/route";
import { accounts, anonClient, magicLinkHash } from "../helpers/auth";

const { store } = vi.hoisted(() => ({ store: new Map<string, string>() }));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    getAll: () => [...store].map(([name, value]) => ({ name, value })),
    set: (name: string, value: string) => store.set(name, value),
  }),
}));

const callback = (query: string) => GET(new Request(`http://localhost:3000/auth/callback?${query}`));
const tokenQuery = (hash: string) => `token_hash=${hash}&type=magiclink`;
const hasSession = () => [...store.keys()].some((name) => name.includes("auth-token"));
const location = (response: Response) => response.headers.get("location");

describe("OP4 complete sign-in", () => {
  beforeEach(() => store.clear());

  it("T-AUTH-2 sets a session and sends a client to S5", async () => {
    const response = await callback(tokenQuery(await magicLinkHash(accounts.clientA)));
    expect(location(response)).toBe("http://localhost:3000/dashboard");
    expect(hasSession()).toBe(true);
  });

  it.each([accounts.consultant, accounts.admin])("T-AUTH-2 sends %s to S7", async (email) => {
    const response = await callback(tokenQuery(await magicLinkHash(email)));
    expect(location(response)).toBe("http://localhost:3000/staff");
    expect(hasSession()).toBe(true);
  });

  it("T-AUTH-2 returns to the requested same-site page", async () => {
    const hash = await magicLinkHash(accounts.clientA);
    const response = await callback(`${tokenQuery(hash)}&next=%2Fdashboard%2Fenquiries%2FIMB-SEEDA00001`);
    expect(location(response)).toBe("http://localhost:3000/dashboard/enquiries/IMB-SEEDA00001");
  });

  it("T-AUTH-2 ignores a return path on another site", async () => {
    const hash = await magicLinkHash(accounts.clientA);
    const response = await callback(`${tokenQuery(hash)}&next=%2F%2Fevil.test`);
    expect(location(response)).toBe("http://localhost:3000/dashboard");
  });

  it("T-AUTH-3 sends a used link to S4 with signin.expired", async () => {
    const hash = await magicLinkHash(accounts.clientA);
    await anonClient().auth.verifyOtp({ token_hash: hash, type: "magiclink" });

    const response = await callback(tokenQuery(hash));

    expect(location(response)).toBe("http://localhost:3000/sign-in?error=expired");
    expect(hasSession()).toBe(false);
  });

  it.each([
    ["a made-up token", "token_hash=not-a-real-token&type=magiclink"],
    ["no token", ""],
    ["a provider error", "error=access_denied&error_code=otp_expired"],
  ])("T-AUTH-3 sends %s to S4 with signin.expired", async (_case, query) => {
    expect(location(await callback(query))).toBe("http://localhost:3000/sign-in?error=expired");
  });
});
