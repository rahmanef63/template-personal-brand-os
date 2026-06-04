import { cn } from "@/lib/utils";
import type { BlockType } from "../types";

/** Tailwind class string for the contentEditable shell of a text-shape
 *  NotionBlock. Extracted from NotionBlock so that file stays under
 *  the 200-LOC audit budget; also makes the per-type styling diffable
 *  in one place when porting to host overrides. */
export function blockEditableClass(type: BlockType, extra?: string): string {
  return cn(
    "outline-none whitespace-pre-wrap break-words py-1 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
    type === "h1" && "text-3xl font-bold tracking-tight",
    type === "h2" && "text-2xl font-semibold tracking-tight",
    type === "h3" && "text-xl font-semibold tracking-tight",
    type === "h4" && "text-lg font-semibold tracking-tight",
    type === "quote" && "border-l-4 border-foreground/40 pl-4 italic text-foreground/80",
    type === "code" && "rounded bg-muted px-2 py-1 font-mono text-sm",
    type === "callout" && "rounded-md border border-primary/20 bg-primary/10 px-3 py-2",
    type === "bullet" && "list-disc ml-5",
    type === "numbered" && "list-decimal ml-5",
    extra,
  );
}
