import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonClasses } from "@/components/Button";
import { formatMessage, messages } from "@/lib/copy/messages";
import { ClearConfirmation } from "./ClearConfirmation";
import { confirmationCookie, parseConfirmation } from "./confirmationCookie";

export async function ConfirmationContent() {
  const confirmation = parseConfirmation((await cookies()).get(confirmationCookie)?.value);
  if (!confirmation) redirect("/");

  const { reference, email } = confirmation;

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-text p-6 text-background">
      <ClearConfirmation />
      <h1 className="text-2xl">{messages["confirm.heading"]}</h1>
      <p className="text-lg font-semibold">{formatMessage("confirm.reference", { reference })}</p>
      <ul className="flex flex-col gap-2 text-sm">
        <li>{messages["confirm.next1"]}</li>
        <li>{formatMessage("confirm.next2", { email })}</li>
      </ul>
      <Link href="/" className={buttonClasses("primary")}>
        {messages["confirm.return"]}
      </Link>
    </div>
  );
}
