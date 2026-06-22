import type { ComponentType } from "react";

// SSOT — the portable page-config contract. The builder (/t/custom) produces a
// PageConfig; BlockRenderer consumes one. Templates import these same types +
// REGISTRY + BlockRenderer to render an identical page from the same JSON.
// Plain data, framework-agnostic — safe to ship across repos unchanged.

export type FieldType = "text" | "textarea" | "select" | "boolean" | "list";

export interface Field {
  key: string; // prop key on the block; "" for primitive list items
  label: string;
  type: FieldType;
  options?: string[]; // for type "select"
  placeholder?: string;
  itemFields?: Field[]; // type "list" of objects
  item?: Field; // type "list" of primitives (e.g. string[])
  itemLabel?: string; // singular noun for the "Add ___" button
}

export interface BlockDef {
  type: string; // stable id, e.g. "featureGrid"
  name: string; // human label, e.g. "Feature grid"
  description?: string;
  // blocks are presentational + props-driven; the prop shape varies per block
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  fields: Field[];
  defaults: Record<string, unknown>; // starting props for a freshly added block
}

export interface BlockInstance {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface PageConfig {
  version: 1;
  blocks: BlockInstance[];
}
