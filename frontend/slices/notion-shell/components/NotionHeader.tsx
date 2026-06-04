"use client";

/** <NotionHeader /> — page header primitive. Pure / props-driven; parent
 *  owns the data, this component only emits change callbacks. All
 *  callbacks optional → degrades to read-only when omitted.
 *
 *  Cover image support is intentionally stripped in the rr lift — host
 *  can render a cover surface above NotionPage if desired. */

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface NotionHeaderProps {
  icon: string;
  title: string;
  onIconChange?: (icon: string) => void;
  onTitleChange?: (title: string) => void;
  /** Host-provided icon renderer — receives the current icon string + a
   *  size class. Default fallback renders the string as plain text
   *  (suitable for emoji). Wire `@/features/icon-picker`'s `DynamicIcon`
   *  to get full lucide-name support. */
  renderIcon?: (icon: string, className?: string) => ReactNode;
  /** Host-provided picker trigger. When supplied, the header wraps the
   *  icon area with this node (e.g. an IconPickerPopover trigger). When
   *  omitted, clicking the icon button just fires `onIconChange("📄")`
   *  as a sentinel — host can react however. */
  renderIconPicker?: (args: {
    value: string;
    onChange: (next: string) => void;
    children: ReactNode;
  }) => ReactNode;
  /** Slot for right-side action buttons (share, more, history, etc). */
  actions?: ReactNode;
  placeholder?: string;
  className?: string;
  /** Max-width class for the header row — keep aligned with the page body
   *  (NotionPage passes it so full-width pages stay flush). */
  widthClassName?: string;
}

function defaultRenderIcon(icon: string, className?: string) {
  return <span className={className}>{icon}</span>;
}

export function NotionHeader({
  icon, title,
  onIconChange, onTitleChange,
  renderIcon = defaultRenderIcon,
  renderIconPicker,
  actions, placeholder = "Untitled",
  className, widthClassName = "max-w-3xl",
}: NotionHeaderProps) {
  const readonly = !onTitleChange;
  const iconButton = (
    <Button
      variant="ghost"
      size="icon"
      className="h-auto w-auto p-1 text-5xl hover:bg-accent/50"
      aria-label="Change icon"
    >
      {renderIcon(icon, "text-5xl")}
    </Button>
  );
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("mx-auto flex w-full items-start gap-3 px-4 pt-6", widthClassName)}>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {onIconChange && renderIconPicker
              ? renderIconPicker({ value: icon, onChange: onIconChange, children: iconButton })
              : onIconChange
              ? iconButton
              : renderIcon(icon, "text-5xl")}
          </div>
          {readonly ? (
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {title || placeholder}
            </h1>
          ) : (
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={placeholder}
              className="mt-2 h-auto border-0 bg-transparent p-0 text-3xl font-bold tracking-tight shadow-none focus-visible:ring-0"
            />
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-1">{actions}</div>
        )}
      </div>
    </div>
  );
}
