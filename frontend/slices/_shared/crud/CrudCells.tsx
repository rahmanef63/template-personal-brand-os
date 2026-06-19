"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "./types";

/** Renders a single table cell value with optional badge/array/render-fn formatting. */
export function CellRender<T>({ col, row }: { col: ColumnDef<T>; row: T }) {
  const value = (row as Record<string, unknown>)[col.key];
  if (col.render) return <>{col.render(value, row)}</>;
  if (col.badge) {
    const variant = col.badge === true ? "outline" : col.badge;
    return (
      <Badge variant={variant as "outline" | "secondary" | "default"} className="text-[10px]">
        {String(value ?? "")}
      </Badge>
    );
  }
  if (Array.isArray(value)) return <>{value.join(", ")}</>;
  return <>{String(value ?? "")}</>;
}

/** Reads the first column's value as a human label — used in confirm()
 *  prompts (e.g. `Delete "<label>"?`). */
export function renderForLabel<T>(row: T, columns: ColumnDef<T>[]): string {
  const first = columns[0];
  if (!first) return "item";
  const value = (row as Record<string, unknown>)[first.key];
  return String(value ?? "item");
}
