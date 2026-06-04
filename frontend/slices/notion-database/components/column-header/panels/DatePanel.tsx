/** Date / created_time / last_edited_time config: display format,
 *  include-time, time format, and (for editable `date` only) the
 *  start→end range default that Calendar + Timeline read. */

import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DATE_FORMAT_LABELS, TIME_FORMAT_LABELS, NOTIFICATION_LABELS,
  type DateFormatKind, type TimeFormatKind, type NotificationKind,
} from "../../../lib/dateFormat";
import { Label, type PanelProps } from "./atoms";

export function DatePanel({ prop, onPatch }: PanelProps) {
  const fmt = prop.dateFormat ?? "full";
  const tfmt = prop.timeFormat ?? "12h";
  const notif = prop.dateNotification ?? "none";
  const includeTime = !!prop.dateIncludeTime;
  const isEditableDate = prop.type === "date";

  return (
    <div className="space-y-3">
      <div>
        <Label>Date format</Label>
        <Select value={fmt} onValueChange={(v) => onPatch({ dateFormat: v as DateFormatKind })}>
          <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(DATE_FORMAT_LABELS) as DateFormatKind[]).map((k) => (
              <SelectItem key={k} value={k}>{DATE_FORMAT_LABELS[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Include time</Label>
        <Switch
          checked={includeTime}
          onCheckedChange={(o) => onPatch({ dateIncludeTime: o || undefined })}
        />
      </div>

      {includeTime && (
        <div>
          <Label>Time format</Label>
          <Select value={tfmt} onValueChange={(v) => onPatch({ timeFormat: v as TimeFormatKind })}>
            <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(TIME_FORMAT_LABELS) as TimeFormatKind[]).map((k) => (
                <SelectItem key={k} value={k}>{TIME_FORMAT_LABELS[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label>Remind</Label>
        <Select value={notif} onValueChange={(v) => onPatch({ dateNotification: v === "none" ? undefined : (v as NotificationKind) })}>
          <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(NOTIFICATION_LABELS) as NotificationKind[]).map((k) => (
              <SelectItem key={k} value={k}>{NOTIFICATION_LABELS[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEditableDate && (
        <div className="flex items-center justify-between gap-2 rounded-md border border-border px-2 py-1.5">
          <div className="flex flex-col">
            <span className="text-xs font-medium">End date (range)</span>
            <span className="text-[11px] text-muted-foreground">
              Cells open as start→end; Calendar spans the days, Timeline draws the bar.
            </span>
          </div>
          <Switch
            checked={!!prop.dateRange}
            onCheckedChange={(o) => onPatch({ dateRange: o || undefined })}
          />
        </div>
      )}
    </div>
  );
}
