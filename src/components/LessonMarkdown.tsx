import type { ReactNode } from "react";

/** Small locked-copy markdown renderer: headings, lists, details/summary, fences, blockquote, bold/italic. */
export function LessonMarkdown({ source }: { source: string }) {
  if (!source.trim()) return null;
  const blocks = splitBlocks(source);
  return (
    <div className="lesson-md space-y-4 text-base leading-relaxed text-white/75">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "code"; text: string }
  | { type: "details"; summary: string; body: string };

function splitBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.trim() === "<details>") {
      i += 1;
      let summary = "";
      if (lines[i]?.trim().startsWith("<summary>") && lines[i]?.trim().endsWith("</summary>")) {
        summary = lines[i].trim().replace(/^<summary>/, "").replace(/<\/summary>$/, "");
        i += 1;
      }
      const bodyLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "</details>") {
        bodyLines.push(lines[i]);
        i += 1;
      }
      if (lines[i]?.trim() === "</details>") i += 1;
      blocks.push({ type: "details", summary, body: bodyLines.join("\n").trim() });
      continue;
    }

    if (line.startsWith("```")) {
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (lines[i]?.startsWith("```")) i += 1;
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join("\n") });
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      i += 1;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].replace(/^[-*] /, ""));
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("```") &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      lines[i].trim() !== "<details>" &&
      lines[i].trim() !== "</details>"
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", text: para.join("\n") });
  }

  return blocks;
}

function Block({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="pt-6 font-display text-2xl text-white first:pt-0">{inline(block.text)}</h2>
      );
    case "h3":
      return <h3 className="pt-4 font-display text-xl text-white">{inline(block.text)}</h3>;
    case "p":
      return <p className="whitespace-pre-line">{inline(block.text)}</p>;
    case "ul":
      return (
        <ul className="list-disc space-y-2 pl-5 marker:text-cyan/70">
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="list-decimal space-y-2 pl-5 marker:text-cyan/70">
          {block.items.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ol>
      );
    case "blockquote":
      return (
        <blockquote className="surface rounded-2xl border-l-2 border-cyan/50 px-5 py-4 text-white/80">
          {inline(block.text)}
        </blockquote>
      );
    case "code":
      return (
        <pre className="surface overflow-x-auto rounded-2xl px-4 py-3 font-mono text-sm text-cyan/90 whitespace-pre-wrap">
          <code>{block.text}</code>
        </pre>
      );
    case "details":
      return (
        <details className="surface group rounded-2xl px-5 py-4">
          <summary className="cursor-pointer list-none text-sm font-medium tracking-wide text-cyan/90 hover:text-cyan">
            <span className="underline-offset-2 group-open:underline">{block.summary}</span>
          </summary>
          <div className="mt-3 space-y-3 text-sm text-white/55">
            <LessonMarkdown source={block.body} />
          </div>
        </details>
      );
  }
}

function inline(text: string): ReactNode {
  // **bold**, *italic*, and plain
  const nodes: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const token = m[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={key++} className="italic text-white/85">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length === 1 ? nodes[0] : <>{nodes}</>;
}
