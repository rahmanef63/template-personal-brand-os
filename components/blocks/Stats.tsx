interface Stat {
  value: string;
  label: string;
}

export interface StatsProps {
  /** The figures to display. 2 to 4 read best in the divider strip. */
  stats: Stat[];
}

/**
 * Stats — a clean metric strip. No cards: figures sit inside one bordered
 * rail, separated by hairline dividers (two-up on mobile, a single divided
 * row from sm up). Big foreground numbers, mono uppercase muted labels.
 */
export default function Stats({ stats = [] }: StatsProps) {
  return (
    <section className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <dl className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-xl border border-border bg-muted/30 sm:flex sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col gap-2 px-6 py-10 sm:px-8">
            <dd className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {stat.value}
            </dd>
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
