/**
 * notion-database — portable Notion-style database surface.
 *
 * Pure / props-driven · callback-based CRUD · no store reach-arounds.
 * Optional companion to notion-shell — install shell alone for pages
 * + sidebar + block editor, add database when you want embedded
 * databases with table / board / list / gallery / calendar / feed
 * views, filter + sort + search, column-header menu, and per-property
 * cell renderers.
 *
 * Domain types live in notion-shell (single source of truth — the Page
 * type references Database / Property / PropertyValue via
 * rowOfDatabaseId + rowProps). notion-database re-exports them as a
 * convenience.
 */

import { defineSliceContract } from "@/packages/cli/lib/contract";

export const contract = defineSliceContract({
  id: "notion-database",
  version: "0.1.0",
  category: "ui",
  kind: "ui",
  provides: {
    components: [
      "NotionDatabase", "NotionProperty",
      "ViewTabs", "ViewOptions", "ColumnHeaderMenu",
      "TableView", "BoardView", "ListView", "GalleryView", "CalendarView", "FeedView",
    ],
    utils: [
      "applyView", "groupBy", "bucketByDate",
      "renderPropertyCell",
      "VIEW_REGISTRY",
    ],
    hooks: [],
    types: [
      "NotionDatabaseProps", "NotionPropertyProps",
      "ViewTabsProps", "ViewOptionsProps", "ColumnHeaderMenuProps",
      "ViewRegistry", "ViewProps",
      "Database", "DatabaseViewConfig", "DatabaseFilter", "DatabaseSort", "DbView",
      "Property", "PropertyValue", "PropertyType", "SelectOption", "NumberFormat",
      "Page",
    ],
  },
  requires: {
    npm: [],
    shadcn: ["button", "input", "checkbox", "dropdown-menu", "popover"],
    env: [],
    peers: [{ slug: "notion-shell", range: "^0.4" }],
    routes: [],
    tables: [],
  },
});
