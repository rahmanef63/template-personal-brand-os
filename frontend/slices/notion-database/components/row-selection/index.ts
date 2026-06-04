/** row-selection — Phase 3 CK-1D port from notion-page-clone.
 *  Context-driven multi-select primitives. Wrap with
 *  `<RowSelectionProvider rowOrder={rows.map(r => r.id)}>`, then mount
 *  any combination of: RowMarqueeOverlay (drag-band), RowSelectionToolbar
 *  (floating action bar), RowSelectionKeyboard (Esc + Del shortcuts). */

export {
  RowSelectionProvider,
  useRowSelection,
  useRowSelectionOptional,
  type RowSelectionApi,
  type RowSelectionState,
} from "./RowSelectionProvider";
export { RowMarqueeOverlay } from "./RowMarqueeOverlay";
export { RowSelectionToolbar } from "./RowSelectionToolbar";
export { RowSelectionKeyboard } from "./RowSelectionKeyboard";
export { Marquee } from "./Marquee";
export type { MarqueeProps, MarqueeMode, Rect } from "./marquee-types";
export { HeaderCheckboxGutter, RowCheckbox } from "./Checkboxes";
