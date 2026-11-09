const headingClasses: Record<number, string> = { 1: "text-2xl", 2: "text-xl", 3: "text-lg" };

function renderBlock(block: string, index: number) {
  const heading = block.match(/^(#{1,3}) (.*)$/);
  if (heading) {
    const level = heading[1].length;
    const Tag = `h${level}` as "h1" | "h2" | "h3";
    return (
      <Tag key={index} className={headingClasses[level]}>
        {heading[2]}
      </Tag>
    );
  }

  const lines = block.split(/\r?\n/);
  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul key={index} className="flex list-inside list-disc flex-col gap-2 text-text-muted">
        {lines.map((line) => (
          <li key={line}>{line.slice(2)}</li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="text-text-muted">
      {lines.join(" ")}
    </p>
  );
}

// Text only, by design: nothing in the source can become HTML on the page.
export function MarkdownContent({ source }: { source: string }) {
  const blocks = source
    .trim()
    .split(/(?:\r?\n){2,}/)
    .filter(Boolean);

  return <div className="flex flex-col gap-4">{blocks.map(renderBlock)}</div>;
}
