/**
 * Slice Composition Compiler — Phase A: runtime invariants.
 *
 * Extracted from contract.ts to keep the file ≤200 LOC. Each function checks
 * one invariant block; they all throw a descriptive {@link Error} on failure.
 *
 * @module packages/cli/lib/contract-validate
 */

import type { SliceContract } from "./contract-types";

// ---------------------------------------------------------------------------
// Runtime regexes
// ---------------------------------------------------------------------------

const KEBAB_CASE = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
// Plain semver — also tolerates pre-release + build metadata.
const SEMVER =
  /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const PREFIX = /^[a-z][a-z0-9_]*_$/;
const CONFLICT = /^[a-z][a-z0-9-]*:(routes|hooks|tables|events|components)\.[A-Za-z0-9_\-\/]+$/;
const PERMISSION = /^[^.]+\.[^.]+$/;

// ---------------------------------------------------------------------------
// Per-block validators
// ---------------------------------------------------------------------------

export function validateHeader(c: SliceContract): void {
  if (!c || typeof c !== "object") {
    throw new Error("defineSliceContract: expected an object, got " + typeof c);
  }
  if (typeof c.id !== "string" || !KEBAB_CASE.test(c.id)) {
    throw new Error(`defineSliceContract: id "${String(c.id)}" must be kebab-case`);
  }
  if (typeof c.version !== "string" || !SEMVER.test(c.version)) {
    throw new Error(`defineSliceContract(${c.id}): version "${String(c.version)}" is not semver`);
  }
  if (!c.requires || typeof c.requires !== "object") {
    throw new Error(`defineSliceContract(${c.id}): requires must be an object`);
  }
  if (!c.provides || typeof c.provides !== "object") {
    throw new Error(`defineSliceContract(${c.id}): provides must be an object`);
  }
}

export function validateRbac(c: SliceContract): void {
  if (!c.requires.rbac) return;
  if (!Array.isArray(c.requires.rbac)) {
    throw new Error(`defineSliceContract(${c.id}): requires.rbac must be an array`);
  }
  for (const p of c.requires.rbac) {
    if (typeof p !== "string" || !PERMISSION.test(p)) {
      throw new Error(
        `defineSliceContract(${c.id}): rbac entry "${String(p)}" must be "<domain>.<action>"`,
      );
    }
  }
}

export function validateConvex(c: SliceContract): void {
  const cx = c.requires.convex;
  if (!cx) return;
  if (typeof cx.prefix !== "string" || !PREFIX.test(cx.prefix)) {
    throw new Error(
      `defineSliceContract(${c.id}): convex.prefix "${String(cx.prefix)}" must match /^[a-z][a-z0-9_]*_$/`,
    );
  }
  if (!Array.isArray(cx.tables)) {
    throw new Error(`defineSliceContract(${c.id}): convex.tables must be an array`);
  }
  for (const t of cx.tables) {
    if (typeof t !== "string" || !t.startsWith(cx.prefix)) {
      throw new Error(
        `defineSliceContract(${c.id}): convex.tables entry "${String(t)}" must start with prefix "${cx.prefix}"`,
      );
    }
  }
  if (Array.isArray(c.provides.tables)) {
    for (const t of c.provides.tables) {
      if (typeof t !== "string" || !t.startsWith(cx.prefix)) {
        throw new Error(
          `defineSliceContract(${c.id}): provides.tables entry "${String(t)}" must start with prefix "${cx.prefix}"`,
        );
      }
    }
  }
}

export function validateBidir(c: SliceContract): void {
  if (c.bidir === undefined) return;
  if (!c.bidir || typeof c.bidir !== "object") {
    throw new Error(`defineSliceContract(${c.id}): bidir must be an object`);
  }
  const policies = ["auto-pr", "notify", "manual", "frozen"];
  if (!policies.includes(c.bidir.syncPolicy)) {
    throw new Error(
      `defineSliceContract(${c.id}): bidir.syncPolicy "${String(c.bidir.syncPolicy)}" must be one of ${policies.join("|")}`,
    );
  }
  if (!c.bidir.generalization || typeof c.bidir.generalization !== "object") {
    throw new Error(
      `defineSliceContract(${c.id}): bidir.generalization must be an object`,
    );
  }
  const levels = ["portable", "needs-adapter", "consumer-locked"];
  if (!levels.includes(c.bidir.generalization.level)) {
    throw new Error(
      `defineSliceContract(${c.id}): bidir.generalization.level "${String(c.bidir.generalization.level)}" must be one of ${levels.join("|")}`,
    );
  }
  const ft = c.bidir.generalization.forbiddenTerms;
  if (ft !== undefined) {
    if (!Array.isArray(ft)) {
      throw new Error(
        `defineSliceContract(${c.id}): bidir.generalization.forbiddenTerms must be an array`,
      );
    }
    for (const t of ft) {
      if (typeof t !== "string" || t.length === 0) {
        throw new Error(
          `defineSliceContract(${c.id}): bidir.generalization.forbiddenTerms entries must be non-empty strings`,
        );
      }
    }
  }
  const rp = c.bidir.generalization.requiredProps;
  if (rp !== undefined) {
    if (!Array.isArray(rp)) {
      throw new Error(
        `defineSliceContract(${c.id}): bidir.generalization.requiredProps must be an array`,
      );
    }
    for (const p of rp) {
      if (typeof p !== "string" || p.length === 0) {
        throw new Error(
          `defineSliceContract(${c.id}): bidir.generalization.requiredProps entries must be non-empty strings`,
        );
      }
    }
  }
}

export function validateConflicts(c: SliceContract): void {
  if (!c.conflicts) return;
  if (!Array.isArray(c.conflicts)) {
    throw new Error(`defineSliceContract(${c.id}): conflicts must be an array`);
  }
  for (const cf of c.conflicts) {
    if (typeof cf !== "string" || !CONFLICT.test(cf)) {
      throw new Error(
        `defineSliceContract(${c.id}): conflicts entry "${String(cf)}" must match "<slug>:<routes|hooks|tables|events|components>.<value>"`,
      );
    }
  }
}
