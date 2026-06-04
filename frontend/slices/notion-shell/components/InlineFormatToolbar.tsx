"use client";

/** InlineFormatToolbar — floating rich-text toolbar over the current text
 *  selection inside any notion-shell contentEditable. Wraps the selection
 *  in markdown markers (the live decorator renders them), so it needs no
 *  block wiring: it edits the focused editable in place via
 *  `insertText`, which re-fires the block's own `onInput`. Mount once
 *  inside your page surface: `<InlineFormatToolbar />`.
 *
 *  Buttons mousedown-preventDefault so the selection survives the click. */

import { useEffect, useState } from "react";
import { Bold, Italic, Strikethrough, Code, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { wrapSelection } from "../lib/selectionFormat";

interface Pos { top: number; left: number }

function activeEditable(): HTMLElement | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const node = sel.anchorNode;
  const el = node?.nodeType === 1 ? (node as Element) : node?.parentElement;
  const host = el?.closest("[contenteditable='true']") as HTMLElement | null;
  return host && sel.toString().trim().length > 0 ? host : null;
}

export function InlineFormatToolbar({ className }: { className?: string }) {
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    const onSel = () => {
      const host = activeEditable();
      if (!host) { setPos(null); return; }
      const rect = window.getSelection()!.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) { setPos(null); return; }
      setPos({ top: rect.top - 8, left: rect.left + rect.width / 2 });
    };
    document.addEventListener("selectionchange", onSel);
    return () => document.removeEventListener("selectionchange", onSel);
  }, []);

  if (!pos) return null;

  const wrap = wrapSelection;

  const link = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const selected = sel.toString();
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    document.execCommand("insertText", false, `[${selected}](${url})`);
  };

  const Btn = ({ label, onAct, children }: { label: string; onAct: () => void; children: React.ReactNode }) => (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onAct}
      className="h-7 w-7 text-foreground/80"
    >
      {children}
    </Button>
  );

  return (
    <div
      role="toolbar"
      style={{ top: pos.top, left: pos.left }}
      className={cn(
        "fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-0.5 rounded-md border border-border bg-popover p-0.5 shadow-md",
        className,
      )}
    >
      <Btn label="Bold" onAct={() => wrap("**")}><Bold className="h-3.5 w-3.5" /></Btn>
      <Btn label="Italic" onAct={() => wrap("_")}><Italic className="h-3.5 w-3.5" /></Btn>
      <Btn label="Strikethrough" onAct={() => wrap("~~")}><Strikethrough className="h-3.5 w-3.5" /></Btn>
      <Btn label="Code" onAct={() => wrap("`")}><Code className="h-3.5 w-3.5" /></Btn>
      <Btn label="Link" onAct={link}><LinkIcon className="h-3.5 w-3.5" /></Btn>
    </div>
  );
}
