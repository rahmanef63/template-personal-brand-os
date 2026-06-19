"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Convex-persisted document state for the notion hosts. Drop-in
 * useState replacement: hydrates once from `notion_docs` (by slug),
 * then debounce-saves the whole doc on every change. Single-owner
 * admin tooling — last-write-wins is fine; we deliberately ignore
 * live updates after hydration so typing is never stomped.
 */
export function useNotionDoc<T>(
  slug: string,
  kind: "page" | "database",
  initial: T,
): { value: T; setValue: (next: T | ((prev: T) => T)) => void; loaded: boolean } {
  const doc = useQuery(api.features.notion.query.get, { slug });
  const save = useMutation(api.features.notion.mutation.save);

  const [value, setState] = React.useState<T>(initial);
  const [hydrated, setHydrated] = React.useState(false);
  const dirty = React.useRef(false);

  // Hydrate once when the query settles (null = no doc yet → keep seed).
  React.useEffect(() => {
    if (hydrated || doc === undefined) return;
    if (doc?.data != null) setState(doc.data as T);
    setHydrated(true);
  }, [doc, hydrated]);

  // Debounced whole-doc persist — only after hydration + a real edit.
  React.useEffect(() => {
    if (!hydrated || !dirty.current) return;
    const t = setTimeout(() => {
      dirty.current = false;
      void save({ slug, kind, data: value });
    }, 800);
    return () => clearTimeout(t);
  }, [hydrated, kind, save, slug, value]);

  const setValue = React.useCallback((next: T | ((prev: T) => T)) => {
    dirty.current = true;
    setState((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : next));
  }, []);

  return { value, setValue, loaded: hydrated };
}
