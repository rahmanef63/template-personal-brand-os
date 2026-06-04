"use client";

/** DateCellSettings — the notion-page-clone-style options list at the foot of
 *  the date cell popover: End date toggle · Date format submenu · Include time
 *  toggle · Time format submenu (when time on) · Remind submenu · Clear. Date
 *  format / Include time / Time format / Remind are PROPERTY-level (patched via
 *  onPropPatch); End date is per-cell range mode; Clear wipes the value. */

import { ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Property } from "../../types";
import {
  DATE_FORMAT_LABELS, TIME_FORMAT_LABELS, NOTIFICATION_LABELS,
  type DateFormatKind, type TimeFormatKind, type NotificationKind,
} from "../../lib/dateFormat";

interface Props {
  prop?: Property;
  rangeMode: boolean;
  includeTime: boolean;
  hasValue: boolean;
  onRangeToggle: (next: boolean) => void;
  onPropPatch?: (patch: Partial<Property>) => void;
  onClear: () => void;
}

export function DateCellSettings({
  prop, rangeMode, includeTime, hasValue, onRangeToggle, onPropPatch, onClear,
}: Props) {
  const fmt: DateFormatKind = prop?.dateFormat ?? "full";
  const tfmt: TimeFormatKind = prop?.timeFormat ?? "12h";
  const notif: NotificationKind = prop?.dateNotification ?? "none";

  return (
    <div className="space-y-0.5 border-t border-border p-1">
      <Row label="End date" right={<Switch checked={rangeMode} onCheckedChange={(c) => onRangeToggle(!!c)} />} />
      {onPropPatch && (
        <>
          <SubmenuRow label="Date format" value={DATE_FORMAT_LABELS[fmt]}>
            {(Object.keys(DATE_FORMAT_LABELS) as DateFormatKind[]).map((k) => (
              <DropdownMenuItem key={k} onSelect={() => onPropPatch({ dateFormat: k })}>
                {DATE_FORMAT_LABELS[k]}{k === fmt && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </SubmenuRow>
          <Row label="Include time" right={
            <Switch checked={includeTime} onCheckedChange={(o) => onPropPatch({ dateIncludeTime: o || undefined })} />
          } />
          {includeTime && (
            <SubmenuRow label="Time format" value={TIME_FORMAT_LABELS[tfmt]}>
              {(Object.keys(TIME_FORMAT_LABELS) as TimeFormatKind[]).map((k) => (
                <DropdownMenuItem key={k} onSelect={() => onPropPatch({ timeFormat: k })}>
                  {TIME_FORMAT_LABELS[k]}{k === tfmt && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
              ))}
            </SubmenuRow>
          )}
          <SubmenuRow label="Remind" value={NOTIFICATION_LABELS[notif]}>
            {(Object.keys(NOTIFICATION_LABELS) as NotificationKind[]).map((k) => (
              <DropdownMenuItem key={k} onSelect={() => onPropPatch({ dateNotification: k === "none" ? undefined : k })}>
                {NOTIFICATION_LABELS[k]}{k === notif && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </SubmenuRow>
        </>
      )}
      <Button
        variant="ghost"
        onClick={onClear}
        disabled={!hasValue}
        className="h-auto w-full justify-start rounded px-2 py-1 text-sm font-normal text-muted-foreground"
      >
        Clear
      </Button>
    </div>
  );
}

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 text-sm">
      <span>{label}</span>
      {right}
    </div>
  );
}

function SubmenuRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full justify-between rounded px-2 py-1 text-sm font-normal [&_svg]:size-3">
          <span>{label}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">{value}<ChevronRight className="h-3 w-3" /></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-48">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
