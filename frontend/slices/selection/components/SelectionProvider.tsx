"use client";

/** Selection — framework-agnostic multi-select for any vertical list.
 *
 *  Wrap the list area in <SelectionProvider onBulkDelete>; mark each item with
 *  <SelectableBlock id orderedIds> (sets data-selectable-id + the selected
 *  ring); drop a <SelectionMarquee containerRef> on the surface for drag-to-
 *  select. Selecting "activates" items (ring + data-block-selected attr).
 *
 *  Marquee is AutoCAD-style: drag RIGHT = window (only fully-enclosed items),
 *  drag LEFT = crossing (anything touched). Backspace/Delete bulk-deletes,
 *  Escape clears, click-outside clears, and a floating toolbar offers both. */

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";

export interface SelectionCtx {
  isSelected: (id: string) => boolean;
  size: number;
  snapshot: () => string[];
  selectOnly: (id: string) => void;
  toggle: (id: string) => void;
  selectRange: (id: string, orderedIds: string[]) => void;
  setIds: (ids: string[]) => void;
  clear: () => void;
}

const Ctx = createContext<SelectionCtx | null>(null);
export const useSelection = () => useContext(Ctx);

export function SelectionProvider({
  children, onBulkDelete, onBulkDuplicate,
}: {
  children: ReactNode;
  onBulkDelete?: (ids: string[]) => void;
  onBulkDuplicate?: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const anchorRef = useRef<string | null>(null);
  const liveRef = useRef(selected);
  liveRef.current = selected;

  const clear = useCallback(() => { anchorRef.current = null; setSelected(new Set()); }, []);
  const selectOnly = useCallback((id: string) => { anchorRef.current = id; setSelected(new Set([id])); }, []);
  const setIds = useCallback((ids: string[]) => {
    anchorRef.current = ids[ids.length - 1] ?? anchorRef.current;
    setSelected(new Set(ids));
  }, []);
  const toggle = useCallback((id: string) => {
    anchorRef.current = id;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);
  const selectRange = useCallback((id: string, ordered: string[]) => {
    const a = anchorRef.current ?? id;
    const from = ordered.indexOf(a), to = ordered.indexOf(id);
    if (from < 0 || to < 0) { anchorRef.current = id; setSelected(new Set([id])); return; }
    const [lo, hi] = from < to ? [from, to] : [to, from];
    setSelected(new Set(ordered.slice(lo, hi + 1)));
  }, []);

  const del = useCallback(() => {
    if (liveRef.current.size === 0) return;
    onBulkDelete?.([...liveRef.current]);
    clear();
  }, [onBulkDelete, clear]);
  const dup = useCallback(() => {
    if (liveRef.current.size === 0) return;
    onBulkDuplicate?.([...liveRef.current]);
  }, [onBulkDuplicate]);

  useEffect(() => {
    if (selected.size === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { clear(); return; }
      const editing = (e.target as HTMLElement)?.getAttribute?.("contenteditable") === "true";
      if (!editing && (e.key === "Backspace" || e.key === "Delete")) { e.preventDefault(); del(); }
    };
    const onDown = (e: PointerEvent) => {
      if (e.shiftKey || e.metaKey || e.ctrlKey) return; // additive marquee/click
      const t = e.target as HTMLElement;
      // Don't clear when interacting with a selectable item, its handles, or
      // the selection toolbar — only a bare empty-surface click clears.
      if (t.closest("[data-selectable-id]") || t.closest("[data-no-marquee]") || t.closest("[data-selection-toolbar]")) return;
      clear();
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onDown, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onDown, true);
    };
  }, [selected, clear, del]);

  return (
    <Ctx.Provider value={{ isSelected: (id) => selected.has(id), size: selected.size, snapshot: () => [...selected], selectOnly, toggle, selectRange, setIds, clear }}>
      {children}
      {selected.size > 0 && (
        <div data-selection-toolbar className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md border border-border bg-popover px-3 py-1.5 text-sm shadow-md">
          <span className="text-muted-foreground">{selected.size} selected</span>
          {onBulkDuplicate && (
            <Button type="button" variant="ghost" onClick={dup} className="h-auto rounded px-2 py-0.5 font-medium text-foreground hover:bg-muted">Duplicate</Button>
          )}
          <Button type="button" variant="ghost" onClick={del} className="h-auto rounded px-2 py-0.5 font-medium text-destructive hover:bg-destructive/10">Delete</Button>
          <Button type="button" variant="ghost" onClick={clear} className="h-auto rounded px-2 py-0.5 text-muted-foreground hover:bg-muted">Clear</Button>
        </div>
      )}
    </Ctx.Provider>
  );
}
