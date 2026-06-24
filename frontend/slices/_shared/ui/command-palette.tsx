"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { AdminNavItem } from "../types/common";

/**
 * ⌘K / Ctrl-K quick-nav palette. Opens on the shortcut OR a "cmdk:open" window
 * event (the topbar search button fires it). Navigates the admin nav targets
 * the shell already builds — no extra data wiring, no backend.
 */
export function CommandPalette({
  primary,
  settings,
  placeholder = "Search…",
}: {
  primary: AdminNavItem[];
  settings?: AdminNavItem[];
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen: EventListener = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpen);
    };
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const renderItems = (items: AdminNavItem[]) =>
    items
      .filter((it) => it.href)
      .map((it) => (
        <CommandItem key={it.href} value={it.label} onSelect={() => go(it.href)}>
          {it.label}
        </CommandItem>
      ));

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Navigation" description={placeholder}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup>{renderItems(primary)}</CommandGroup>
        {settings && settings.length > 0 && <CommandGroup>{renderItems(settings)}</CommandGroup>}
      </CommandList>
    </CommandDialog>
  );
}
