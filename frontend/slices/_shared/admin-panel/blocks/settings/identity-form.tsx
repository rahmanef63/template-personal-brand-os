"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, TIMEZONES } from "./seed";
import type { WorkspaceIdentity } from "./types";

export function IdentityForm({
  identity,
  setIdentity,
}: {
  identity: WorkspaceIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<WorkspaceIdentity>>;
}) {
  const nameId = React.useId();
  const slugId = React.useId();
  const tzId = React.useId();
  const langId = React.useId();
  const emailId = React.useId();
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field id={nameId} label="Workspace name">
        <Input
          id={nameId}
          value={identity.name}
          onChange={(e) => setIdentity((p) => ({ ...p, name: e.target.value }))}
          className="text-xs"
        />
      </Field>
      <Field id={slugId} label="URL slug" hint={`/w/${identity.slug || "…"}`}>
        <Input
          id={slugId}
          value={identity.slug}
          onChange={(e) =>
            setIdentity((p) => ({
              ...p,
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            }))
          }
          className="font-mono text-xs"
        />
      </Field>
      <Field id={tzId} label="Timezone">
        <Select
          value={identity.timezone}
          onValueChange={(v) => setIdentity((p) => ({ ...p, timezone: v }))}
        >
          <SelectTrigger id={tzId} className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field id={langId} label="Language">
        <Select
          value={identity.language}
          onValueChange={(v) => setIdentity((p) => ({ ...p, language: v }))}
        >
          <SelectTrigger id={langId} className="text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.code} value={l.code}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field id={emailId} label="Contact email" hint="Used for billing + ops alerts">
        <Input
          id={emailId}
          type="email"
          value={identity.contactEmail}
          onChange={(e) => setIdentity((p) => ({ ...p, contactEmail: e.target.value }))}
          className="font-mono text-xs"
        />
      </Field>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-[10px] uppercase text-muted-foreground">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
