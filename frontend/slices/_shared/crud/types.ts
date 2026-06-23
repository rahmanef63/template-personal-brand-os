import type * as React from "react";

/** Column definition for CrudListView. */
export type ColumnDef<T> = {
  key: keyof T & string;
  header: string;
  /** Width Tailwind class (e.g. "w-[16%]"). */
  width?: string;
  /** Optional renderer for non-string fields. Default = String(value). */
  render?: (value: unknown, row: T) => React.ReactNode;
  /** Mono font + smaller text. */
  mono?: boolean;
  /** Render as Badge instead of plain text. */
  badge?: boolean | "outline" | "secondary" | "default";
  /** Hide this column below the md breakpoint. Use for secondary fields
   *  so narrow screens show only the essentials. The first column is
   *  always visible (treated as the label). */
  hideOnMobile?: boolean;
};

/** Field definition for CrudFormView.
 *
 *  `wide?: true` (text/select/number/image/position) makes the field
 *  span both columns (sm:col-span-2). textarea / tags are always wide.
 *  `hint?` renders as muted helper text below the input.
 *  `when?` is a predicate over the live draft row — return false to hide the
 *  field for the current values (e.g. hero-only fields on non-hero kinds).
 *  `group: "advanced"` tucks the field behind a collapsible <details> so the
 *  form leads with the essentials; default ("content") renders up top. */
type FieldCommon = {
  when?: (row: Record<string, unknown>) => boolean;
  group?: "content" | "advanced";
};
export type FieldDef<T> = (
  | { kind: "text"; key: keyof T & string; label: string; mono?: boolean; placeholder?: string; hint?: string; wide?: boolean }
  | { kind: "textarea"; key: keyof T & string; label: string; rows?: number; mono?: boolean; placeholder?: string; hint?: string }
  | { kind: "number"; key: keyof T & string; label: string; min?: number; max?: number; step?: number; hint?: string; wide?: boolean }
  | { kind: "select"; key: keyof T & string; label: string; options: { value: string; label: string }[]; hint?: string; wide?: boolean }
  | { kind: "tags"; key: keyof T & string; label: string; hint?: string }
  | { kind: "switch"; key: keyof T & string; label: string; hint?: string }
  | { kind: "date"; key: keyof T & string; label: string; hint?: string }
  /** URL text input with live preview thumbnail when value is a URL or path. */
  | { kind: "image"; key: keyof T & string; label: string; placeholder?: string; hint?: string; wide?: boolean }
  /** Rich image picker (image-picker slice): color/gradient/URL/Unsplash + banner preview. */
  | { kind: "imagePicker"; key: keyof T & string; label: string; hint?: string; wide?: boolean }
  /** Icon picker (icon-picker slice): emoji / lucide / phosphor token. */
  | { kind: "icon"; key: keyof T & string; label: string; hint?: string; wide?: boolean }
  /** BE-wave — dynamic position dropdown. Options are derived from the
   *  CrudController's sibling items: 1..N (for existing row) or 1..N+1
   *  (for new row). Prevents manual conflicts. CrudFieldInput needs the
   *  `siblings` context which CrudRowDialog / CrudFormView thread through. */
  | { kind: "position"; key: keyof T & string; label: string; hint?: string; wide?: boolean }
  | {
      kind: "custom";
      key: keyof T & string;
      label: string;
      hint?: string;
      wide?: boolean;
      render: (
        value: unknown,
        onChange: (v: unknown) => void,
        ctx?: { total: number; editing: boolean; row?: Record<string, unknown> },
      ) => React.ReactNode;
    }
) & FieldCommon;

/** Adapter the template wires from its store dispatch. Generic CRUD
 *  components consume this — no direct store coupling.
 *
 *  Optional `moveUp` / `moveDown` opt the list into per-row reorder
 *  arrows (CrudListView renders them when both are provided). */
export type CrudController<T> = {
  items: T[];
  getId: (item: T) => string;
  blank: () => T;
  create: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  moveUp?: (id: string) => void;
  moveDown?: (id: string) => void;
};

export type EntityMeta = {
  /** Singular human label (e.g. "Customer"). */
  label: string;
  /** Plural human label (e.g. "Customers"). */
  labelPlural: string;
  /** Optional public URL pattern for "View public" button.
   *  Receives the entity, returns absolute href or null. */
  publicHref?: (item: unknown) => string | null;
};
