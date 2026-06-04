/** row-detail — Phase 1 CK-1D port from notion-page-clone.
 *  Slot-driven row peek surface (sheet + dialog + controller). Host owns
 *  the Page fetch, mutations, icon picker, properties form, and block
 *  editor; this barrel only ships the chrome + persistence hook. */

export { useRowOpenMode, type RowOpenMode } from "./useRowOpenMode";
export { RowOpenModeSwitcher } from "./RowOpenModeSwitcher";
export { RowDetailBody } from "./RowDetailBody";
export {
  RowDetailSheet,
  type RowDetailSheetProps,
} from "./RowDetailSheet";
export {
  RowDetailDialog,
  type RowDetailDialogProps,
} from "./RowDetailDialog";
export { RowPeek, type RowPeekProps } from "./RowPeek";
