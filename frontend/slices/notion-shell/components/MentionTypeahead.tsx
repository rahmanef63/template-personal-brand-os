"use client";

/** MentionTypeahead — `@`-trigger page/person mention popover. Mount once in
 *  your page surface: `<MentionTypeahead mentionables={pages} />`. Like
 *  InlineFormatToolbar it listens globally and edits the focused
 *  contentEditable in place (insertText fires the block's onInput), so it
 *  needs zero NotionBlock wiring. Typing `@que` filters the list; Enter / Tab
 *  inserts a markdown link `[icon Label](href)` over the `@que` trigger. */

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Mentionable {
  id: string;
  label: string;
  href: string;
  icon?: string;
}
export interface MentionTypeaheadProps {
  mentionables: Mentionable[];
  className?: string;
}

interface Trigger { query: string; top: number; left: number }
const RE = /(?:^|\s)@([\w-]{0,40})$/;

function activeEditable(): HTMLElement | null {
  const el = document.activeElement as HTMLElement | null;
  return el?.getAttribute("contenteditable") === "true" ? el : null;
}

function textBeforeCaret(host: HTMLElement): { text: string; sel: Selection } | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return null;
  const r = sel.getRangeAt(0).cloneRange();
  r.selectNodeContents(host);
  r.setEnd(sel.focusNode!, sel.focusOffset);
  return { text: r.toString(), sel };
}

export function MentionTypeahead({ mentionables, className }: MentionTypeaheadProps) {
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [active, setActive] = useState(0);
  const queryRef = useRef("");

  const matches = trigger
    ? mentionables
        .filter((m) => m.label.toLowerCase().includes(trigger.query.toLowerCase()))
        .slice(0, 6)
    : [];

  useEffect(() => {
    const onInput = () => {
      const host = activeEditable();
      if (!host) { setTrigger(null); return; }
      const before = textBeforeCaret(host);
      const m = before?.text.match(RE);
      if (!before || !m) { setTrigger(null); return; }
      queryRef.current = m[1] ?? "";
      const rect = before.sel.getRangeAt(0).getBoundingClientRect();
      setActive(0);
      setTrigger({ query: queryRef.current, top: rect.bottom + 4, left: rect.left });
    };
    document.addEventListener("input", onInput, true);
    return () => document.removeEventListener("input", onInput, true);
  }, []);

  const insert = (m: Mentionable) => {
    const host = activeEditable();
    const sel = window.getSelection();
    if (!host || !sel || sel.rangeCount === 0) return;
    const r = sel.getRangeAt(0);
    const back = queryRef.current.length + 1; // include the "@"
    if (r.startContainer.nodeType === 3 && r.startOffset >= back) {
      r.setStart(r.startContainer, r.startOffset - back);
      sel.removeAllRanges();
      sel.addRange(r);
    }
    const label = m.icon ? `${m.icon} ${m.label}` : m.label;
    document.execCommand("insertText", false, `[${label}](${m.href})`);
    setTrigger(null);
  };

  useEffect(() => {
    if (!trigger) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(matches.length - 1, a + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === "Escape") { setTrigger(null); }
      else if ((e.key === "Enter" || e.key === "Tab") && matches[active]) {
        e.preventDefault();
        insert(matches[active]!);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  });

  if (!trigger || matches.length === 0) return null;

  return (
    <div
      role="listbox"
      style={{ top: trigger.top, left: trigger.left }}
      className={cn(
        "fixed z-50 w-64 overflow-hidden rounded-md border border-border bg-popover p-1 shadow-md",
        className,
      )}
    >
      {matches.map((m, i) => (
        <Button
          key={m.id}
          type="button"
          variant="ghost"
          onMouseDown={(e) => { e.preventDefault(); insert(m); }}
          onMouseEnter={() => setActive(i)}
          className={cn(
            "flex h-auto w-full items-center justify-start gap-2 rounded px-2 py-1 text-left text-sm font-normal",
            i === active ? "bg-accent text-accent-foreground" : "text-foreground/80",
          )}
        >
          {m.icon && <span className="shrink-0">{m.icon}</span>}
          <span className="truncate">{m.label}</span>
        </Button>
      ))}
    </div>
  );
}
