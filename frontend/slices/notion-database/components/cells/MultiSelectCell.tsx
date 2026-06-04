"use client";

/** MultiSelectCell — multi-pick option cell. Thin wrapper over
 *  OptionPicker (shared with SelectCell to ensure identical UX). */

import type { SelectOption } from "../../types";
import { OptionPicker } from "./option-picker";

interface MultiSelectCellProps {
  options: SelectOption[];
  value: string[];
  readOnly?: boolean;
  onChange?: (next: string[]) => void;
  onOptionsChange?: (nextOptions: SelectOption[]) => void;
}

export function MultiSelectCell({ options, value, readOnly, onChange, onOptionsChange }: MultiSelectCellProps) {
  return (
    <OptionPicker
      mode="multi"
      options={options}
      value={Array.isArray(value) ? value : []}
      readOnly={readOnly}
      onChange={(next) => onChange?.((Array.isArray(next) ? next : []) as string[])}
      onOptionsChange={onOptionsChange}
    />
  );
}
