// Audit log types — mirrors the public `AuditEvent` shape from
// frontend/slices/audit-log/types/index.ts. Kept local (not imported
// from the slice) so this block compiles without the slice barrel
// loaded — the slice is the canonical source if a consumer wires it
// up to real Convex bindings post-eject (see eject-spec.md).
//
// BT-wave (2026-05-20) — second admin-panel block with real impl
// (after BS-canary users).

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "invite"
  | "revoke"
  | "login"
  | "logout"
  | "export";

export type AuditEntityType =
  | "page"
  | "user"
  | "role"
  | "webhook"
  | "setting"
  | "post"
  | "workflow"
  | "session";

export type AuditSeverity = "info" | "warn" | "alert";

export type AuditEventRow = {
  id: string;
  /** ISO datetime — formatted relative on render. */
  at: string;
  actor: {
    id: string;
    name: string;
    initials: string;
    /** Role label only — for badge. */
    role: "owner" | "admin" | "editor" | "viewer" | "system";
  };
  action: AuditAction;
  entityType: AuditEntityType;
  entityId: string;
  entityLabel: string;
  severity: AuditSeverity;
  /** Optional short diff summary line ("status: draft → published"). */
  diffSummary?: string;
  /** Optional structured diff — mirrors frontend/slices/audit-log
   *  AuditEvent.diff. When present, the event row becomes
   *  expandable in the UI (CE-wave). */
  diff?: Record<string, { before: unknown; after: unknown }>;
  ipAddress?: string;
};
