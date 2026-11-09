import { expect, type Page } from "@playwright/test";
import { magicLinkHash } from "../helpers/auth";

export async function signIn(page: Page, email: string, next = "") {
  const hash = await magicLinkHash(email);
  const query = next ? `&next=${encodeURIComponent(next)}` : "";
  await page.goto(`/auth/callback?token_hash=${hash}&type=magiclink${query}`);
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
}

export async function latestMagicLink(email: string): Promise<string> {
  const mail = "http://127.0.0.1:54324/api/v1";
  let id: string | undefined;

  await expect
    .poll(async () => {
      const response = await fetch(`${mail}/search?query=${encodeURIComponent(`to:"${email}"`)}`);
      const { messages } = await response.json();
      id = messages[0]?.ID;
      return id;
    })
    .toBeTruthy();

  const message = await (await fetch(`${mail}/message/${id}`)).json();
  const link = String(message.Text).match(/https?:\/\/\S+/)?.[0];
  if (!link) throw new Error("No sign-in link found in the email");
  return link;
}
