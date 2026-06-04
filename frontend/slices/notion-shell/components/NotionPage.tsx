"use client";

/** <NotionPage /> — top-level page shell. Optional cover image band on
 *  top, then header (icon + title + actions slot), then body slot.
 *  Drop in any React surface, pass data + change handlers, plug your
 *  own block list into `children`.
 */

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotionHeader, type NotionHeaderProps } from "./NotionHeader";

export interface NotionPageProps {
  icon: string;
  title: string;
  onIconChange?: (icon: string) => void;
  onTitleChange?: (title: string) => void;
  /** Forwarded to NotionHeader — host-provided icon renderer. */
  renderIcon?: NotionHeaderProps["renderIcon"];
  /** Forwarded to NotionHeader — host-provided icon picker. */
  renderIconPicker?: NotionHeaderProps["renderIconPicker"];
  /** Right-side header actions slot (share / more / history). */
  actions?: NotionHeaderProps["actions"];
  /** Optional cover image URL. When set, renders a 200px image band
   *  above the header. `onCoverRemove` adds an X button on hover. */
  cover?: string;
  onCoverRemove?: () => void;
  /** Vertical focal point of the cover image, 0–100 (default 50). */
  coverPosition?: number;
  /** Full custom cover band — when provided it renders in the cover slot
   *  INSTEAD of the built-in `cover` img (wire e.g. the `image-picker` slice's
   *  <ImageBanner /> for upload / Unsplash / reposition). */
  coverSlot?: ReactNode;
  /** Page body — your blocks list, database embed, etc. */
  children?: ReactNode;
  className?: string;
  /** Skip the header chrome (for embedded contexts). */
  headerless?: boolean;
  /** Body typeface. Applies to title + blocks. Default = sans. */
  font?: "default" | "serif" | "mono";
  /** Expand content to full container width (else centred max-w-3xl). */
  fullWidth?: boolean;
  /** Shrink the body font a notch (Notion "Small text"). */
  smallText?: boolean;
  /** Read-only page — disables the title/icon editors. (Block-level
   *  read-only stays the host's call — pass `readOnly` to your blocks.) */
  locked?: boolean;
}

export function NotionPage({
  icon, title,
  onIconChange, onTitleChange,
  renderIcon, renderIconPicker,
  actions, cover, onCoverRemove, coverPosition = 50, coverSlot,
  children, className, headerless,
  font = "default", fullWidth, smallText, locked,
}: NotionPageProps) {
  const widthClass = fullWidth ? "max-w-none" : "max-w-3xl";
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "";
  return (
    <div className={cn("flex h-full flex-col overflow-hidden", fontClass, className)}>
      {coverSlot ?? (cover && (
        <div className="group/cover relative h-48 w-full shrink-0 overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: `center ${coverPosition}%` }}
          />
          {onCoverRemove && (
            <Button
              variant="secondary"
              size="icon"
              aria-label="Remove cover"
              onClick={onCoverRemove}
              className="absolute right-3 top-3 h-7 w-7 opacity-0 transition group-hover/cover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ))}
      {!headerless && (
        <NotionHeader
          icon={icon}
          title={title}
          onIconChange={locked ? undefined : onIconChange}
          onTitleChange={locked ? undefined : onTitleChange}
          renderIcon={renderIcon}
          renderIconPicker={renderIconPicker}
          actions={actions}
          widthClassName={widthClass}
        />
      )}
      <div className="flex-1 overflow-y-auto">
        <div className={cn("mx-auto w-full px-4 py-6", widthClass, smallText && "text-sm")}>
          {children}
        </div>
      </div>
    </div>
  );
}
