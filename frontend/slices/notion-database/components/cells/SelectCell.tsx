"use client";

/** SelectCell — single-pick option cell. Thin wrapper over OptionPicker
 *  (shared with MultiSelectCell to ensure identical UX). */

import type { SelectOption } from "../../types";
import { OptionPicker } from "./option-picker";

interface SelectCellProps {
  options: SelectOption[];
  value: string | null;
  readOnly?: boolean;
  onChange?: (next: string | null) => void;
  onOptionsChange?: (nextOptions: SelectOption[]) => void;
}

export function SelectCell({ options, value, readOnly, onChange, onOptionsChange }: SelectCellProps) {
  return (
    <OptionPicker
      mode="single"
      options={options}
      value={value}
      readOnly={readOnly}
      onChange={(next) => onChange?.((next as string | null) ?? null)}
      onOptionsChange={onOptionsChange}
    />
  );
}
