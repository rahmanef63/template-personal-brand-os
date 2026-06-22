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
  // When true the block holds NO items in its own props: it reads them from
  // PageConfig.collections[props.source] (injected as `items` by BlockRenderer).
  // Two such blocks pointing at the same source render ONE shared list.
  collection?: boolean;
}

export interface BlockInstance {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface PageConfig {
  version: 1;
  blocks: BlockInstance[];
  // Named shared item arrays. A `collection` block references one by name, so a
  // landing preview block and a dedicated full-page block render from ONE source:
  // edit the items once and every block (and page) using that name stays in sync.
  collections?: Record<string, Record<string, unknown>[]>;
}
