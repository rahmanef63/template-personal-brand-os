"use client";

/** Edit-property panel — the body of the "Edit property" submenu.
 *  Renders a shared Name + Description editor plus a per-type config
 *  panel routed via PROPERTY_TYPE_PANEL. Prop-driven: every edit goes
 *  through `onPatch` (the host's property-update callback). The Name
 *  field replaces the old standalone Rename item; type changes live in
 *  the separate "Change type" submenu, so this panel never shows a type
 *  select. */

import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Database, Property } from "../../../types";
import { Label } from "./atoms";
import { PROPERTY_TYPE_PANEL } from "./registry";

interface Props {
  prop: Property;
  onPatch: (patch: Partial<Property>) => void;
  db?: Database;
  databases?: Database[];
}

export function EditPropertyPanel({ prop, onPatch, db, databases }: Props) {
  const [draftName, setDraftName] = useState(prop.name);
  const TypePanel = PROPERTY_TYPE_PANEL[prop.type];

  const commitName = () => {
    const next = draftName.trim();
    if (next && next !== prop.name) onPatch({ name: next });
    else if (!next) setDraftName(prop.name);
  };

  return (
    <div className="w-72 space-y-3 p-3">
      <div>
        <Label>Name</Label>
        <Input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
            if (e.key === "Escape") setDraftName(prop.name);
          }}
          className="mt-1 h-8 text-sm"
        />
      </div>

      {TypePanel && <TypePanel prop={prop} onPatch={onPatch} db={db} databases={databases} />}

      <div>
        <Label>Description (optional)</Label>
        <Input
          value={prop.description ?? ""}
          onChange={(e) => onPatch({ description: e.target.value || undefined })}
          placeholder="Shown in the property panel + form view"
          className="mt-1 h-8 text-sm"
        />
      </div>
    </div>
  );
}
