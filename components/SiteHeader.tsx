import Link from "next/link";
import { signOut } from "@/features/auth/signOut";
import { isStaff, type Role } from "@/lib/auth/routes";
import { messages, type MessageKey } from "@/lib/copy/messages";

const linkClasses =
  "inline-flex min-h-touch items-center whitespace-nowrap text-sm font-semibold text-text";

function linksFor(role?: Role): { href: string; label: MessageKey }[] {
  if (!role) {
    return [
      { href: "/", label: "nav.services" },
      { href: "/sign-in", label: "nav.signIn" },
    ];
  }
  if (!isStaff(role)) return [{ href: "/dashboard", label: "nav.myEnquiries" }];

  const staffLinks: { href: string; label: MessageKey }[] = [{ href: "/staff", label: "nav.queue" }];
  if (role === "consultant") return staffLinks;
  return [
    ...staffLinks,
    { href: "/staff/admin/categories", label: "nav.servicesAdmin" },
    { href: "/staff/admin/users", label: "nav.users" },
  ];
}

export function SiteHeader({ role }: { role?: Role }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 px-4">
        <span className="text-sm font-semibold text-primary-hover">{messages["site.name"]}</span>
        <nav className="flex flex-wrap items-center gap-x-5">
          {linksFor(role).map(({ href, label }) => (
            <Link key={href} href={href} className={linkClasses}>
              {messages[label]}
            </Link>
          ))}
          {role && (
            <form action={signOut}>
              <button type="submit" className={linkClasses}>
                {messages["nav.signOut"]}
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
