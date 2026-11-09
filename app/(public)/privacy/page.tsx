import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MarkdownContent } from "@/components/MarkdownContent";

export default function PrivacyPage() {
  const source = readFileSync(join(process.cwd(), "content", "privacy.md"), "utf8");

  return (
    <div className="mx-auto max-w-5xl px-4 py-9">
      <MarkdownContent source={source} />
    </div>
  );
}
