"use client";

import { AuditLogBindingsProvider } from "./bindings";
import { AuditLogBlockView } from "./AuditLogBlockView";
import { useConvexAuditLogBindings } from "./useConvexAuditLogBindings";

/** Convex-backed mount of the Audit log block — wraps the bare view in a
 *  provider whose value is the persisted event stream (appended by the other
 *  admin mutations via logAudit) instead of the in-memory demo fallback. */
export function AuditLogBlockConvex() {
  return (
    <AuditLogBindingsProvider value={useConvexAuditLogBindings()}>
      <AuditLogBlockView />
    </AuditLogBindingsProvider>
  );
}
