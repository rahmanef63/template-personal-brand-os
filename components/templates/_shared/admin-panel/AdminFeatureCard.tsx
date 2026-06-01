import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { FeatureBlock } from "./feature-blocks";

/**
 * BG-wave placeholder card for an Admin Panel feature block. Renders a
 * stub page with the block's metadata + a note about which rr slice
 * will power it (BH-wave will sync real implementations from
 * notion-page-clone + superspace).
 */
export function AdminFeatureCard({ block }: { block: FeatureBlock }) {
  const Icon = block.icon;
  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted">
          <Icon className="size-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{block.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{block.description}</p>
        </div>
      </header>

      <Card className="space-y-3 p-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline">Stub</Badge>
          <span className="text-xs text-muted-foreground">
            Coming soon — placeholder for BH-wave wiring
          </span>
        </div>
        <p className="text-sm">
          This feature block is part of the Admin Panel — cross-template
          operational tooling distinct from CMS (which lives in the{" "}
          <span className="font-mono">Pages</span> group). Same set of blocks
          ships in every website template so operators get a consistent
          admin experience.
        </p>
        {block.poweredBy ? (
          <p className="text-xs text-muted-foreground">
            Will be powered by the{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
              {block.poweredBy}
            </code>{" "}
            slice (already in the rr catalog — installable via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
              npx rr add {block.poweredBy}
            </code>
            ).
          </p>
        ) : null}
      </Card>
    </div>
  );
}
