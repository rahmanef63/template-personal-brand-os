/** Seed content + tiny helpers for the notion hosts. Adapted from the rr
 *  notion-database preview (`app/preview/slices/notion-database/previewState.ts`)
 *  — convex hosts hydrate over these on first load. */

import type { Database, Page, PropertyValue, Block, PageFont } from "@/features/notion-shell";

export const newId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

/** Demo user directory — NotionDatabase userLookup prop so person /
 *  created_by / last_edited_by cells render names + icons. */
export const DEMO_USERS = [
  { id: "u-owner", name: "Owner", icon: "🧑" },
  { id: "u-team", name: "Team", icon: "🎨" },
] as const;

export const userLookup = (id: string) =>
  DEMO_USERS.find((u) => u.id === id || u.name === id) ?? null;

export function makeRow(
  id: string,
  title: string,
  props: Record<string, PropertyValue>,
): Page {
  return {
    id, parentId: null, title, icon: "📌",
    blocks: [], favorite: false, trashed: false,
    createdAt: Date.now(), updatedAt: Date.now(),
    createdBy: "u-owner", lastEditedBy: "u-owner",
    rowOfDatabaseId: "db-main",
    rowProps: { title, ...props },
  };
}

export const INITIAL_DB: Database = {
  id: "db-main",
  name: "Tasks",
  icon: "📋",
  rowIds: ["t1", "t2", "t3"],
  properties: [
    { id: "title", name: "Title", type: "text" },
    { id: "status", name: "Status", type: "status",
      options: [
        { id: "todo", name: "Todo", color: "gray" },
        { id: "doing", name: "In progress", color: "yellow" },
        { id: "done", name: "Done", color: "green" },
      ] },
    { id: "priority", name: "Priority", type: "select",
      options: [
        { id: "p0", name: "P0", color: "red" },
        { id: "p1", name: "P1", color: "yellow" },
        { id: "p2", name: "P2", color: "blue" },
      ] },
    { id: "tags", name: "Tags", type: "multi_select",
      options: [
        { id: "content", name: "content", color: "purple" },
        { id: "site", name: "site", color: "blue" },
        { id: "ops", name: "ops", color: "red" },
      ] },
    { id: "due", name: "Due", type: "date" },
    { id: "done_check", name: "Done", type: "checkbox" },
    { id: "owners", name: "Owners", type: "person" },
    { id: "created", name: "Created", type: "created_time" },
  ],
  views: [
    { id: "v1", name: "Table", type: "table", filters: [], sorts: [], search: "" },
    { id: "v2", name: "Board", type: "board", groupBy: "status", filters: [], sorts: [], search: "" },
    { id: "v3", name: "List", type: "list", filters: [], sorts: [], search: "" },
    { id: "v4", name: "Calendar", type: "calendar", groupBy: "due", filters: [], sorts: [], search: "" },
    { id: "v5", name: "Gallery", type: "gallery", filters: [], sorts: [], search: "" },
    { id: "v6", name: "Chart", type: "chart", filters: [], sorts: [], search: "",
      chartKind: "bar", chartXProp: "status", chartAggregate: "count", chartShowLegend: false },
  ],
  activeViewId: "v1",
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const INITIAL_ROWS: Page[] = [
  makeRow("t1", "Tulis konten halaman utama", { status: "done", priority: "p0", tags: ["content"], due: { date: "2026-06-01" }, owners: ["u-owner"] }),
  makeRow("t2", "Review draft journal", { status: "doing", priority: "p1", tags: ["content", "site"], due: { date: "2026-06-07" }, owners: ["u-owner"] }),
  makeRow("t3", "Atur jadwal publish", { status: "todo", priority: "p2", tags: ["ops"], due: { date: "2026-06-14" }, owners: [] }),
];

/** Seed blocks for the Notes page — shows off the main block types. */
export const INITIAL_NOTES_BLOCKS: Block[] = [
  { id: "n1", type: "h2", text: "Catatan" },
  { id: "n2", type: "paragraph", text: 'Halaman catatan pribadi. Ketik "/" untuk menu block, seleksi teks untuk toolbar format.' },
  { id: "n3", type: "callout", calloutKind: "tip", text: "Semua perubahan tersimpan otomatis." },
  { id: "n4", type: "toggle", text: "Contoh toggle", collapsed: false, children: [
    { id: "n4a", type: "paragraph", text: "Block bisa nested di dalam toggle." },
  ] },
  { id: "n5", type: "toc", text: "" },
  { id: "n6", type: "database", text: "", databaseId: "db-main" },
  { id: "n7", type: "divider", text: "" },
];

export type NotesDoc = {
  icon: string;
  title: string;
  blocks: Block[];
  font: PageFont;
  fullWidth: boolean;
  smallText: boolean;
  locked: boolean;
};

export const INITIAL_NOTES: NotesDoc = {
  icon: "📘",
  title: "Notes",
  blocks: INITIAL_NOTES_BLOCKS,
  font: "default",
  fullWidth: false,
  smallText: false,
  locked: false,
};

export type DatabaseDoc = { db: Database; rows: Page[] };

export const INITIAL_DATABASE: DatabaseDoc = { db: INITIAL_DB, rows: INITIAL_ROWS };
