"use client";

/** Block-list operations for the Notes editor host — pure transforms over
 *  the doc's `blocks` array, plus focus glue. Adapted from the rr
 *  notion-shell preview (page-demo.tsx). */

import { focusBlock, type Block, type BlockType } from "@/features/notion-shell";
import type { NotesDoc } from "./defaults";

type SetDoc = (next: NotesDoc | ((prev: NotesDoc) => NotesDoc)) => void;

const freshId = () => `b${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function useBlockOps(blocks: Block[], setDoc: SetDoc) {
  const setBlocks = (f: (cur: Block[]) => Block[]) =>
    setDoc((doc) => ({ ...doc, blocks: f(doc.blocks) }));

  const update = (id: string, patch: Partial<Block>) =>
    setBlocks((cur) => cur.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const turnInto = (id: string, type: BlockType) =>
    setBlocks((cur) => cur.map((x) => (x.id === id ? { ...x, type } : x)));
  const remove = (id: string) =>
    setBlocks((cur) => {
      const next = cur.filter((x) => x.id !== id);
      return next.length ? next : [{ id: freshId(), type: "paragraph", text: "" }];
    });
  const duplicate = (id: string) =>
    setBlocks((cur) => {
      const i = cur.findIndex((x) => x.id === id);
      if (i === -1) return cur;
      const next = [...cur];
      next.splice(i + 1, 0, { ...cur[i]!, id: freshId() });
      return next;
    });
  const insert = (type: BlockType) =>
    setBlocks((cur) => [...cur, { id: freshId(), type, text: "" }]);
  const move = (id: string, dir: -1 | 1) =>
    setBlocks((cur) => {
      const i = cur.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  const insertAfter = (afterId: string, type: BlockType, init?: Partial<Block>) => {
    const id = freshId();
    setBlocks((cur) => {
      const i = cur.findIndex((x) => x.id === afterId);
      const next = [...cur];
      next.splice(i + 1, 0, { id, type, text: "", ...init });
      return next;
    });
    return id;
  };
  const mergeBack = (id: string) => {
    const i = blocks.findIndex((x) => x.id === id);
    if (i <= 0) return;
    const prev = blocks[i - 1]!;
    focusBlock(prev.id, (prev.text ?? "").length);
    setBlocks((cur) => {
      const j = cur.findIndex((x) => x.id === id);
      if (j <= 0) return cur;
      const p = cur[j - 1]!;
      const merged = { ...p, text: (p.text ?? "") + (cur[j]!.text ?? "") };
      return [...cur.slice(0, j - 1), merged, ...cur.slice(j + 1)];
    });
  };
  const focusSibling = (id: string, dir: -1 | 1) => {
    const sib = blocks[blocks.findIndex((x) => x.id === id) + dir];
    if (sib) focusBlock(sib.id, dir > 0 ? 0 : undefined);
  };
  const removeMany = (ids: string[]) =>
    setBlocks((cur) => {
      const next = cur.filter((x) => !ids.includes(x.id));
      return next.length ? next : [{ id: freshId(), type: "paragraph", text: "" }];
    });
  const duplicateMany = (ids: string[]) =>
    setBlocks((cur) => [
      ...cur,
      ...cur.filter((x) => ids.includes(x.id)).map((x) => ({ ...x, id: freshId() })),
    ]);

  return {
    update, turnInto, remove, duplicate, insert, move, insertAfter,
    mergeBack, focusSibling, removeMany, duplicateMany,
  };
}
