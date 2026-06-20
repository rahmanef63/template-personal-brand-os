import { notFound } from "next/navigation";
import { AdminFeatureCard } from "./AdminFeatureCard";
import { ADMIN_PANEL_BLOCKS } from "./feature-blocks";
import { UsersBlockConvex } from "./blocks/users/UsersBlockConvex";
import { AuditLogBlockConvex } from "./blocks/audit-log/AuditLogBlockConvex";
import { AiConfigBlockConvex } from "./blocks/ai-config/AiConfigBlockConvex";
import { AnalyticsBlockConvex } from "./blocks/analytics/AnalyticsBlockConvex";
import { WebhooksBlockConvex } from "./blocks/webhooks/WebhooksBlockConvex";
import { SettingsBlockConvex } from "./blocks/settings/SettingsBlockConvex";

/**
 * BG-wave — shared stub renderer used by every per-template admin
 * panel feature route. Each template's
 * `/dashboard/admin/admin-panel/<segment>/page.tsx` just calls
 * `<AdminFeatureStubPage segment="ai-config" />` — no per-template
 * duplication.
 *
 * BS-canary → BX-wave (2026-05-20 → 2026-05-21) — all 6 admin-panel
 * blocks now have real implementations. AdminFeatureCard is retained
 * as the fallback for future segments added to ADMIN_PANEL_BLOCKS
 * before a real view ships.
 */
export function AdminFeatureStubPage({ segment }: { segment: string }) {
  const block = ADMIN_PANEL_BLOCKS.find((b) => b.segment === segment);
  if (!block) notFound();
  if (segment === "users") return <UsersBlockConvex />;
  if (segment === "audit-log") return <AuditLogBlockConvex />;
  if (segment === "ai-config") return <AiConfigBlockConvex />;
  if (segment === "analytics") return <AnalyticsBlockConvex />;
  if (segment === "webhooks") return <WebhooksBlockConvex />;
  if (segment === "settings") return <SettingsBlockConvex />;
  return <AdminFeatureCard block={block} />;
}
