/** inlineMd — pure tokenizer for inline markdown markers used by the
 *  contentEditable decorator. Slack-model: source-of-truth is plain text
 *  with `**bold**`, `_italic_`, `~~strike~~`, `` `code` ``, `$math$`,
 *  `[label](url)`. Greedy left-to-right, single-level only. No XSS
 *  surface (returns token list, not HTML). */

export type Token =
  | { kind: "text"; value: string }
  | { kind: "bold" | "italic" | "strike" | "code" | "math"; inner: string }
  | { kind: "link"; label: string; href: string };

const BOLD = /\*\*([^*\n]+)\*\*/;
const STRIKE = /~~([^~\n]+)~~/;
const CODE = /`([^`\n]+)`/;
const ITALIC = /(?:\*([^*\n]+)\*|_([^_\n]+)_)/;
const MATH = /\$([^$\n]+)\$/;
const LINK_MD = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/;
const BARE_URL = /(https?:\/\/[^\s)]+)/;

interface Match { idx: number; len: number; tok: Token }

function push(
  out: Match[],
  m: RegExpMatchArray | null,
  make: (m: RegExpMatchArray) => Token,
): void {
  if (!m || m.index === undefined) return;
  out.push({ idx: m.index, len: m[0].length, tok: make(m) });
}

/** Tokenise one source line (no `\n`). Order matters: code first to
 *  swallow markers inside backticks, then bold (longer marker than
 *  italic), strike, italic, links, bare urls. */
export function tokenizeInline(input: string): Token[] {
  if (!input) return [];
  const out: Token[] = [];
  let buf = input;
  while (buf.length > 0) {
    const matches: Match[] = [];
    push(matches, buf.match(CODE), (m) => ({ kind: "code", inner: m[1] }));
    push(matches, buf.match(MATH), (m) => ({ kind: "math", inner: m[1] }));
    push(matches, buf.match(BOLD), (m) => ({ kind: "bold", inner: m[1] }));
    push(matches, buf.match(STRIKE), (m) => ({ kind: "strike", inner: m[1] }));
    push(matches, buf.match(ITALIC), (m) => ({ kind: "italic", inner: m[1] ?? m[2] }));
    push(matches, buf.match(LINK_MD), (m) => ({ kind: "link", label: m[1], href: m[2] }));
    push(matches, buf.match(BARE_URL), (m) => ({ kind: "link", label: m[1], href: m[1] }));

    if (matches.length === 0) {
      out.push({ kind: "text", value: buf });
      break;
    }
    matches.sort((a, b) => a.idx - b.idx);
    const first = matches[0];
    if (first.idx > 0) out.push({ kind: "text", value: buf.slice(0, first.idx) });
    out.push(first.tok);
    buf = buf.slice(first.idx + first.len);
  }
  return out;
}

/** Strip inline-markdown markers. Inverse of the wrap-with-marker
 *  behaviour. Pure — testable without DOM. */
export function stripMd(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/(^|\W)_([^_]+?)_(?=\W|$)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|\/)[^\s)]+\)/g, "$1");
}
