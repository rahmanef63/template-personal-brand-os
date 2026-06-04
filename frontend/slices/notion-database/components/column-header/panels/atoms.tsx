/** Shared bits for the Edit-property config panels. */

import type { ReactNode } from "react";
import type { NumberFormat } from "../../../types";

export const NUMBER_FORMAT_LABELS: Record<NumberFormat, string> = {
  number: "Number (1,234)",
  decimal: "Decimal (1,234.50)",
  percent: "Percent (25%)",
  currency: "Currency ($1,234.50)",
};

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

/** Uniform shape every per-type panel receives. `onPatch` merges a
 *  partial Property; `db` / `databases` are present only when the host
 *  wired them (relation / rollup need the workspace catalog). */
export interface PanelProps {
  prop: import("../../../types").Property;
  onPatch: (patch: Partial<import("../../../types").Property>) => void;
  db?: import("../../../types").Database;
  databases?: import("../../../types").Database[];
}
