import * as React from "react";
import type { LucideIcon } from "lucide-react";

/** Standard empty / filter-no-match state. Use inside a section card,
 *  not as a section wrapper. Webhooks had one inlined before BY-wave;
 *  now reused across users / audit-log / settings filtered views. */
export function EmptyState({
  icon: Icon,
  label,
  hint,
  action,
}: {
  icon: LucideIcon;
  label: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/10 p-8 text-center">
      <Icon className="mx-auto size-5 text-muted-foreground/60" aria-hidden />
      <p className="mt-2 text-xs font-medium">{label}</p>
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
      {action && <div className="mt-3 flex justify-center">{action}</div>}
    </div>
  );
}
