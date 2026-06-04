/** notion-shell — block-renderer domain types.
 *
 *  Extracted from ./types.ts (CK-2C, 2026-05-24) to keep types.ts under
 *  the 200-LOC audit cap. Re-exported through ./index.ts and ./types.ts
 *  so external imports are unaffected.
 */

import type { ComponentType } from "react";

export type BlockType =
  | "paragraph"
  | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  | "todo" | "bullet" | "numbered"
  | "quote" | "code" | "divider"
  | "callout" | "page" | "database"
  | "image" | "equation" | "table" | "embed" | "button"
  | "toc" | "audio" | "video" | "toggle"
  | "columns2" | "columns3" | "columns4";

export interface Block {
  id: string;
  type: BlockType;
  text: string;
  checked?: boolean;
  lang?: string;
  pageId?: string;
  databaseId?: string;
  children?: Block[];
  /** Column buckets for "columns*" blocks — each entry is one column's
   *  block list. Length should match the type's column count. */
  columns?: Block[][];
  collapsed?: boolean;
  url?: string;
  caption?: string;
  tableRows?: string[][];
  tableHeader?: boolean;
  width?: number;
  align?: "left" | "center" | "right";
  indent?: number;
  calloutKind?: "note" | "tip" | "warning" | "important" | "caution" | "default";
  color?: string;
  bgColor?: string;
}

export interface BlockRendererProps {
  block: Block;
  pageId?: string;
  onUpdate: (patch: Partial<Block>) => void;
  onReplace?: (next: Block) => void;
  registerRef?: (el: HTMLElement | null) => void;
}

export type BlockRenderers = Partial<Record<BlockType, ComponentType<BlockRendererProps>>>;
