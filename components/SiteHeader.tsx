import Link from "next/link";
import { messages } from "@/lib/copy/messages";

const linkClasses =
  "inline-flex min-h-touch items-center whitespace-nowrap text-sm font-semibold text-text";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
        <span className="text-sm font-semibold text-primary-hover">{messages["site.name"]}</span>
        <nav className="flex gap-5">
          <Link href="/" className={linkClasses}>
            {messages["nav.services"]}
          </Link>
          <Link href="/sign-in" className={linkClasses}>
            {messages["nav.signIn"]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
