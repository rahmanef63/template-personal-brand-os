"use client";

/** DividerBlock — block-type "divider". A horizontal rule. No text, no
 *  edit affordance; the surrounding NotionBlock supplies the hover
 *  actions (turn-into / duplicate / delete). */

import type { BlockRendererProps } from "../../types";

export function DividerBlock(_props: BlockRendererProps) {
  return <hr className="my-2 border-t border-border" />;
}
