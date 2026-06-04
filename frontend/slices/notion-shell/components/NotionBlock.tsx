"use client";

/** <NotionBlock /> — single-block renderer primitive. Dispatches via
 *  the `blockRenderers` registry prop. Text-shape blocks
 *  (paragraph/headings/list/quote/callout/code) render a minimal
 *  contentEditable shell with live inline-markdown decoration; for
 *  specialised types delegates to the registered renderer.
 *
 *  Hover reveals a "⋯" button (BlockActionsHandle → BlockActionsMenu).
 *  Typing "/" opens an inline SlashMenu (Radix Popover anchored to the
 *  contentEditable) and MARKDOWN_TRIGGERS convert on the fly (`# ` → h1,
 *  `- ` → bullet, etc.) — both gated on `onTurnInto`. Enter/Backspace/
 *  Arrow editing flow lives in blockKeyHandler.ts. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import type { Block, BlockRenderers, BlockType } from "../types";
import { TOP_LEVEL_PLACEHOLDERS } from "./placeholders";
import { BlockActionsHandle } from "./BlockActionsHandle";
import { SlashMenu } from "./SlashMenu";
import { decorateInPlace } from "../lib/inlineDecorator";
import { decideBlockInput } from "../lib/blockInputHandler";
import { handleBlockKeyDown } from "../lib/blockKeyHandler";
import { handleBlockPaste } from "../lib/blockPaste";
import { blockEditableClass } from "../lib/blockClassName";
import { blockColorClass } from "../lib/blockColors";

const HEADING_TYPES = new Set<BlockType>(["h1", "h2", "h3", "h4", "h5", "h6"]);

export interface NotionBlockProps {
  block: Block;
  pageId?: string;
  blockRenderers?: BlockRenderers;
  placeholders?: Partial<Record<BlockType, string>>;
  onUpdate?: (patch: Partial<Block>) => void;
  onRemove?: () => void;
  onTurnInto?: (type: BlockType) => void;
  onDuplicate?: () => void;
  /** Reorder one slot — surfaced in the block actions menu. */
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  // Editing-flow callbacks — see blockKeyHandler.ts (Enter/Backspace/Arrow).
  onInsertAfter?: (type: BlockType, init?: Partial<Block>) => string | void;
  onMergeBack?: () => void;
  onFocusSibling?: (dir: -1 | 1) => void;
  dragHandle?: ReactNode;
  readOnly?: boolean;
  className?: string;
}

export function NotionBlock({
  block, pageId,
  blockRenderers, placeholders,
  onUpdate, onRemove, onTurnInto, onDuplicate, onMoveUp, onMoveDown,
  onInsertAfter, onMergeBack, onFocusSibling,
  dragHandle,
  readOnly, className,
}: NotionBlockProps) {
  const Renderer = blockRenderers?.[block.type];
  const ref = useRef<HTMLDivElement | null>(null);
  const composingRef = useRef(false);
  const [hover, setHover] = useState(false);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el || composingRef.current) return;
    const next = block.text ?? "";
    if (el.innerText === next) return;
    decorateInPlace(el, next, { hideMarkers: HEADING_TYPES.has(block.type) });
  }, [block.text, block.type]);

  const closeSlash = () => {
    setSlashOpen(false);
    setSlashQuery("");
  };

  const handleSlashSelect = (type: BlockType) => {
    const el = ref.current;
    if (el) el.innerText = "";
    onUpdate?.({ text: "" });
    onTurnInto?.(type);
    closeSlash();
    // Restore focus to the block so the user can keep typing.
    requestAnimationFrame(() => ref.current?.focus());
  };

  const setColor = (color?: string, bgColor?: string) => onUpdate?.({ color, bgColor });
  const copyLink = () => navigator.clipboard?.writeText(
    `${typeof location !== "undefined" ? location.href.split("#")[0] : ""}#block-${block.id}`,
  );
  const actionsHandle = !readOnly && onTurnInto ? (
    <BlockActionsHandle
      currentType={block.type} onTurnInto={onTurnInto}
      onDuplicate={onDuplicate} onRemove={onRemove} dragHandle={dragHandle}
      color={block.color} bgColor={block.bgColor} onSetColor={setColor}
      onCopyLink={copyLink} onMoveUp={onMoveUp} onMoveDown={onMoveDown}
    />
  ) : null;

  if (Renderer) {
    return (
      <div className={cn("group/block relative my-1", blockColorClass(block.color, block.bgColor), className)} data-block-id={block.id}>
        <Renderer
          block={block}
          pageId={pageId}
          onUpdate={(patch) => onUpdate?.(patch)}
          onReplace={(next) => onUpdate?.({ ...next, id: block.id } as Partial<Block>)}
        />
        {actionsHandle}
      </div>
    );
  }

  const placeholder = placeholders?.[block.type] ?? TOP_LEVEL_PLACEHOLDERS[block.type] ?? "";
  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    if (composingRef.current) return;
    const el = e.currentTarget as HTMLElement;
    const text = el.innerText;
    const decision = decideBlockInput({ text, blockType: block.type, canTurnInto: !!onTurnInto, slashOpen });
    if (decision.kind === "markdownTrigger") {
      el.innerText = "";
      onUpdate?.({ text: "", ...(decision.patch ?? {}) });
      onTurnInto?.(decision.type);
      closeSlash();
      return;
    }

    onUpdate?.({ text });
    if (decision.kind === "slashOpen") {
      setSlashOpen(true);
      setSlashQuery(decision.query);
    } else if (decision.kind === "slashClose") {
      closeSlash();
    } else {
      decorateInPlace(el, text, { hideMarkers: HEADING_TYPES.has(block.type) });
    }
  };

  return (
    <div
      className={cn("group/block relative", blockColorClass(block.color, block.bgColor))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Popover
        open={slashOpen && !!onTurnInto}
        onOpenChange={(open) => { if (!open) closeSlash(); }}
        modal={false}
      >
        <PopoverAnchor asChild>
          <div
            ref={ref}
            data-block-id={block.id}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onCompositionStart={() => { composingRef.current = true; }}
            onCompositionEnd={(e) => {
              composingRef.current = false;
              const el = e.currentTarget as HTMLElement;
              const text = el.innerText;
              onUpdate?.({ text });
              decorateInPlace(el, text, { hideMarkers: HEADING_TYPES.has(block.type) });
            }}
            onInput={handleInput}
            onPaste={(e) => { if (!readOnly) handleBlockPaste(e, { block, onUpdate, onTurnInto, onInsertAfter }); }}
            onKeyDown={(e) => {
              if (readOnly) return;
              handleBlockKeyDown(e, {
                block, slashOpen, closeSlash, onTurnInto, onUpdate, onRemove,
                onDuplicate, onMoveUp, onMoveDown, onInsertAfter, onMergeBack, onFocusSibling,
              });
            }}
            data-placeholder={placeholder}
            style={block.indent ? { marginLeft: block.indent * 24 } : undefined}
            className={blockEditableClass(block.type, className)}
          />
        </PopoverAnchor>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          className="w-72 p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SlashMenu query={slashQuery} onSelect={handleSlashSelect} onClose={closeSlash} />
        </PopoverContent>
      </Popover>
      {hover && actionsHandle}
    </div>
  );
}
