/** notion-database — portable Notion-style database surface.
 *
 *  Pure / props-driven · callback-based CRUD · no store reach-arounds.
 *  Optional companion to notion-shell — install notion-shell alone for
 *  pages + sidebar + block editor, add notion-database when you want
 *  embedded databases with table / board / list / gallery / calendar /
 *  feed views, filter + sort + search + column-header menu, and per-
 *  property cell renderers.
 *
 *  Composition:
 *    <NotionDatabase>          — full DB surface
 *      <ViewTabs>              — switch between views
 *      <ViewOptions>           — sort + filter + search popover
 *      <ColumnHeaderMenu>      — per-column actions
 *      <NotionProperty>        — value + schema editor (per-cell)
 *      VIEW_REGISTRY[view]     — renders the active view
 *
 *  Use embedded inside a NotionBlock (type="database") OR as a
 *  standalone page surface.
 */

export { NotionDatabase, type NotionDatabaseProps } from "./components/NotionDatabase";
export { NotionProperty, type NotionPropertyProps } from "./components/NotionProperty";
export { ViewTabs, type ViewTabsProps } from "./components/ViewTabs";
export { ViewOptions, type ViewOptionsProps } from "./components/ViewOptions";
export { ColumnHeaderMenu, type ColumnHeaderMenuProps } from "./components/ColumnHeaderMenu";
export { FilterBuilder, type FilterBuilderProps } from "./components/FilterBuilder";
export { SortBuilder, type SortBuilderProps } from "./components/SortBuilder";
export { renderPropertyCell } from "./components/property-cells";
export {
  VIEW_REGISTRY,
  TableView, BoardView, ListView, GalleryView, CalendarView, FeedView,
  ChartView, DashboardView, MapView, TimelineView,
  type ViewRegistry, type ViewProps,
} from "./components/views";
export { applyView, groupBy, bucketByDate } from "./lib/viewData";

// ---- Relation + Rollup (CK-1D Phase 2) ----
export { RelationCell, type RelationCellProps } from "./components/cells/RelationCell";
export { RollupCell, type RollupCellProps } from "./components/cells/RollupCell";
export { filterRelationCandidates } from "./lib/relationCandidates";
export { computeRollup } from "./lib/computeRollup";

// ---- Row Selection multi-select (CK-1D Phase 3 + Phase 5 Checkboxes) ----
export {
  RowSelectionProvider,
  useRowSelection,
  useRowSelectionOptional,
  RowMarqueeOverlay,
  RowSelectionToolbar,
  RowSelectionKeyboard,
  Marquee,
  HeaderCheckboxGutter,
  RowCheckbox,
  type RowSelectionApi,
  type RowSelectionState,
  type MarqueeProps,
  type MarqueeMode,
  type Rect,
} from "./components/row-selection";

// ---- Cell selection + drag-fill (merged from database-cell-selection, v0.16) ----
export { useDragFill, type FillSource } from "./hooks/useDragFill";
export { SelectableCell } from "./components/cells/SelectableCell";

// ---- Calendar drag helpers (CK-1D Phase 5 — pure) ----
export {
  parseExistingDate,
  formatDateValue as formatCalendarDragDate,
  shiftYmd,
  computeDateShift,
  parseDropTargetId,
  type DateValue as CalendarDragDateValue,
  type ShiftResult,
} from "./lib/calendarDrag";

// ---- Database wrapper (CK-1D Phase 4 — DB-level ops + full-page shell) ----
export {
  DatabaseMenu,
  type DatabaseMenuProps,
  DatabasePage,
  type DatabasePageProps,
} from "./components/database-shell";

// ---- Format helpers (CK-1D Phase 7 — Intl-based number + date) ----
export {
  resolveNumberFormat,
  formatPropertyNumber,
  COMMON_CURRENCIES,
} from "./lib/numberFormat";
export {
  parseYmdToLocal,
  formatYmd,
  formatTime,
  formatDateValue,
  DATE_FORMAT_LABELS,
  TIME_FORMAT_LABELS,
  DATE_FORMATS,
  type DateFormatKind,
  type TimeFormatKind,
  type DateValue,
} from "./lib/dateFormat";

// Re-export domain types for convenience (source of truth is notion-shell).
export type {
  Database,
  DatabaseFilter,
  DatabaseFilterOp,
  DatabaseSort,
  DatabaseViewConfig,
  DbView,
  NumberFormat,
  Page,
  Property,
  PropertyType,
  PropertyTypeMeta,
  PropertyValue,
  RollupAggregate,
  SelectOption,
} from "./types";

export {
  PROPERTY_TYPE_META,
  PROPERTY_TYPES_USER_ADDABLE,
  PROPERTY_TYPES_CSV_IMPORTABLE,
} from "./types";

// ---- Import / Export surface (merged from former database-io slice, v0.6) ----

export {
  DatabaseIOActions,
  type DatabaseIOActionsProps,
} from "./components/io/DatabaseIOActions";

export {
  CsvImportDialog,
  type CsvImportDialogProps,
  type CsvImportResult,
  type CsvNewProperty,
  type CsvRowDraft,
} from "./components/io/CsvImportDialog";

export {
  JsonImportDialog,
  type JsonImportDialogProps,
} from "./components/io/JsonImportDialog";

export {
  exportDatabaseToCsv,
  parseCsv,
  downloadCsv,
  valueFromString,
  type ParsedCsv,
} from "./lib/io/csv";

export {
  exportDatabase,
  downloadJson,
  parseExport,
  diffSchema,
  buildImportResult,
  type DatabaseExportV1,
  type RowExport,
  type JsonImportResult,
} from "./lib/io/serialize";

export {
  buildCsvTemplate,
  buildJsonTemplate,
} from "./lib/io/template";

// ---- Row Detail surface (CK-1D Phase 1 — lifted from notion-page-clone) ----

export {
  RowPeek,
  type RowPeekProps,
  RowDetailSheet,
  type RowDetailSheetProps,
  RowDetailDialog,
  type RowDetailDialogProps,
  RowDetailBody,
  RowOpenModeSwitcher,
  useRowOpenMode,
  type RowOpenMode,
} from "./components/row-detail";
