"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  Search,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ACTION_META } from "./seed";
import { useAuditLogBindings } from "./bindings";
import { EventRow, SeverityCard } from "./event-row";
import { BlockHeader } from "../../ui/block-header";
import { EmptyState } from "../../ui/empty-state";
import type { AuditAction, AuditSeverity } from "./types";

/** Real admin-panel "Audit log" block — second BS-pattern impl
 *  (after users). Pure client demo: filter chips + search + table.
 *  No persistence. Backed by frontend/slices/audit-log/ types in real
 *  ejected impl (see eject-spec.md + AuditLogBindings contract). */
export function AuditLogBlockView() {
  const { events } = useAuditLogBindings();
  const [actionFilter, setActionFilter] = React.useState<AuditAction | "all">("all");
  const [severityFilter, setSeverityFilter] = React.useState<AuditSeverity | "all">("all");
  const [query, setQuery] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (severityFilter !== "all" && e.severity !== severityFilter) return false;
      if (q) {
        const blob = `${e.actor.name} ${e.entityLabel} ${e.entityType} ${e.diffSummary ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [events, actionFilter, severityFilter, query]);

  const alertCount = events.filter((e) => e.severity === "alert").length;
  const warnCount = events.filter((e) => e.severity === "warn").length;
  const infoCount = events.length - alertCount - warnCount;

  const actionOptions: Array<AuditAction | "all"> = [
    "all", "create", "update", "delete", "publish", "invite", "revoke",
  ];

  return (
    <div className="space-y-6 p-6">
      <BlockHeader
        title="Audit log"
        meta={`${events.length} events · ${alertCount} alerts · ${warnCount} warnings · ${infoCount} info`}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            Export CSV
          </Button>
        }
      />

      <section className="grid gap-3 md:grid-cols-3">
        <SeverityCard tone="info" label="Info" count={infoCount} icon={CheckCircle2} />
        <SeverityCard tone="warn" label="Warnings" count={warnCount} icon={Shield} />
        <SeverityCard tone="alert" label="Alerts" count={alertCount} icon={AlertTriangle} />
      </section>

      <section className="rounded-lg border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actor, entity, diff…"
              className="h-8 pl-8 text-xs"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="size-3 text-muted-foreground" />
            <span className="text-[10px] uppercase text-muted-foreground">Action</span>
          </div>
          <div role="radiogroup" aria-label="Filter by action" className="flex flex-wrap gap-1">
            {actionOptions.map((a) => (
              <Button
                key={a}
                type="button"
                role="radio"
                aria-checked={actionFilter === a}
                size="sm"
                variant={actionFilter === a ? "secondary" : "ghost"}
                onClick={() => setActionFilter(a)}
                className="h-6 rounded-full border border-border px-2 text-[10px] capitalize"
              >
                {a === "all" ? "All" : ACTION_META[a].label}
              </Button>
            ))}
          </div>
        </div>

        <div role="radiogroup" aria-label="Filter by severity" className="flex items-center gap-2 border-b px-4 py-2">
          <span className="text-[10px] uppercase text-muted-foreground">Severity</span>
          {(["all", "info", "warn", "alert"] as const).map((s) => (
            <Button
              key={s}
              type="button"
              role="radio"
              aria-checked={severityFilter === s}
              size="sm"
              variant={severityFilter === s ? "secondary" : "ghost"}
              onClick={() => setSeverityFilter(s)}
              className="h-6 rounded-full border border-border px-2 text-[10px] capitalize"
            >
              {s}
            </Button>
          ))}
          <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
            {filtered.length} / {events.length}
          </span>
        </div>

        <div className="divide-y">
          {filtered.length === 0 ? (
            <div className="p-3">
              <EmptyState
                icon={Filter}
                label="No events match"
                hint="Adjust action / severity / search to widen the view."
              />
            </div>
          ) : (
            filtered.map((e) => (
              <EventRow
                key={e.id}
                event={e}
                expanded={expandedId === e.id}
                onToggleExpand={() => setExpandedId((prev) => (prev === e.id ? null : e.id))}
              />
            ))
          )}
        </div>
      </section>

      <p className="text-[10px] text-muted-foreground">
        Demo data — resets on browser reload. Real implementation backed by{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-[10px]">audit-log</code> slice with Convex
        bindings (per <code className="rounded bg-muted px-1 py-0.5 text-[10px]">AuditLogBindings</code>{" "}
        contract).
      </p>
    </div>
  );
}
