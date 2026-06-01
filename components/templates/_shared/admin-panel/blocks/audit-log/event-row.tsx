"use client";

import * as React from "react";
import { ChevronDown, ChevronRight, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ACTION_META, SEVERITY_META } from "./seed";
import { DiffTree } from "./diff-tree";
import type { AuditEventRow, AuditSeverity } from "./types";

export function EventRow({
  event,
  expanded,
  onToggleExpand,
}: {
  event: AuditEventRow;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const action = ACTION_META[event.action];
  const sev = SEVERITY_META[event.severity];
  const expandable = !!event.diff && Object.keys(event.diff).length > 0;
  const isExpanded = !!expanded && expandable;

  return (
    <div className="px-4 py-3">
      <Button
        type="button"
        variant="ghost"
        onClick={expandable ? onToggleExpand : undefined}
        disabled={!expandable}
        aria-expanded={isExpanded}
        aria-label={expandable ? `${isExpanded ? "Collapse" : "Expand"} diff for ${event.entityLabel}` : undefined}
        className={
          "flex h-auto w-full items-start justify-start gap-3 whitespace-normal rounded p-0 text-left font-normal " +
          (expandable ? "-mx-4 -my-3 cursor-pointer px-4 py-3 hover:bg-muted/30" : "hover:bg-transparent disabled:opacity-100")
        }
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold">
          {event.actor.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="font-medium">{event.actor.name}</span>
            <Badge variant="outline" className={"text-[10px] uppercase " + action.tone}>
              {action.label}
            </Badge>
            <span className="text-muted-foreground">{event.entityType}</span>
            <ChevronRight className="size-3 text-muted-foreground/50" />
            <span className="truncate">{event.entityLabel}</span>
            {event.severity !== "info" && (
              <Badge variant="outline" className={"text-[10px] uppercase " + sev.tone}>
                {sev.label}
              </Badge>
            )}
            {expandable && (
              <ChevronDown
                className={
                  "ml-auto size-3 text-muted-foreground transition-transform " +
                  (isExpanded ? "rotate-180" : "")
                }
                aria-hidden
              />
            )}
          </div>
          {event.diffSummary && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {event.diffSummary}
            </p>
          )}
          <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
            <History className="size-3" />
            <time dateTime={event.at}>{formatRelative(event.at)}</time>
            {event.ipAddress && (
              <>
                <span>·</span>
                <span className="font-mono">{event.ipAddress}</span>
              </>
            )}
            <span>·</span>
            <span className="font-mono">{event.entityId}</span>
          </div>
        </div>
      </Button>
      {isExpanded && event.diff && (
        <div className="ml-10">
          <DiffTree diff={event.diff} />
        </div>
      )}
    </div>
  );
}

export function SeverityCard({
  tone,
  label,
  count,
  icon: Icon,
}: {
  tone: AuditSeverity;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium">{label}</span>
        <Badge variant="outline" className={"ml-auto text-[10px] uppercase " + SEVERITY_META[tone].tone}>
          {count}
        </Badge>
      </div>
    </div>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
