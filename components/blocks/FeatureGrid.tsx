import type { ComponentType } from "react";
import {
  Lightning,
  ShieldCheck,
  Lock,
  Cube,
  Stack,
  ChartLineUp,
  Plugs,
  Globe,
  Code,
  Sparkle,
  GitBranch,
  Database,
  PaintBrush,
  Gauge,
} from "@phosphor-icons/react/dist/ssr";

type IconProps = { weight?: "regular" | "bold" | "duotone"; className?: string };
type IconComponent = ComponentType<IconProps>;

/** Common names map to a sensible Phosphor icon, default falls back to Sparkle. */
const ICONS: Record<string, IconComponent> = {
  speed: Lightning,
  performance: Gauge,
  security: ShieldCheck,
  auth: Lock,
  component: Cube,
  stack: Stack,
  analytics: ChartLineUp,
  integration: Plugs,
  global: Globe,
  code: Code,
  ai: Sparkle,
  git: GitBranch,
  data: Database,
  database: Database,
  design: PaintBrush,
  brand: PaintBrush,
};

export function resolveIcon(name?: string): IconComponent {
  if (!name) return Sparkle;
  return ICONS[name.toLowerCase()] ?? Sparkle;
}

export interface FeatureGridFeature {
  title: string;
  body: string;
  /** Lookup key for the icon map, e.g. "speed", "security", "ai". */
  icon?: string;
}

export interface FeatureGridProps {
  /** Optional small mono eyebrow above the heading. Omit for none. */
  label?: string;
  /** Optional section heading. Omit for a bare grid. */
  title?: string;
  features: FeatureGridFeature[];
}

function IconTile({ icon }: { icon?: string }) {
  const Icon = resolveIcon(icon);
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon weight="bold" className="size-5" />
    </span>
  );
}

export default function FeatureGrid({
  label,
  title,
  features = [],
}: FeatureGridProps) {
  if (features.length === 0) return null;

  const [lead, ...rest] = features;

  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {(label || title) ? (
        <div className="mb-10 flex flex-col gap-2">
          {label ? (
            <p className="font-mono text-[11px] uppercase tracking-wider text-primary">
              {label}
            </p>
          ) : null}
          {title ? (
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h2>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {/* Lead feature spans wide for rhythm, larger type, more breathing room. */}
        <article className="flex flex-col rounded-xl border border-border bg-muted/30 p-7 transition-colors hover:border-primary/50 sm:col-span-2 lg:col-span-4">
          <IconTile icon={lead.icon} />
          <h3 className="mt-5 text-xl font-semibold tracking-tight">
            {lead.title}
          </h3>
          <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">
            {lead.body}
          </p>
        </article>

        {rest.map((f, i) => (
          <article
            key={`${f.title}-${i}`}
            className="flex flex-col rounded-xl border border-border bg-muted/30 p-6 transition-colors hover:border-primary/50 lg:col-span-2"
          >
            <IconTile icon={f.icon} />
            <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {f.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
