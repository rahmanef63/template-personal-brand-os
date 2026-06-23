"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { parseConfigObject } from "./sections/config";

// Structured editor for a landing section's `config` JSON. For item-bearing
// kinds it renders add/remove/reorder rows with real fields; every other key
// (and unsupported kinds) stay editable via the raw-JSON fallback. Empty rows
// => the public renderer keeps the template defaults.

type ItemField = { k: string; label: string; type?: "text" | "textarea" | "number" | "switch" | "lines" };
// A plain string[] repeater (client logos, body paragraphs): same add/remove/
// reorder UX as the object-row repeater, but each row is a single string.
type StringList = { key: string; singular: string; placeholder?: string; multiline?: boolean };
// A single top-level config scalar (hero badge, newsletter copy, blog limit, cta
// label/href). Empty input deletes the key so the public renderer keeps the default.
type ScalarField = { k: string; label: string; type?: "text" | "number"; placeholder?: string };
type KindSchema = { key?: string; singular?: string; fields?: ItemField[]; lists?: StringList[]; scalars?: ScalarField[] };

const KIND_SCHEMA: Record<string, KindSchema> = {
  features: {
    key: "items",
    singular: "Feature",
    fields: [
      { k: "icon", label: "Icon (lucide name)" },
      { k: "title", label: "Title" },
      { k: "blurb", label: "Blurb", type: "textarea" },
    ],
  },
  testimonials: {
    key: "items",
    singular: "Testimonial",
    fields: [
      { k: "quote", label: "Quote", type: "textarea" },
      { k: "author", label: "Author" },
      { k: "role", label: "Role" },
      { k: "rating", label: "Rating (1-5)", type: "number" },
    ],
    scalars: [{ k: "limit", label: "Show how many", type: "number", placeholder: "all" }],
  },
  faq: {
    key: "items",
    singular: "Q&A",
    fields: [
      { k: "q", label: "Question" },
      { k: "a", label: "Answer", type: "textarea" },
    ],
    scalars: [
      { k: "ctaLabel", label: "CTA label" },
      { k: "ctaHref", label: "CTA href" },
    ],
  },
  pricing: {
    key: "tiers",
    singular: "Tier",
    fields: [
      { k: "name", label: "Name" },
      { k: "price", label: "Price" },
      { k: "period", label: "Period (e.g. /bln)" },
      { k: "features", label: "Features (one per line)", type: "lines" },
      { k: "featured", label: "Featured", type: "switch" },
      { k: "ctaLabel", label: "CTA label" },
      { k: "ctaHref", label: "CTA href" },
    ],
  },
  stats: {
    key: "stats",
    singular: "Stat",
    fields: [
      { k: "value", label: "Value (number)", type: "number" },
      { k: "prefix", label: "Prefix" },
      { k: "suffix", label: "Suffix" },
      { k: "label", label: "Label" },
    ],
    lists: [{ key: "clients", singular: "Client", placeholder: "Acme" }],
  },
  custom: {
    lists: [{ key: "body", singular: "Paragraf", placeholder: "Tulis satu paragraf…", multiline: true }],
    scalars: [
      { k: "ctaLabel", label: "CTA label" },
      { k: "ctaHref", label: "CTA href" },
    ],
  },
  // Scalar-only kinds — section title/subtitle stay on the section itself; these
  // are the extra config knobs each kind reads (badge, copy, item caps, CTAs).
  hero: {
    scalars: [
      { k: "badge", label: "Eyebrow badge" },
      { k: "ctaPrimaryLabel", label: "Primary button label" },
      { k: "ctaPrimaryHref", label: "Primary button link" },
      { k: "ctaSecondaryLabel", label: "Secondary button label" },
      { k: "ctaSecondaryHref", label: "Secondary button link" },
    ],
  },
  newsletter: {
    scalars: [
      { k: "placeholder", label: "Input placeholder" },
      { k: "buttonLabel", label: "Button label" },
      { k: "successText", label: "Success message" },
    ],
  },
  cta: {
    scalars: [
      { k: "ctaLabel", label: "Button label" },
      { k: "ctaHref", label: "Button link" },
    ],
  },
  blog: {
    scalars: [{ k: "limit", label: "Show how many", type: "number", placeholder: "3" }],
  },
  changelog: {
    scalars: [{ k: "limit", label: "Show how many", type: "number", placeholder: "3" }],
  },
  services: {
    scalars: [{ k: "limit", label: "Show how many", type: "number", placeholder: "3" }],
  },
  portfolio: {
    lists: [{ key: "body", singular: "Paragraph", placeholder: "One paragraph…", multiline: true }],
    scalars: [
      { k: "limit", label: "Show how many", type: "number", placeholder: "3" },
      { k: "ctaLabel", label: "CTA label" },
      { k: "ctaHref", label: "CTA href" },
    ],
  },
};

type Row = Record<string, unknown>;

