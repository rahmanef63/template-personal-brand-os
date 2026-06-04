"use client";

/** Host block-renderer wiring for the Notes page. notion-shell ships every
 *  self-contained renderer built-in (incl. code/equation); the host injects
 *  `database` (the convex-persisted main database) + `toc` (live headings). */

import * as React from "react";
import {
  createDefaultBlockRenderers,
  TocBlock,
  focusBlock,
  type BlockRendererProps,
  type BlockRenderers,
  type TocHeading,
} from "@/features/notion-shell";
import { NotionDatabaseHost } from "./database-host";

/** Inline database block — mounts the same convex-persisted database the
 *  dashboard Database page edits ("database-main" doc). */
function DatabaseAdapter(_props: BlockRendererProps) {
  return <NotionDatabaseHost />;
}

/** ToC reads live page headings from context so the stable adapter never
 *  remounts (rebuilding the registry would drop caret focus mid-type). */
export const TocHeadingsContext = React.createContext<TocHeading[]>([]);
function TocAdapter(_props: BlockRendererProps) {
  const headings = React.useContext(TocHeadingsContext);
  return <TocBlock headings={headings} onJump={(id) => focusBlock(id, 0)} />;
}

export const NOTES_BLOCK_RENDERERS: BlockRenderers = createDefaultBlockRenderers({
  database: DatabaseAdapter,
  toc: TocAdapter,
});
