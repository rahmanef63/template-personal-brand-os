"use client";

/** EquationBlock — built-in block-type "equation". KaTeX-rendered LaTeX with
 *  click-to-edit. Inlined into notion-shell (was @/features/equation) so the
 *  notion page block ships block math out of the box. Pure BlockRendererProps
 *  — writes `{ text }` through onUpdate. */

import { useMemo, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Sigma, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/shared/error";
import type { BlockRendererProps } from "../../types";

function render(src: string): string {
  try {
    return katex.renderToString(src, { throwOnError: false, displayMode: true });
  } catch (e: unknown) {
    return `<span class="text-destructive text-xs">${getErrorMessage(e, "LaTeX error")}</span>`;
  }
}

export function EquationBlock({ block, onUpdate, registerRef }: BlockRendererProps) {
  const text = block.text;
  const [editing, setEditing] = useState(!text);
  const [draft, setDraft] = useState(text);
  const rendered = useMemo(() => (text ? render(text) : ""), [text]);
  const commit = () => { onUpdate({ text: draft }); setEditing(false); };

  if (editing) {
    return (
      <div className="flex-1 space-y-2 rounded-md border border-brand/40 bg-muted/30 p-3">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Sigma className="h-3 w-3" />
          <span>LaTeX block equation</span>
        </div>
        <textarea
          ref={registerRef as never}
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit(); }
            if (e.key === "Escape") { setDraft(text); setEditing(false); }
          }}
          placeholder={"e.g. \\frac{a}{b} = \\sqrt{c^2 + d^2}"}
          className="min-h-[60px] w-full resize-y rounded border border-border bg-background px-2 py-1.5 font-mono text-sm outline-none focus:border-brand"
        />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>⌘+Enter to render • Esc to cancel</span>
          <Button onClick={commit} className="h-auto rounded bg-foreground px-2 py-0.5 text-[11px] text-background hover:bg-foreground/90">Render</Button>
        </div>
        {draft && (
          <div className="overflow-x-auto rounded border border-border bg-card px-3 py-2">
            <div dangerouslySetInnerHTML={{ __html: render(draft) }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="group/eq relative flex-1 cursor-text rounded-md px-3 py-2 transition hover:bg-accent/30"
      onClick={() => { setDraft(text); setEditing(true); }}
      ref={registerRef as never}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setDraft(text); setEditing(true); } }}
    >
      {text ? (
        <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: rendered }} />
      ) : (
        <span className="text-sm italic text-muted-foreground/60">Empty equation — click to edit</span>
      )}
      <Button
        variant="ghost"
        type="button"
        size="icon"
        onClick={(e) => { e.stopPropagation(); setDraft(text); setEditing(true); }}
        className="absolute right-2 top-2 h-auto rounded p-1 text-muted-foreground opacity-0 group-hover/eq:opacity-100 [&_svg]:size-3"
        aria-label="Edit equation"
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  );
}
