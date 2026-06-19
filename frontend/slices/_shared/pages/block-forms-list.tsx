"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PageBlock } from "./types";

type Narrow<K extends PageBlock["kind"]> = Extract<PageBlock, { kind: K }>;
type FormProps<K extends PageBlock["kind"]> = {
  block: Narrow<K>;
  onChange: (next: Narrow<K>) => void;
};

function Repeater<T>({
  items,
  onChange,
  empty,
  label,
  renderRow,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  empty: T;
  label: string;
  renderRow: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const setAt = (i: number, patch: Partial<T>) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, { ...empty }]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
                Remove
              </Button>
            </div>
            {renderRow(it, (patch) => setAt(i, patch))}
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        + Add row
      </Button>
    </div>
  );
}

export function FeatureListForm({ block, onChange }: FormProps<"feature-list">) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="fl-heading">Heading</Label>
        <Input id="fl-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </div>
      <Repeater
        label="Items"
        items={block.items}
        empty={{ title: "", body: "" }}
        onChange={(items) => onChange({ ...block, items })}
        renderRow={(it, set) => (
          <>
            <Input placeholder="Title" value={it.title} onChange={(e) => set({ title: e.target.value })} />
            <Textarea placeholder="Body" rows={2} value={it.body} onChange={(e) => set({ body: e.target.value })} />
          </>
        )}
      />
    </div>
  );
}

export function FaqForm({ block, onChange }: FormProps<"faq">) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="faq-heading">Heading</Label>
        <Input id="faq-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </div>
      <Repeater
        label="Questions"
        items={block.items}
        empty={{ q: "", a: "" }}
        onChange={(items) => onChange({ ...block, items })}
        renderRow={(it, set) => (
          <>
            <Input placeholder="Question" value={it.q} onChange={(e) => set({ q: e.target.value })} />
            <Textarea placeholder="Answer" rows={2} value={it.a} onChange={(e) => set({ a: e.target.value })} />
          </>
        )}
      />
    </div>
  );
}

export function StatsForm({ block, onChange }: FormProps<"stats">) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="stats-heading">Heading</Label>
        <Input id="stats-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </div>
      <Repeater
        label="Stats"
        items={block.items}
        empty={{ value: "", label: "" }}
        onChange={(items) => onChange({ ...block, items })}
        renderRow={(it, set) => (
          <>
            <Input placeholder="Value (e.g. 100+)" value={it.value} onChange={(e) => set({ value: e.target.value })} />
            <Input placeholder="Label" value={it.label} onChange={(e) => set({ label: e.target.value })} />
          </>
        )}
      />
    </div>
  );
}

export function LogoCloudForm({ block, onChange }: FormProps<"logo-cloud">) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="lc-heading">Heading</Label>
        <Input id="lc-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </div>
      <Repeater
        label="Logos"
        items={block.logos}
        empty={{ label: "", alt: "" }}
        onChange={(logos) => onChange({ ...block, logos })}
        renderRow={(it, set) => (
          <>
            <Input placeholder="Label" value={it.label} onChange={(e) => set({ label: e.target.value })} />
            <Input placeholder="Alt text" value={it.alt ?? ""} onChange={(e) => set({ alt: e.target.value })} />
          </>
        )}
      />
    </div>
  );
}
