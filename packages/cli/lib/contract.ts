/**
 * Slice Composition Compiler — Phase A: typed contract DSL.
 *
 * Re-exports the type vocabulary from {@link ./contract-types} and the
 * runtime-checked {@link defineSliceContract} factory. The actual invariant
 * blocks live in {@link ./contract-validate} so each module stays ≤200 LOC.
 *
 * @module packages/cli/lib/contract
 */

import type { SliceContract } from "./contract-types";
import {
  validateHeader,
  validateRbac,
  validateConvex,
  validateBidir,
  validateConflicts,
} from "./contract-validate";

// Re-export the full type surface so existing imports keep working.
export type {
  AuthProvider,
  RBACPermission,
  ConvexNamespace,
  SliceContractRequires,
  SliceContractProvides,
  SliceSyncPolicy,
  GeneralizationLevel,
  SliceGeneralization,
  SliceBidirContract,
  SliceContract,
} from "./contract-types";

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Identity factory that runtime-validates a {@link SliceContract}.
 *
 * Throws a descriptive {@link Error} when the contract violates any of the
 * Phase-A invariants:
 *
 * - `id` must be kebab-case (`^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$`).
 * - `version` must be semver.
 * - When `requires.convex` is set, every `requires.convex.tables[i]` must
 *   start with `requires.convex.prefix`.
 * - When `requires.convex` is set and `provides.tables` is non-empty, every
 *   `provides.tables[i]` must start with `requires.convex.prefix`.
 * - Each `conflicts[i]` must match
 *   `<kebab-slug>:<routes|hooks|tables|events|components>.<value>`.
 * - Each `requires.rbac[i]` must be a `domain.action` pair (exactly one dot,
 *   non-empty halves).
 *
 * Returns the contract object unchanged so callers can write
 * `export const contract = defineSliceContract({ ... })`.
 *
 * @param c The contract to validate.
 * @returns The exact same object reference, narrowed to {@link SliceContract}.
 */
export function defineSliceContract(c: SliceContract): SliceContract {
  validateHeader(c);
  validateRbac(c);
  validateConvex(c);
  validateBidir(c);
  validateConflicts(c);
  return c;
}
