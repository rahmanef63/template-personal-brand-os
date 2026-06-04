"use client";

/** NumberCell — typed number input + per-property format dropdown.
 *  Format options: number / decimal / percent / currency.
 *  - readOnly mode renders formatted value (e.g. "75%", "$1,234.50").
 *  - edit mode renders raw input; format dropdown lives in the
 *    per-property "..." menu via onPropertyChange. */

import type { NumberFormat, Property } from "../../types";

const FORMATTERS: Record<NumberFormat, (n: number, decimals: number, currency: string) => string> = {
  number:   (n, d) => Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "",
  decimal:  (n, d) => Number.isFinite(n) ? n.toFixed(d) : "",
  percent:  (n, d) => Number.isFinite(n) ? `${(n * 100).toFixed(d)}%` : "",
  currency: (n, d, currency) => Number.isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency, minimumFractionDigits: d, maximumFractionDigits: d })
    : "",
};

export function formatNumber(value: unknown, prop: Property): string {
  if (value === null || value === undefined || value === "") return "";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);
  const fmt = prop.numberFormat ?? "number";
  const decimals = typeof prop.numberDecimals === "number" ? prop.numberDecimals : 2;
  const currency = prop.numberCurrencyCode ?? "USD";
  return FORMATTERS[fmt](n, decimals, currency);
}

interface NumberCellProps {
  prop: Property;
  value: unknown;
  readOnly?: boolean;
  onChange?: (next: number | null) => void;
}

export function NumberCell({ prop, value, readOnly, onChange }: NumberCellProps) {
  if (readOnly) {
    const formatted = formatNumber(value, prop);
    return formatted
      ? <span className="text-sm text-foreground">{formatted}</span>
      : <span className="text-muted-foreground/60">—</span>;
  }

  return (
    <input
      type="number"
      value={(value as number | null) ?? ""}
      onChange={(e) => onChange?.(e.target.value === "" ? null : Number(e.target.value))}
      className="h-7 w-full rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
    />
  );
}
