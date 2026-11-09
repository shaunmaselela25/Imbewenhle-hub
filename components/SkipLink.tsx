import { messages } from "@/lib/copy/messages";

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-background focus:p-3 focus:text-text"
    >
      {messages["skip.link"]}
    </a>
  );
}
