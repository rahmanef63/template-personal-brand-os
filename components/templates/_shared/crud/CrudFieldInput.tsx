"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { FieldDef } from "./types";

// Upload a File to Convex storage -> served URL string. Used by both the plain
// `image` field (URL + Upload button) and the `imagePicker` dialog's Upload tab.
function useConvexUpload() {
  const genUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getUrl);
  return React.useCallback(
    async (file: File): Promise<string> => {
      const uploadUrl = await genUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await res.json()) as { storageId: string };
      return ((await getFileUrl({ storageId: storageId as never })) as string) ?? "";
    },
    [genUploadUrl, getFileUrl],
  );
}

// Plain URL image field + a real file-upload button (Convex storage).
function ImageUrlField({
  value,
  onChange,
  placeholder,
  onUpload,
}: {
  value: string;
  onChange: (next: unknown) => void;
  placeholder?: string;
  onUpload: (file: File) => Promise<string>;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const showPreview = /^(https?:\/\/|\/)/i.test(value);
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const url = await onUpload(file);
      if (url) onChange(url);
    } catch (err) {
      console.error("[CrudFieldInput] upload failed", err);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://… or /path.jpg"}
          className="font-mono text-xs"
        />
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={pick} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 gap-1"
        >
          <Upload className="h-3.5 w-3.5" /> {busy ? "…" : "Upload"}
        </Button>
      </div>
      {showPreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          className="h-20 w-32 rounded-md border border-border/60 object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
    </div>
  );
}

export function CrudFieldInput<T>({
  field,
  value,
  onChange,
  ctx,
}: {
  field: FieldDef<T>;
  value: unknown;
  onChange: (next: unknown) => void;
  /** Sibling-aware context for kinds that need it (e.g. `position`).
   *  `total` = current count of items; `editing` = true if editing an
   *  existing row (so range is 1..total instead of 1..total+1). */
  ctx?: { total: number; editing: boolean; row?: Record<string, unknown> };
}) {
  const onUpload = useConvexUpload();
  switch (field.kind) {
    case "custom":
      return <>{field.render(value, onChange, ctx)}</>;
    case "text":
      return (
        <Input
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={field.mono ? "font-mono text-xs" : ""}
          placeholder={field.placeholder}
        />
      );
    case "textarea":
      return (
        <Textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 4}
          className={field.mono ? "font-mono text-xs" : ""}
          placeholder={field.placeholder}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          value={value == null ? "" : Number(value)}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          min={field.min}
          max={field.max}
          step={field.step}
        />
      );
    case "select": {
      // Radix forbids <SelectItem value="">. Remap empty option values to a
      // sentinel so optional "— none —" options work, and convert back to ""
      // on change so stored data stays unchanged.
      const NONE = "__none__";
      return (
        <Select
          value={value == null || value === "" ? NONE : String(value)}
          onValueChange={(v) => onChange(v === NONE ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o.value} value={o.value === "" ? NONE : o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "tags": {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <Input
          value={arr.join(", ")}
          onChange={(e) =>
            onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
          }
        />
      );
    }
    case "switch":
      return <Switch checked={Boolean(value)} onCheckedChange={(v) => onChange(v)} />;
    case "date": {
      const ms = typeof value === "number" ? value : Date.now();
      const iso = new Date(ms).toISOString().slice(0, 10);
      return (
        <Input
          type="date"
          value={iso}
          onChange={(e) => onChange(new Date(e.target.value).getTime())}
        />
      );
    }
    case "position": {
      const total = ctx?.total ?? 1;
      const max = ctx?.editing ? Math.max(total, 1) : total + 1;
      const positions = Array.from({ length: max }, (_, i) => i + 1);
      const current = value == null ? 1 : Number(value);
      return (
        <Select
          value={String(current)}
          onValueChange={(v) => onChange(Number(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {positions.map((p) => (
              <SelectItem key={p} value={String(p)}>
                {p === 1 ? "1 (top)" : p === max && !ctx?.editing ? `${p} (bottom — new)` : String(p)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    case "image":
      return (
        <ImageUrlField
          value={String(value ?? "")}
          onChange={onChange}
          placeholder={field.placeholder}
          onUpload={onUpload}
        />
      );
  }
}
