"use client";

/** CodeBlock — built-in block-type "code". highlight.js syntax highlighting +
 *  language picker + copy. Inlined into notion-shell (was @/features/code-block)
 *  so the notion page block ships code highlighting out of the box. Pure
 *  BlockRendererProps — writes `{ text }` / `{ lang }` through onUpdate. */

import { useEffect, useMemo, useRef, useState } from "react";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";
import { Check, Copy, ChevronDown } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CODE_LANGUAGES, normalizeLang } from "../../lib/codeLanguages";
import type { BlockRendererProps } from "../../types";

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export function CodeBlock({ block, onUpdate, registerRef }: BlockRendererProps) {
  const text = block.text;
  const [focused, setFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const editRef = useRef<HTMLPreElement | null>(null);
  const language = normalizeLang(block.lang);
  const langLabel = CODE_LANGUAGES.find((l) => l.value === language)?.label ?? block.lang ?? "Plain text";

  const highlighted = useMemo(() => {
    if (!text) return "";
    try {
      if (language === "plaintext" || !hljs.getLanguage(language)) return escapeHtml(text);
      return hljs.highlight(text, { language, ignoreIllegals: true }).value;
    } catch {
      return escapeHtml(text);
    }
  }, [text, language]);

  useEffect(() => {
    const el = editRef.current;
    if (focused && el && el.innerText !== text) el.innerText = text;
  }, [focused, text]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    // audit-allow-hex: bg-[#0d1117] is GitHub's dark code surface (third-party
    // theme), intentionally a fixed hex — not a remappable theme token.
    <div className="group/code relative flex-1 overflow-hidden rounded-md border border-border bg-[#0d1117] font-mono text-sm">
      <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-3 py-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-auto gap-1 rounded px-1.5 py-0.5 text-[11px] font-normal text-white/60 hover:bg-white/5 hover:text-white/90 [&_svg]:size-3">
              {langLabel}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
            {CODE_LANGUAGES.map((l) => (
              <DropdownMenuItem key={l.value} onClick={() => onUpdate({ lang: l.value })}>
                {l.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" onClick={onCopy} className="h-auto gap-1 rounded px-1.5 py-0.5 text-[11px] font-normal text-white/60 opacity-0 transition group-hover/code:opacity-100 hover:bg-white/10 hover:text-white [&_svg]:size-3">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      {focused ? (
        <pre
          ref={(el) => { editRef.current = el; registerRef?.(el); }}
          contentEditable
          suppressContentEditableWarning
          spellCheck={false}
          onBlur={() => setFocused(false)}
          onInput={(e) => onUpdate({ text: (e.currentTarget as HTMLElement).innerText })}
          className="hljs min-h-[2.5em] whitespace-pre-wrap break-words px-4 py-3 text-[13px] leading-6 text-white/90 outline-none"
        />
      ) : (
        <pre
          ref={registerRef as never}
          tabIndex={0}
          onFocus={() => setFocused(true)}
          onClick={() => setFocused(true)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFocused(true); } }}
          className="hljs min-h-[2.5em] cursor-text whitespace-pre-wrap break-words px-4 py-3 text-[13px] leading-6 outline-none"
          dangerouslySetInnerHTML={{ __html: highlighted || `<span class="text-white/30">// language: ${langLabel}</span>` }}
        />
      )}
    </div>
  );
}
