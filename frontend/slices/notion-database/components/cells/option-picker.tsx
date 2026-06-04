"use client";

/** OptionPicker — shared popover UI for select / multi_select / status
 *  cells. Phase 7.9 DRY consolidation: single canonical UX, single
 *  source for colors/chip/menu (option-shared.tsx). */

import { useMemo, useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { SelectOption } from "../../types";
import { OptionChip, OptionMenu } from "./option-shared";

export { OPTION_COLORS, colorClass, OptionChip, OptionMenu } from "./option-shared";

interface OptionPickerProps {
  mode: "single" | "multi";
  options: SelectOption[];
  value: string | string[] | null;
  readOnly?: boolean;
  onChange?: (next: string | string[] | null) => void;
  onOptionsChange?: (nextOptions: SelectOption[]) => void;
  triggerClassName?: string;
  placeholder?: string;
}

export function OptionPicker({
  mode, options, value, readOnly, onChange, onOptionsChange,
  triggerClassName, placeholder = "—",
}: OptionPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedIds: string[] = mode === "multi"
    ? (Array.isArray(value) ? value : [])
    : (value && typeof value === "string" ? [value] : []);

  const selected = selectedIds.map((id) => options.find((o) => o.id === id)).filter(Boolean) as SelectOption[];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options;
  }, [options, search]);

  const exactMatch = options.some((o) => o.name.toLowerCase() === search.trim().toLowerCase());
  const canCreate = !!onOptionsChange && search.trim().length > 0 && !exactMatch;

  if (readOnly) {
    return (
      <div className="flex flex-wrap gap-1">
        {selected.length === 0
          ? <span className="text-muted-foreground/60">{placeholder}</span>
          : selected.map((o) => <OptionChip key={o.id} opt={o} />)}
      </div>
    );
  }

  const setValue = (nextIds: string[]) => {
    if (mode === "multi") onChange?.(nextIds);
    else onChange?.(nextIds[0] ?? null);
  };

  const toggle = (id: string) => {
    if (mode === "multi") {
      setValue(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
    } else {
      setValue(selectedIds.includes(id) ? [] : [id]);
      setOpen(false);
    }
  };
  const remove = (id: string) => setValue(selectedIds.filter((x) => x !== id));

  const createOption = () => {
    if (!canCreate || !onOptionsChange) return;
    const next: SelectOption = { id: crypto.randomUUID(), name: search.trim(), color: "default" };
    onOptionsChange([...options, next]);
    setValue(mode === "multi" ? [...selectedIds, next.id] : [next.id]);
    setSearch("");
    if (mode === "single") setOpen(false);
  };

  const renameOption = (id: string) => {
    if (!onOptionsChange) return;
    const cur = options.find((o) => o.id === id);
    const name = window.prompt("Rename option", cur?.name ?? "")?.trim();
    if (!name) return;
    onOptionsChange(options.map((o) => (o.id === id ? { ...o, name } : o)));
  };
  const setColor = (id: string, color: string) =>
    onOptionsChange?.(options.map((o) => (o.id === id ? { ...o, color } : o)));
  const deleteOption = (id: string) => {
    if (!onOptionsChange) return;
    onOptionsChange(options.filter((o) => o.id !== id));
    if (selectedIds.includes(id)) setValue(selectedIds.filter((x) => x !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" type="button" className={cn(
          "flex h-auto min-h-7 w-full flex-wrap items-center justify-start gap-1 rounded-md border-border bg-background px-2 py-1 text-left text-sm font-normal hover:bg-accent",
          triggerClassName,
        )} aria-label={placeholder}>
          {selected.length === 0
            ? <span className="text-muted-foreground/60">{placeholder}</span>
            : selected.map((o) => <OptionChip key={o.id} opt={o} />)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
          {mode === "multi" && selected.map((o) => <OptionChip key={o.id} opt={o} onRemove={() => remove(o.id)} />)}
          <Input
            autoFocus value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && canCreate) { e.preventDefault(); createOption(); } }}
            placeholder={selected.length && mode === "multi" ? "" : "Search or create…"}
            className="h-6 flex-1 min-w-[6rem] border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
            {mode === "multi" ? "Select options or create one" : "Select an option or create one"}
          </div>
          {filtered.map((o) => {
            const active = selectedIds.includes(o.id);
            return (
              <div key={o.id} className="group flex items-center gap-1 rounded px-1 py-0.5 hover:bg-accent">
                <Button variant="ghost" type="button" onClick={() => toggle(o.id)} className="flex h-auto flex-1 items-center justify-start gap-2 px-0 py-1 text-left font-normal hover:bg-transparent" aria-label={`Toggle ${o.name}`}>
                  <Check className={cn("h-3 w-3 shrink-0", active ? "text-primary" : "opacity-0")} />
                  <OptionChip opt={o} />
                </Button>
                {onOptionsChange && <OptionMenu opt={o} onRename={renameOption} onDelete={deleteOption} onSetColor={setColor} />}
              </div>
            );
          })}
          {canCreate && (
            <Button variant="ghost" type="button" onClick={createOption} className="flex h-auto w-full items-center justify-start gap-2 rounded px-2 py-1.5 text-left text-sm font-normal hover:bg-accent">
              <Plus className="h-3 w-3" />
              <span>Create</span>
              <OptionChip opt={{ id: "preview", name: search.trim(), color: "default" }} />
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
