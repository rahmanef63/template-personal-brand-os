"use client";

/** FormView — public-facing form to create a new row. Title input +
 *  one input per formable property; submit calls onRowCreate({title,
 *  rowProps}) so host writes through its store / adapter. Settings
 *  pencil → FormSettings panel (show / required toggles + copy).
 *
 *  Reuses renderPropertyCell for per-property inputs (already covers
 *  16 types) — no separate PropertyFormInput widget. */

import { useMemo, useState } from "react";
import { CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PropertyValue } from "../../types";
import { renderPropertyCell } from "../property-cells";
import { emptyDraft, isEmptyValue, isFormableProperty } from "./form-helpers";
import { FormSettings } from "./form-settings";
import type { ViewProps } from "./types";

export function FormView({ db, view, onRowCreate, onViewConfigChange }: ViewProps) {
  const formableProps = useMemo(() => db.properties.filter(isFormableProperty), [db.properties]);
  const shown = useMemo(() => {
    if (view.formShownProps?.length) {
      const set = new Set(view.formShownProps);
      return formableProps.filter((p) => set.has(p.id));
    }
    return formableProps;
  }, [formableProps, view.formShownProps]);
  const requiredSet = useMemo(
    () => new Set(view.formRequiredProps ?? []),
    [view.formRequiredProps],
  );

  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState<Record<string, PropertyValue>>(() => emptyDraft(shown));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const setVal = (id: string, v: PropertyValue) => setDraft((d) => ({ ...d, [id]: v }));
  const reset = () => { setTitle(""); setDraft(emptyDraft(shown)); setError(null); };

  const onSubmit = async () => {
    setError(null);
    if (!title.trim()) { setError("Title is required"); return; }
    for (const p of shown) {
      if (!requiredSet.has(p.id)) continue;
      if (isEmptyValue(draft[p.id])) { setError(`${p.name} is required`); return; }
    }
    try {
      await onRowCreate?.({ title: title.trim(), rowProps: draft });
      setSubmitted(true);
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    }
  };

  if (editing) {
    return (
      <FormSettings
        view={view}
        formableProps={formableProps}
        onClose={() => setEditing(false)}
        onSave={(patch) => { onViewConfigChange?.(patch); setEditing(false); }}
      />
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
          <div className="mt-3 text-lg font-semibold">{view.formSuccessMessage || "Submitted!"}</div>
          <div className="mt-1 text-xs text-muted-foreground">Your response was saved as a new row.</div>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>Submit another</Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit form
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{view.formTitle?.trim() || db.name}</h2>
          <p className="mt-0.5 whitespace-pre-line text-xs text-muted-foreground">
            {view.formDescription?.trim() || "Fill the form to add a new row."}
          </p>
        </div>
        {onViewConfigChange && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)} title="Edit form fields">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); void onSubmit(); }}
        className="space-y-4 rounded-lg border border-border bg-card p-5"
      >
        <label className="block">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Title<span className="ml-0.5 text-destructive">*</span>
            </span>
          </div>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled" autoFocus />
        </label>

        {shown.map((p) => (
          <label key={p.id} className="block">
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {p.name}
                {requiredSet.has(p.id) && <span className="ml-0.5 text-destructive">*</span>}
              </span>
            </div>
            {renderPropertyCell({
              prop: p,
              value: draft[p.id] ?? null,
              readOnly: false,
              onChange: (v) => setVal(p.id, v),
            })}
          </label>
        ))}

        {shown.length === 0 && (
          <p className="text-xs italic text-muted-foreground">
            No properties to fill.{" "}
            {onViewConfigChange && (
              <Button variant="link" type="button" onClick={() => setEditing(true)} className="h-auto p-0 text-xs underline">
                Configure form
              </Button>
            )}
          </p>
        )}

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border pt-2">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={reset}
            className="h-auto px-0 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
          >
            Clear
          </Button>
          <Button type="submit" size="sm" disabled={!onRowCreate}>
            {onRowCreate ? "Submit" : "(no onRowCreate wired)"}
          </Button>
        </div>
      </form>
    </div>
  );
}