export function LandingConfigField({
  config,
  kind,
  onChange,
}: {
  config: string;
  kind?: string;
  onChange: (next: unknown) => void;
}) {
  const obj = parseConfigObject(config);
  const schema = kind ? KIND_SCHEMA[kind] : undefined;
  const [showRaw, setShowRaw] = React.useState(false);

  const rows: Row[] = schema?.key && Array.isArray(obj[schema.key]) ? (obj[schema.key] as Row[]) : [];

  function commitRows(next: Row[]) {
    onChange(JSON.stringify({ ...obj, [schema!.key!]: next }));
  }
  function setCell(i: number, k: string, v: unknown) {
    commitRows(rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));
  }
  function addRow() {
    commitRows([...rows, {}]);
  }
  function removeRow(i: number) {
    commitRows(rows.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    commitRows(next);
  }

  // Top-level scalar config keys (badge, limit, cta…). Empty => delete the key so
  // the public renderer falls back to the template default.
  function setScalar(k: string, v: unknown) {
    const next = { ...obj };
    if (v === undefined) delete next[k];
    else next[k] = v;
    onChange(JSON.stringify(next));
  }

  return (
    <div className="space-y-3">
      {schema?.scalars && schema.scalars.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {schema.scalars.map((s) => (
            <div key={s.k} className={s.type === "number" ? "" : "sm:col-span-2"}>
              <Label className="text-[10px] text-muted-foreground">{s.label}</Label>
              {s.type === "number" ? (
                <Input
                  type="number"
                  value={typeof obj[s.k] === "number" ? (obj[s.k] as number) : ""}
                  onChange={(e) => setScalar(s.k, e.target.value === "" ? undefined : Number(e.target.value))}
                  className="mt-1 text-xs"
                  placeholder={s.placeholder}
                />
              ) : (
                <Input
                  value={typeof obj[s.k] === "string" ? (obj[s.k] as string) : ""}
                  onChange={(e) => setScalar(s.k, e.target.value === "" ? undefined : e.target.value)}
                  className="mt-1 text-xs"
                  placeholder={s.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {schema?.fields && schema.key && (
        <div className="space-y-2">
          {rows.length === 0 && (
            <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
              Belum ada {schema.singular!.toLowerCase()} — situs pakai contoh bawaan template. Tambah baris untuk override.
            </p>
          )}
          {rows.map((row, i) => (
            <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  {schema.singular} {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Naik" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ChevronUp className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Turun" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>
                    <ChevronDown className="size-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive" aria-label="Hapus" onClick={() => removeRow(i)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {schema.fields!.map((f) => (
                  <div key={f.k} className={f.type === "textarea" || f.type === "lines" ? "sm:col-span-2" : ""}>
                    <Label className="text-[10px] text-muted-foreground">{f.label}</Label>
                    <RowCell field={f} value={row[f.k]} onChange={(v) => setCell(i, f.k, v)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addRow}>
            <Plus className="size-3.5" /> Tambah {schema.singular!.toLowerCase()}
          </Button>
        </div>
      )}

      {schema?.lists?.map((list) => (
        <StringListRepeater
          key={list.key}
          list={list}
          values={Array.isArray(obj[list.key]) ? (obj[list.key] as unknown[]).filter((v): v is string => typeof v === "string") : []}
          onChange={(next) => onChange(JSON.stringify({ ...obj, [list.key]: next }))}
        />
      ))}

      {!schema && (
        <p className="text-[10px] text-muted-foreground">
          Section kind ini tidak punya editor terstruktur — pakai JSON di bawah.
        </p>
      )}

      <button
        type="button"
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
        onClick={() => setShowRaw((s) => !s)}
      >
        {showRaw ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
        Advanced (raw JSON)
      </button>
      {showRaw && (
        <Textarea
          value={config}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="font-mono text-xs"
          placeholder='{ "items": [{ "q": "…", "a": "…" }] }'
        />
      )}
    </div>
  );
}

function RowCell({
  field,
  value,
  onChange,
}: {
  field: ItemField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "switch") {
    return <div className="pt-1"><Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} /></div>;
  }
  if (field.type === "textarea") {
    return <Textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} rows={2} className="mt-1 text-xs" />;
  }
  if (field.type === "lines") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Textarea
        value={arr.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        rows={3}
        className="mt-1 text-xs"
        placeholder="Satu item per baris"
      />
    );
  }
  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={value == null || value === "" ? "" : Number(value)}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        className="mt-1 text-xs"
      />
    );
  }
  return <Input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="mt-1 text-xs" />;
}

// Add/remove/reorder repeater for a plain string[] (stats.clients, custom.body).
// Same row frame as the object-row repeater above; each row is one string.
function StringListRepeater({
  list,
  values,
  onChange,
}: {
  list: StringList;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  function setItem(i: number, v: string) {
    onChange(values.map((s, idx) => (idx === i ? v : s)));
  }
  function add() {
    onChange([...values, ""]);
  }
  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {values.length === 0 && (
        <p className="rounded-md border border-dashed border-border/60 px-3 py-4 text-center text-xs text-muted-foreground">
          Belum ada {list.singular.toLowerCase()} — situs pakai contoh bawaan template. Tambah baris untuk override.
        </p>
      )}
      {values.map((value, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border/60 bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">
              {list.singular} {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Naik" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronUp className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-7" aria-label="Turun" onClick={() => move(i, 1)} disabled={i === values.length - 1}>
                <ChevronDown className="size-3.5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-7 text-destructive" aria-label="Hapus" onClick={() => remove(i)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          {list.multiline ? (
            <Textarea value={value} onChange={(e) => setItem(i, e.target.value)} rows={2} className="text-xs" placeholder={list.placeholder} />
          ) : (
            <Input value={value} onChange={(e) => setItem(i, e.target.value)} className="text-xs" placeholder={list.placeholder} />
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={add}>
        <Plus className="size-3.5" /> Tambah {list.singular.toLowerCase()}
      </Button>
    </div>
  );
}
