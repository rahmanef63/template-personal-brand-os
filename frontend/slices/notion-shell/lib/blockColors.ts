/** Notion-style block colours — text + background. `color` tints the
 *  text, `bgColor` paints the block background (Notion keeps them
 *  independent). "default" = inherit (no class). Tailwind palette names,
 *  not hex, so theme + dark mode resolve automatically. */

import { cn } from "@/lib/utils";

export interface BlockColor { id: string; label: string; text: string; bg: string }

export const BLOCK_COLORS: BlockColor[] = [
  { id: "default", label: "Default", text: "",                  bg: "" },
  { id: "gray",    label: "Gray",    text: "text-gray-500",     bg: "bg-gray-500/10" },
  { id: "brown",   label: "Brown",   text: "text-amber-800 dark:text-amber-600", bg: "bg-amber-800/10" },
  { id: "orange",  label: "Orange",  text: "text-orange-600",   bg: "bg-orange-500/10" },
  { id: "yellow",  label: "Yellow",  text: "text-yellow-600",   bg: "bg-yellow-500/10" },
  { id: "green",   label: "Green",   text: "text-green-600",    bg: "bg-green-500/10" },
  { id: "blue",    label: "Blue",    text: "text-blue-600",     bg: "bg-blue-500/10" },
  { id: "purple",  label: "Purple",  text: "text-purple-600",   bg: "bg-purple-500/10" },
  { id: "pink",    label: "Pink",    text: "text-pink-600",     bg: "bg-pink-500/10" },
  { id: "red",     label: "Red",     text: "text-red-600",      bg: "bg-red-500/10" },
];

const BY_ID = new Map(BLOCK_COLORS.map((c) => [c.id, c]));

/** Wrapper className for a block's chosen text + background colour. */
export function blockColorClass(color?: string, bgColor?: string): string {
  const t = color && color !== "default" ? BY_ID.get(color)?.text : "";
  const b = bgColor && bgColor !== "default" ? BY_ID.get(bgColor)?.bg : "";
  return cn(t, b, b && "rounded-sm px-1");
}
