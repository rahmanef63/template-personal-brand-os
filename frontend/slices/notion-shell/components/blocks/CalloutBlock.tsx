"use client";

/** CalloutBlock — block-type "callout". A coloured admonition box with a
 *  leading kind icon (note / tip / warning / important / caution /
 *  default) and inline-editable text (live markdown decoration via the
 *  shared decorator). Click the icon to switch kind. Pure callback —
 *  writes `{ text }` + `{ calloutKind }` through `onUpdate`. */

import {
  Lightbulb, Info, AlertTriangle, Megaphone, OctagonAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Block, BlockRendererProps } from "../../types";
import { EditableLine } from "./EditableLine";

type CalloutKind = NonNullable<Block["calloutKind"]>;

interface KindMeta { icon: LucideIcon; label: string; box: string; tint: string }

const KINDS: Record<CalloutKind, KindMeta> = {
  default:   { icon: Lightbulb,    label: "Default",   box: "border-border bg-muted/50",                    tint: "text-muted-foreground" },
  note:      { icon: Info,         label: "Note",      box: "border-blue-500/30 bg-blue-500/10",            tint: "text-blue-600 dark:text-blue-400" },
  tip:       { icon: Lightbulb,    label: "Tip",       box: "border-green-500/30 bg-green-500/10",          tint: "text-green-600 dark:text-green-400" },
  warning:   { icon: AlertTriangle,label: "Warning",   box: "border-amber-500/30 bg-amber-500/10",          tint: "text-amber-600 dark:text-amber-400" },
  important: { icon: Megaphone,    label: "Important", box: "border-purple-500/30 bg-purple-500/10",        tint: "text-purple-600 dark:text-purple-400" },
  caution:   { icon: OctagonAlert, label: "Caution",   box: "border-red-500/30 bg-red-500/10",              tint: "text-red-600 dark:text-red-400" },
};

const KIND_ORDER: CalloutKind[] = ["default", "note", "tip", "warning", "important", "caution"];

export function CalloutBlock({ block, onUpdate }: BlockRendererProps) {
  const kind = (block.calloutKind ?? "default") as CalloutKind;
  const meta = KINDS[kind];
  const Icon = meta.icon;

  return (
    <div className={cn("flex items-start gap-2 rounded-md border px-3 py-2", meta.box)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Callout kind"
          className={cn("mt-0.5 shrink-0 rounded p-0.5 hover:bg-foreground/10", meta.tint)}
        >
          <Icon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {KIND_ORDER.map((k) => {
            const KIcon = KINDS[k].icon;
            return (
              <DropdownMenuItem key={k} onClick={() => onUpdate({ calloutKind: k })} className="gap-2 text-sm">
                <KIcon className={cn("h-3.5 w-3.5", KINDS[k].tint)} />
                {KINDS[k].label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <EditableLine
        text={block.text}
        onChange={(text) => onUpdate({ text })}
        placeholder="Type a callout…"
        className="min-w-0 flex-1 whitespace-pre-wrap break-words text-sm outline-none empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
