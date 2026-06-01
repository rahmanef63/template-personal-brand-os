import * as React from "react";
import type { LucideIcon } from "lucide-react";

/** Shared inner-section header (the `flex items-center gap-2 border-b
 *  px-4 py-2` strip with optional icon + title + right slot). Was
 *  duplicated 5× across block views before BY-wave. */
export function SectionHeader({
  icon: Icon,
  title,
  right,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex items-center gap-2 border-b px-4 py-2" +
        (className ? " " + className : "")
      }
    >
      {Icon && <Icon className="size-3.5 text-muted-foreground" />}
      <h2 className="text-sm font-semibold">{title}</h2>
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}
