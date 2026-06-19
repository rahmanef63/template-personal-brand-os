// User management types — shared across all templates' admin-panel/users surface.
// BS-canary (2026-05-20) — first admin-panel block with real impl (vs the
// generic AdminFeatureCard placeholder). Pattern to replicate for the
// other 5 blocks (ai-config / analytics / audit-log / webhooks / settings).

export type RoleId = "owner" | "admin" | "editor" | "viewer";

export type Role = {
  id: RoleId;
  label: string;
  badgeClass: string;
  description: string;
  /** Capability summary — informational, not enforced in demo. */
  capabilities: string[];
};

export type UserStatus = "active" | "pending" | "suspended";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: RoleId;
  status: UserStatus;
  /** ISO datetime — formatted relative on render. */
  lastActive: string;
};
