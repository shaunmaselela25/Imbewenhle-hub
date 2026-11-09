import { safeNext } from "@/lib/auth/routes";
import { SignInForm } from "./SignInForm";

type SignInLoaderProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function SignInLoader({ searchParams }: SignInLoaderProps) {
  const { next, error } = await searchParams;
  const returnPath = typeof next === "string" ? safeNext(next) : null;

  return <SignInForm next={returnPath ?? undefined} expired={error === "expired"} />;
}
