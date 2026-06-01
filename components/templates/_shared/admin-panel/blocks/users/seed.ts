import { TONES } from "../../ui/tones";
import type { Role, UserRow } from "./types";

/** System roles — 4-tier (owner > admin > editor > viewer).
 *  Real RBAC implementation would come from frontend/slices/rbac-roles
 *  (canonical source — see lib/content/slices.ts). For demo, the
 *  capabilities list is informational only. */
export const ROLES: Role[] = [
  {
    id: "owner",
    label: "Owner",
    badgeClass: TONES.elevated.badge,
    description: "Full workspace control. One per template install.",
    capabilities: [
      "Manage billing + workspace settings",
      "Invite + remove members (including admins)",
      "Delete workspace + transfer ownership",
      "All editor + admin + viewer capabilities",
    ],
  },
  {
    id: "admin",
    label: "Admin",
    badgeClass: TONES.accent.badge,
    description: "Operates the workspace day-to-day. Multiple per workspace.",
    capabilities: [
      "Invite + remove members (not other admins)",
      "Configure AI / analytics / webhooks",
      "Manage roles + permissions",
      "All editor + viewer capabilities",
    ],
  },
  {
    id: "editor",
    label: "Editor",
    badgeClass: TONES.success.badge,
    description: "Creates and edits content. Cannot manage members.",
    capabilities: [
      "Create + edit + publish pages",
      "Manage landing sections + custom pages",
      "Trigger workflows",
      "All viewer capabilities",
    ],
  },
  {
    id: "viewer",
    label: "Viewer",
    badgeClass: TONES.neutral.badge,
    description: "Read-only access. Audit + reporting use case.",
    capabilities: [
      "View pages + content (no edit)",
      "View analytics + audit log",
      "No mutation rights",
    ],
  },
];

/** Demo users — 5 rows showing role distribution + status states.
 *  Reset on each browser reload (no persistence). Demo intentionally
 *  static so visitors see a consistent surface across hits. */
export const SEED_USERS: UserRow[] = [
  {
    id: "u_1",
    name: "Maya Kusumawardani",
    email: "maya@lumen.dev",
    initials: "MK",
    role: "owner",
    status: "active",
    lastActive: "2026-05-20T08:14:00Z",
  },
  {
    id: "u_2",
    name: "Rahman Effendi",
    email: "rahman@konsultan.id",
    initials: "RE",
    role: "admin",
    status: "active",
    lastActive: "2026-05-20T07:42:00Z",
  },
  {
    id: "u_3",
    name: "Diana Putri",
    email: "diana@atelier.studio",
    initials: "DP",
    role: "editor",
    status: "active",
    lastActive: "2026-05-19T22:10:00Z",
  },
  {
    id: "u_4",
    name: "Faisal Akbar",
    email: "faisal@wirausaha.id",
    initials: "FA",
    role: "editor",
    status: "pending",
    lastActive: "2026-05-18T11:30:00Z",
  },
  {
    id: "u_5",
    name: "Sari Nurhayati",
    email: "sari@kreator.dev",
    initials: "SN",
    role: "viewer",
    status: "suspended",
    lastActive: "2026-05-12T15:00:00Z",
  },
];
