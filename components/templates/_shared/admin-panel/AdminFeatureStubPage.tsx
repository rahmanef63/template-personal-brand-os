import { notFound } from "next/navigation";
import { AdminFeatureCard } from "./AdminFeatureCard";
import { ADMIN_PANEL_BLOCKS } from "./feature-blocks";
import { UsersBlockView } from "./blocks/users/UsersBlockView";
import { AuditLogBlockView } from "./blocks/audit-log/AuditLogBlockView";
import { AiConfigBlockView } from "./blocks/ai-config/AiConfigBlockView";
import { AnalyticsBlockView } from "./blocks/analytics/AnalyticsBlockView";
import { WebhooksBlockView } from "./blocks/webhooks/WebhooksBlockView";
import { SettingsBlockView } from "./blocks/settings/SettingsBlockView";

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
  if (segment === "users") return <UsersBlockView />;
  if (segment === "audit-log") return <AuditLogBlockView />;
  if (segment === "ai-config") return <AiConfigBlockView />;
  if (segment === "analytics") return <AnalyticsBlockView />;
  if (segment === "webhooks") return <WebhooksBlockView />;
  if (segment === "settings") return <SettingsBlockView />;
  return <AdminFeatureCard block={block} />;
}
