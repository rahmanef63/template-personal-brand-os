// Settings types — workspace-level config: identity, integrations,
// API keys, danger zone. No canonical slice (settings is a workspace
// chassis concern, not a slice).
//
// BX-wave (2026-05-21) — sixth + final admin-panel block.

export type WorkspaceIdentity = {
  name: string;
  slug: string;
  /** IANA timezone, e.g. "Asia/Jakarta". */
  timezone: string;
  /** ISO 639-1, e.g. "en". */
  language: string;
  /** Free-text contact email for billing + ops. */
  contactEmail: string;
};

export type IntegrationStatus = "connected" | "disconnected" | "error";

export type Integration = {
  id: string;
  label: string;
  category: "messaging" | "email" | "payments" | "deploy" | "vcs";
  status: IntegrationStatus;
  /** Short status detail line (e.g. "Posting to #ops"). */
  detail: string;
  docsUrl: string;
};

export type ApiKey = {
  id: string;
  label: string;
  /** Last 4 chars only. */
  tail: string;
  /** ISO datetime created. */
  createdAt: string;
  /** ISO datetime last used, or null. */
  lastUsedAt: string | null;
  scope: "read" | "read-write" | "admin";
};
