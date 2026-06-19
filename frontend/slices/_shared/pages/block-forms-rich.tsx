"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CtaLink, PageBlock } from "./types";

type Narrow<K extends PageBlock["kind"]> = Extract<PageBlock, { kind: K }>;
type FormProps<K extends PageBlock["kind"]> = {
  block: Narrow<K>;
  onChange: (next: Narrow<K>) => void;
};

type Tier = Narrow<"pricing-table">["tiers"][number];

export function ImageGalleryForm({ block, onChange }: FormProps<"image-gallery">) {
  const setAt = (i: number, patch: Partial<{ src: string; alt: string }>) => {
    const next = block.images.slice();
    next[i] = { ...next[i], ...patch };
    onChange({ ...block, images: next });
  };
  const remove = (i: number) => onChange({ ...block, images: block.images.filter((_, j) => j !== i) });
  const add = () => onChange({ ...block, images: [...block.images, { src: "", alt: "" }] });

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="ig-heading">Heading</Label>
        <Input id="ig-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </div>
      <Label>Images</Label>
      <div className="space-y-2">
        {block.images.map((img, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>Remove</Button>
            </div>
            <Input placeholder="Source URL" value={img.src} onChange={(e) => setAt(i, { src: e.target.value })} />
            <Input placeholder="Alt text" value={img.alt} onChange={(e) => setAt(i, { alt: e.target.value })} />
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>+ Add image</Button>
    </div>
  );
}

export function PricingTableForm({ block, onChange }: FormProps<"pricing-table">) {
  const setTier = (i: number, patch: Partial<Tier>) => {
    const next = block.tiers.slice();
    next[i] = { ...next[i], ...patch };
    onChange({ ...block, tiers: next });
  };
  const remove = (i: number) => onChange({ ...block, tiers: block.tiers.filter((_, j) => j !== i) });
  const add = () =>
    onChange({ ...block, tiers: [...block.tiers, { name: "", price: "", bullets: [] }] });

  const setCta = (i: number, patch: Partial<CtaLink>) => {
    const t = block.tiers[i];
    const cta: CtaLink = { label: t.cta?.label ?? "", href: t.cta?.href ?? "", ...patch };
    setTier(i, { cta });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="pt-heading">Heading</Label>
        <Input id="pt-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </div>
      <Label>Tiers</Label>
      <div className="space-y-3">
        {block.tiers.map((t, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tier #{i + 1}</span>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>Remove</Button>
            </div>
            <Input placeholder="Name (e.g. Pro)" value={t.name} onChange={(e) => setTier(i, { name: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Price (e.g. $19)" value={t.price} onChange={(e) => setTier(i, { price: e.target.value })} />
              <Input placeholder="Period (e.g. /mo)" value={t.period ?? ""} onChange={(e) => setTier(i, { period: e.target.value })} />
            </div>
            <Textarea
              placeholder="Bullets (one per line)"
              rows={3}
              value={t.bullets.join("\n")}
              onChange={(e) => setTier(i, { bullets: e.target.value.split("\n").filter(Boolean) })}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="CTA label" value={t.cta?.label ?? ""} onChange={(e) => setCta(i, { label: e.target.value })} />
              <Input placeholder="CTA href" value={t.cta?.href ?? ""} onChange={(e) => setCta(i, { href: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={`pt-featured-${i}`}
                checked={t.featured ?? false}
                onCheckedChange={(v) => setTier(i, { featured: v })}
              />
              <Label htmlFor={`pt-featured-${i}`}>Featured</Label>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>+ Add tier</Button>
    </div>
  );
}
