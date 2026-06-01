import * as React from "react";

/** Shared admin-panel block header. Every BlockView used to inline
 *  this same flex+h1+meta+actions cluster — extracted in BY-wave so
 *  type scale, spacing rhythm, and action-button ordering stay locked
 *  across blocks. */
export function BlockHeader({
  title,
  meta,
  actions,
}: {
  title: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {meta !== undefined && meta !== null && (
          <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
