// defineFeature — type-safe slice config helper.
//
// Adapted (not lifted) from superspace/frontend/shared/lib/features/defineFeature.ts.
// Superspace's version carries workspace+bundle+app-store metadata that doesn't
// belong in a kitab slice. The kitab version is intentionally small: it must
// stay 1:1 with the slice.json contract (packages/cli/lib/slice-schema.json).
//
// Fields here MUST be a strict subset of slice.json so a generator can derive
// one from the other. If you add a field here, mirror it in slice-schema.json.

import type { ComponentType, LazyExoticComponent } from "react";

export type SliceCategory =
  | "ai" | "auth" | "data" | "payment" | "email"
  | "realtime" | "storage" | "search" | "content" | "ui" | "infra";

export type SliceRoute = {
  /** App-router path the slice contributes (e.g., "/payments"). */
  path: string;
  /** Lazy view component. Use `() => import("./page").then(m => ({ default: m.default }))`. */
  view: () => Promise<{ default: ComponentType }> | LazyExoticComponent<ComponentType>;
  /** Whether the route requires an authenticated user. */
  requiresAuth?: boolean;
};

export type SliceNavEntry = {
  /** Sidebar label. */
  label: string;
  /** Sidebar group key — matches one of the registry generators' groups. */
  group: SliceCategory | "tools" | "settings";
  /** Lucide-react icon name (string), resolved at render time. */
  icon?: string;
  /** Sort order within the group. Lower = earlier. */
  order?: number;
};

export type SlicePeer = {
  slug: string;
  range: string;
  reason?: string;
};

export type SliceConfig = {
  /** Globally unique kebab-case id. MUST equal slice.json `slug`. */
  slug: string;
  /** Human-readable title. MUST equal slice.json `title`. */
  title: string;
  /** Slice category. MUST equal slice.json `category`. */
  category: SliceCategory;
  /** App routes contributed by this slice. */
  routes?: SliceRoute[];
  /** Sidebar / nav metadata. */
  nav?: SliceNavEntry;
  /** Peer slices this one depends on. MUST equal slice.json `deps.peers`. */
  peers?: SlicePeer[];
  /** Sub-providers if the slice supports multiple (e.g., payment: midtrans + doku). */
  providers?: string[];
};

/**
 * Type-narrowing helper. Validates structural shape at compile time and
 * returns the same value untouched. Use as the export of every slice's
 * `config.ts`:
 *
 * ```ts
 * export const midtransPaymentFeature = defineFeature({
 *   slug: "midtrans-payment",
 *   title: "Midtrans Payment",
 *   category: "payment",
 *   routes: [{ path: "/checkout", view: () => import("./page") }],
 *   nav: { label: "Checkout", group: "payment" },
 *   peers: [{ slug: "convex-auth", range: "^0.1" }],
 * });
 * ```
 */
export function defineFeature<C extends SliceConfig>(config: C): C {
  return config;
}
