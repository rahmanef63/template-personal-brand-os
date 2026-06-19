import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ADMIN_PANEL_BLOCKS } from "./feature-blocks";

/**
 * BG-wave overview page rendered at /dashboard/admin/admin-panel.
 * Grid of feature-block cards linking to each stub. Same layout every
 * template — Admin Panel is intentionally uniform across the OS
 * templates.
 */
export function AdminPanelOverview({ adminBase }: { adminBase: string }) {
  const base = `${adminBase}/admin-panel`;
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Admin Panel
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Operational tools</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Cross-template operational features — distinct from CMS (Pages /
          Posts / Landing) which lives in the Pages group, and from the
          template-specific Domain Features (Clients / Customers / Leads /
          …) which live in the Features group. Same set of blocks ships
          in every website template.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_PANEL_BLOCKS.map((b) => {
          const Icon = b.icon;
          return (
            <Link key={b.id} href={`${base}/${b.segment}`}>
              <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:bg-muted/40">
                <div className="flex items-center gap-2">
                  <div className="grid size-8 shrink-0 place-items-center rounded-md bg-muted">
                    <Icon className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold">{b.label}</h2>
                </div>
                <p className="text-xs text-muted-foreground">{b.description}</p>
                {b.poweredBy ? (
                  <p className="mt-auto text-[10px] text-muted-foreground">
                    powered by <code className="font-mono">{b.poweredBy}</code>
                  </p>
                ) : null}
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
