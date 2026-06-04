"use client";

/** FormSettings — per-property show / required toggles + form title +
 *  description + success message. Pure component — accepts current view
 *  config + emits onSave({...patch}) so parent can dispatch a single
 *  onViewConfigChange update. */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { DatabaseViewConfig, Property } from "../../types";

export interface FormSettingsProps {
  view: DatabaseViewConfig;
  formableProps: Property[];
  onClose: () => void;
  onSave: (patch: Partial<DatabaseViewConfig>) => void;
}

export function FormSettings({ view, formableProps, onClose, onSave }: FormSettingsProps) {
  const [shown, setShown] = useState<Set<string>>(
    () => new Set(view.formShownProps ?? formableProps.map((p) => p.id)),
  );
  const [required, setRequired] = useState<Set<string>>(
    () => new Set(view.formRequiredProps ?? []),
  );
  const [successMessage, setSuccessMessage] = useState(view.formSuccessMessage ?? "Submitted!");
  const [formTitle, setFormTitle] = useState(view.formTitle ?? "");
  const [formDescription, setFormDescription] = useState(view.formDescription ?? "");

  const toggleShown = (id: string) => {
    const next = new Set(shown);
    if (next.has(id)) {
      next.delete(id);
      const r = new Set(required); r.delete(id); setRequired(r);
    } else next.add(id);
    setShown(next);
  };
  const toggleRequired = (id: string) => {
    if (!shown.has(id)) return;
    const next = new Set(required);
    if (next.has(id)) next.delete(id); else next.add(id);
    setRequired(next);
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Form settings</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
      </div>
      <div className="space-y-4 rounded-lg border border-border bg-card p-4">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Form title</span>
          <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="(uses database name when blank)" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Description</span>
          <Input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Optional intro shown above the form" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Success message</span>
          <Input value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} />
        </label>
        <div>
          <div className="mb-1.5 grid grid-cols-[1fr_auto_auto] gap-2 border-b border-border pb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            <div>Property</div><div>Show</div><div>Required</div>
          </div>
          {formableProps.map((p) => (
            <div key={p.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2 py-1 text-sm">
              <span className="truncate">{p.name}</span>
              <Checkbox checked={shown.has(p.id)} onCheckedChange={() => toggleShown(p.id)} />
              <Checkbox
                checked={required.has(p.id)}
                onCheckedChange={() => toggleRequired(p.id)}
                disabled={!shown.has(p.id)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={() => onSave({
              formShownProps: [...shown],
              formRequiredProps: [...required],
              formSuccessMessage: successMessage,
              formTitle: formTitle.trim() || undefined,
              formDescription: formDescription.trim() || undefined,
            })}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
