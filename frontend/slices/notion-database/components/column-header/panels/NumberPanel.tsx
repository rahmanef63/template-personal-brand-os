/** Number / decimal / percent / currency formatting config. */

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { NumberFormat } from "../../../types";
import { COMMON_CURRENCIES } from "../../../lib/numberFormat";
import { Label, NUMBER_FORMAT_LABELS, type PanelProps } from "./atoms";

export function NumberPanel({ prop, onPatch }: PanelProps) {
  const format = (prop.numberFormat ?? "number") as NumberFormat;
  const decimals = String(
    prop.numberDecimals ?? (format === "number" ? 0 : format === "percent" ? 0 : 2),
  );
  return (
    <>
      <div>
        <Label>Format</Label>
        <Select value={format} onValueChange={(v) => onPatch({ numberFormat: v as NumberFormat })}>
          <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(NUMBER_FORMAT_LABELS) as NumberFormat[]).map((f) => (
              <SelectItem key={f} value={f}>{NUMBER_FORMAT_LABELS[f]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Decimals</Label>
          <Select value={decimals} onValueChange={(v) => onPatch({ numberDecimals: Number(v) })}>
            <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {format === "currency" && (
          <div>
            <Label>Currency</Label>
            <Select
              value={prop.numberCurrencyCode ?? "USD"}
              onValueChange={(v) => onPatch({ numberCurrencyCode: v })}
            >
              <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COMMON_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </>
  );
}
