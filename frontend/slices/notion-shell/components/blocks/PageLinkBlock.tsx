"use client";

/** PageLinkBlock — block-type "page". A sub-page reference row: file icon
 *  + editable title. Pure callback — title in `block.text`, the linked
 *  page id in `block.pageId`. Host can intercept clicks to navigate
 *  (wire `onOpenRow` at the registry level); here it's an inline-editable
 *  titled link styled like a Notion sub-page. */

import { FileText } from "lucide-react";
import type { BlockRendererProps } from "../../types";
import { EditableLine } from "./EditableLine";

export function PageLinkBlock({ block, onUpdate }: BlockRendererProps) {
  return (
    <div className="group/page flex items-center gap-2 rounded-md px-1 py-1 hover:bg-accent/40">
      <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
      <EditableLine
        text={block.text}
        onChange={(text) => onUpdate({ text })}
        placeholder="Untitled"
        className="min-w-0 flex-1 truncate border-b border-transparent text-sm font-medium underline-offset-2 outline-none group-hover/page:border-border empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
