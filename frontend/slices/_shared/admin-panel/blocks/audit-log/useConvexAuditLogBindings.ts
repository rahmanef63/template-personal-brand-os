"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { AuditLogBindings } from "./bindings";
import { SEED_EVENTS } from "./seed";
import type { AuditEventRow } from "./types";

/** Convex-backed AuditLogBindings — real persistence. `events` is the live
 *  stream appended by the other admin mutations via logAudit() (see
 *  convex/adminPanel_auditLog.ts). While the query is loading (=== undefined)
 *  we return SEED_EVENTS so the UI is never blank, mirroring the in-memory
 *  demo. Once signed in + the table is read, the seed is replaced by the real
 *  (possibly empty) log. */
export function useConvexAuditLogBindings(): AuditLogBindings {
  const data = useQuery(api.adminPanel_auditLog.get);
  const logEventMut = useMutation(api.adminPanel_auditLog.logEvent);
  const clearMut = useMutation(api.adminPanel_auditLog.clear);

  const isLoading = data === undefined;
  const events: AuditEventRow[] = (data as AuditEventRow[] | undefined) ?? SEED_EVENTS;

  const logEvent: NonNullable<AuditLogBindings["logEvent"]> = React.useCallback(
    (event) => {
      void logEventMut({
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        entityLabel: event.entityLabel,
        severity: event.severity,
        diffSummary: event.diffSummary,
      });
    },
    [logEventMut],
  );

  const clear: NonNullable<AuditLogBindings["clear"]> = React.useCallback(() => {
    void clearMut();
  }, [clearMut]);

  return { events, isLoading, logEvent, clear };
}
