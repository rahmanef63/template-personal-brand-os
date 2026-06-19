"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { PageBlock } from "./types";

type Narrow<K extends PageBlock["kind"]> = Extract<PageBlock, { kind: K }>;
type FormProps<K extends PageBlock["kind"]> = {
  block: Narrow<K>;
  onChange: (next: Narrow<K>) => void;
};

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function HeroForm({ block, onChange }: FormProps<"hero">) {
  return (
    <div className="space-y-3">
      <Field id="hero-headline" label="Headline">
        <Input id="hero-headline" value={block.headline} onChange={(e) => onChange({ ...block, headline: e.target.value })} />
      </Field>
      <Field id="hero-sub" label="Sub-headline">
        <Input id="hero-sub" value={block.sub ?? ""} onChange={(e) => onChange({ ...block, sub: e.target.value })} />
      </Field>
      <Field id="hero-cta-label" label="CTA label">
        <Input
          id="hero-cta-label"
          value={block.cta?.label ?? ""}
          onChange={(e) =>
            onChange({ ...block, cta: { label: e.target.value, href: block.cta?.href ?? "#" } })
          }
        />
      </Field>
      <Field id="hero-cta-href" label="CTA href">
        <Input
          id="hero-cta-href"
          value={block.cta?.href ?? ""}
          onChange={(e) =>
            onChange({ ...block, cta: { label: block.cta?.label ?? "", href: e.target.value } })
          }
        />
      </Field>
    </div>
  );
}

export function TextForm({ block, onChange }: FormProps<"text">) {
  return (
    <div className="space-y-3">
      <Field id="text-heading" label="Heading">
        <Input id="text-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </Field>
      <Field id="text-body" label="Body">
        <Textarea id="text-body" rows={6} value={block.body} onChange={(e) => onChange({ ...block, body: e.target.value })} />
      </Field>
    </div>
  );
}

export function CtaForm({ block, onChange }: FormProps<"cta">) {
  return (
    <div className="space-y-3">
      <Field id="cta-headline" label="Headline">
        <Input id="cta-headline" value={block.headline} onChange={(e) => onChange({ ...block, headline: e.target.value })} />
      </Field>
      <Field id="cta-sub" label="Sub-headline">
        <Input id="cta-sub" value={block.sub ?? ""} onChange={(e) => onChange({ ...block, sub: e.target.value })} />
      </Field>
      <Field id="cta-label" label="CTA label">
        <Input
          id="cta-label"
          value={block.cta.label}
          onChange={(e) => onChange({ ...block, cta: { ...block.cta, label: e.target.value } })}
        />
      </Field>
      <Field id="cta-href" label="CTA href">
        <Input
          id="cta-href"
          value={block.cta.href}
          onChange={(e) => onChange({ ...block, cta: { ...block.cta, href: e.target.value } })}
        />
      </Field>
    </div>
  );
}

export function TestimonialForm({ block, onChange }: FormProps<"testimonial">) {
  return (
    <div className="space-y-3">
      <Field id="t-quote" label="Quote">
        <Textarea id="t-quote" rows={3} value={block.quote} onChange={(e) => onChange({ ...block, quote: e.target.value })} />
      </Field>
      <Field id="t-author" label="Author">
        <Input id="t-author" value={block.author} onChange={(e) => onChange({ ...block, author: e.target.value })} />
      </Field>
      <Field id="t-role" label="Role">
        <Input id="t-role" value={block.role ?? ""} onChange={(e) => onChange({ ...block, role: e.target.value })} />
      </Field>
    </div>
  );
}

export function VideoForm({ block, onChange }: FormProps<"video">) {
  return (
    <div className="space-y-3">
      <Field id="v-heading" label="Heading">
        <Input id="v-heading" value={block.heading ?? ""} onChange={(e) => onChange({ ...block, heading: e.target.value })} />
      </Field>
      <Field id="v-src" label="Video source URL">
        <Input id="v-src" value={block.src} onChange={(e) => onChange({ ...block, src: e.target.value })} />
      </Field>
      <Field id="v-caption" label="Caption">
        <Input id="v-caption" value={block.caption ?? ""} onChange={(e) => onChange({ ...block, caption: e.target.value })} />
      </Field>
    </div>
  );
}
