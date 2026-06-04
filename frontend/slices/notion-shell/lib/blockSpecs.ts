/** BLOCK_SPECS — metadata registry for slash menu + block actions menu.
 *
 *  Pure data. Icon refs come from lucide-react. Consumers can extend by
 *  passing a `specs` prop to <SlashMenu> / <BlockActionsMenu>; the
 *  baseline below covers the Notion-canonical block set. */

import {
  Type, Heading1, Heading2, Heading3,
  ListTodo, List, ListOrdered,
  Quote, Code, Minus, Lightbulb, FileText, Database,
  ChevronRight, Image as ImageIcon, Sigma, Table, Tv2,
  Film, Music, MousePointerClick, Columns2, Columns3, Columns4,
  type LucideIcon,
} from "lucide-react";
import type { BlockType } from "../types";

export interface BlockSpec {
  type: BlockType;
  label: string;
  hint: string;
  icon: LucideIcon;
  keywords: string[];
}

export const BLOCK_SPECS: BlockSpec[] = [
  { type: "paragraph", label: "Text", hint: "Just start writing with plain text", icon: Type, keywords: ["text", "paragraph", "p"] },
  { type: "h1", label: "Heading 1", hint: "Big section heading", icon: Heading1, keywords: ["h1", "heading", "title"] },
  { type: "h2", label: "Heading 2", hint: "Medium section heading", icon: Heading2, keywords: ["h2", "heading"] },
  { type: "h3", label: "Heading 3", hint: "Small section heading", icon: Heading3, keywords: ["h3", "heading"] },
  { type: "todo", label: "To-do", hint: "Track tasks with a checkbox", icon: ListTodo, keywords: ["todo", "task", "check"] },
  { type: "bullet", label: "Bulleted list", hint: "Create a simple list", icon: List, keywords: ["bullet", "list", "ul"] },
  { type: "numbered", label: "Numbered list", hint: "Create an ordered list", icon: ListOrdered, keywords: ["numbered", "ol"] },
  { type: "toggle", label: "Toggle", hint: "Collapsible section", icon: ChevronRight, keywords: ["toggle", "collapse", "accordion"] },
  { type: "quote", label: "Quote", hint: "Capture a quote", icon: Quote, keywords: ["quote"] },
  { type: "callout", label: "Callout", hint: "Make writing stand out", icon: Lightbulb, keywords: ["callout", "info"] },
  { type: "code", label: "Code", hint: "Code block with syntax highlight", icon: Code, keywords: ["code"] },
  { type: "equation", label: "Equation", hint: "Block math (LaTeX/KaTeX)", icon: Sigma, keywords: ["equation", "math", "latex", "formula"] },
  { type: "image", label: "Image", hint: "Embed an image from a URL", icon: ImageIcon, keywords: ["image", "img", "photo", "picture"] },
  { type: "divider", label: "Divider", hint: "Visual separator", icon: Minus, keywords: ["divider", "hr"] },
  { type: "page", label: "Page", hint: "Embed or create a sub-page", icon: FileText, keywords: ["page", "subpage", "doc"] },
  { type: "button", label: "Button", hint: "A clickable button that opens a link", icon: MousePointerClick, keywords: ["button", "cta", "action", "link"] },
  { type: "database", label: "Database", hint: "Inline database with multiple views", icon: Database, keywords: ["database", "db", "kanban", "board"] },
  { type: "table", label: "Table", hint: "Plain table grid", icon: Table, keywords: ["table", "grid", "spreadsheet"] },
  { type: "embed", label: "Embed", hint: "YouTube · Vimeo · Loom · Figma · CodePen", icon: Tv2, keywords: ["embed", "iframe", "youtube", "vimeo"] },
  { type: "columns2", label: "2 columns", hint: "Two side-by-side columns", icon: Columns2, keywords: ["columns", "column", "2", "layout", "split"] },
  { type: "columns3", label: "3 columns", hint: "Three side-by-side columns", icon: Columns3, keywords: ["columns", "column", "3", "layout"] },
  { type: "columns4", label: "4 columns", hint: "Four side-by-side columns", icon: Columns4, keywords: ["columns", "column", "4", "layout"] },
  { type: "video", label: "Video", hint: "Embed a video by URL", icon: Film, keywords: ["video", "mp4", "movie", "clip"] },
  { type: "audio", label: "Audio", hint: "Embed an audio clip by URL", icon: Music, keywords: ["audio", "mp3", "sound", "music", "podcast"] },
];

/** Spec lookup by block type — returns `undefined` for unknown types. */
export function specFor(type: BlockType): BlockSpec | undefined {
  return BLOCK_SPECS.find((s) => s.type === type);
}
