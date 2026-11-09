import { Suspense } from "react";
import { OfflineNotice } from "@/components/OfflineNotice";
import { PageState } from "@/components/PageState";
import { SignInLoader } from "@/features/auth/SignInLoader";
import { messages } from "@/lib/copy/messages";

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-9">
      <h1 className="text-2xl">{messages["nav.signIn"]}</h1>
      <OfflineNotice />
      <Suspense fallback={<PageState state="loading" />}>
        <SignInLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
