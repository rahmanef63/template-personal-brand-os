"use client";

/** createDefaultBlockRenderers — the block-renderer registry that turns a
 *  bare <NotionBlock> into a real editor. notion-shell ships ALL the
 *  self-contained renderers built-in (image / embed / callout / table /
 *  divider / code (highlight.js) / equation (KaTeX) / …). The host only
 *  needs to inject `database` + `toc`, which depend on host data and
 *  sibling slices (slice-boundary: notion-shell can't import another
 *  slice's frontend — compose those at the app level).
 *
 *  Usage (app level):
 *    const renderers = createDefaultBlockRenderers({
 *      database: DatabaseAdapter, toc: TocAdapter,
 *    });
 *    <NotionBlock block={b} blockRenderers={renderers} … />
 *
 *  Text-shape blocks (paragraph / headings / list / quote) are NOT in
 *  the registry — NotionBlock renders them inline with slash menu +
 *  markdown triggers + live decoration. */

import type { ComponentType } from "react";
import type { BlockRenderers, BlockRendererProps } from "../types";
import { ImageRenderer } from "../components/blocks/ImageRenderer";
import { EmbedRenderer } from "../components/blocks/EmbedRenderer";
import { CalloutBlock } from "../components/blocks/CalloutBlock";
import { TableBlock } from "../components/blocks/TableBlock";
import { DividerBlock } from "../components/blocks/DividerBlock";
import { VideoBlock, AudioBlock } from "../components/blocks/MediaBlock";
import { PageLinkBlock } from "../components/blocks/PageLinkBlock";
import { ButtonBlock } from "../components/blocks/ButtonBlock";
import { CodeBlock } from "../components/blocks/CodeBlock";
import { EquationBlock } from "../components/blocks/EquationBlock";
import { makeToggleBlock } from "../components/blocks/ToggleBlock";
import { makeColumnsBlock } from "../components/blocks/ColumnsBlock";

export interface DefaultBlockRendererOpts {
  /** Override the built-in `code` renderer (highlight.js). */
  code?: ComponentType<BlockRendererProps>;
  /** Override the built-in `equation` renderer (KaTeX). */
  equation?: ComponentType<BlockRendererProps>;
  /** Adapter for block-type "database" — an inline database surface (wraps
   *  `@/features/notion-database`'s `<NotionDatabase>`; the host resolves
   *  `block.databaseId` to its data). Composed at the app level. */
  database?: ComponentType<BlockRendererProps>;
  /** Override the built-in image renderer. */
  image?: ComponentType<BlockRendererProps>;
  /** Override the built-in embed renderer. */
  embed?: ComponentType<BlockRendererProps>;
  /** Adapter for block-type "toc" — a table of contents. The host reads its
   *  own page headings and wraps `<TocBlock headings onJump>` (toc can't see
   *  sibling blocks from inside the registry). Composed at the app level. */
  toc?: ComponentType<BlockRendererProps>;
}

export function createDefaultBlockRenderers(
  opts: DefaultBlockRendererOpts = {},
): BlockRenderers {
  const renderers: BlockRenderers = {
    image: opts.image ?? ImageRenderer,
    embed: opts.embed ?? EmbedRenderer,
    callout: CalloutBlock,
    table: TableBlock,
    divider: DividerBlock,
    video: VideoBlock,
    audio: AudioBlock,
    page: PageLinkBlock,
    button: ButtonBlock,
    code: opts.code ?? CodeBlock,
    equation: opts.equation ?? EquationBlock,
    ...(opts.database ? { database: opts.database } : {}),
    ...(opts.toc ? { toc: opts.toc } : {}),
  };
  // Toggle + columns render their children through the SAME registry
  // (incl. nesting), so they're bound after the object exists.
  renderers.toggle = makeToggleBlock(renderers);
  const columns = makeColumnsBlock(renderers);
  renderers.columns2 = columns;
  renderers.columns3 = columns;
  renderers.columns4 = columns;
  return renderers;
}
