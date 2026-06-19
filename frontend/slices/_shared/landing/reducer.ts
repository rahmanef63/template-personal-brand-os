import type { LandingAction, LandingSection, LandingSlice } from "./types";

/**
 * Pure reducer for the landing slice. Mount in your template's root
 * reducer:
 *
 *   case "LANDING_UPSERT":
 *   case "LANDING_DELETE":
 *     return { ...state, ...landingReducer(state, action) };
 */
export function landingReducer(state: LandingSlice, action: LandingAction): LandingSlice {
  switch (action.type) {
    case "LANDING_UPSERT": {
      const idx = state.landingSections.findIndex((s) => s.id === action.payload.id);
      const isUpdate = idx >= 0;
      const previousOrder = isUpdate ? state.landingSections[idx].order : null;
      const targetOrder = action.payload.order;

      // BE-wave — auto-shift sibling orders so the chosen position
      // stays unique. Without this two sections can end up with the
      // same order and the public render becomes non-deterministic.
      const others = state.landingSections.filter((s) => s.id !== action.payload.id);
      let shifted = others;
      if (previousOrder == null) {
        // Create — bump everyone at >= targetOrder up by 1
        shifted = others.map((s) =>
          s.order >= targetOrder ? { ...s, order: s.order + 1 } : s,
        );
      } else if (previousOrder !== targetOrder) {
        // Move — close the gap at previousOrder, then open one at targetOrder
        shifted = others.map((s) => {
          if (targetOrder < previousOrder && s.order >= targetOrder && s.order < previousOrder) {
            return { ...s, order: s.order + 1 };
          }
          if (targetOrder > previousOrder && s.order > previousOrder && s.order <= targetOrder) {
            return { ...s, order: s.order - 1 };
          }
          return s;
        });
      }
      const next: LandingSection[] = [...shifted, action.payload];
      next.sort((a, b) => a.order - b.order);
      return { landingSections: next };
    }
    case "LANDING_DELETE": {
      // Close the gap left behind so positions stay contiguous.
      const removed = state.landingSections.find((s) => s.id === action.payload.id);
      if (!removed) return state;
      const next = state.landingSections
        .filter((s) => s.id !== action.payload.id)
        .map((s) => (s.order > removed.order ? { ...s, order: s.order - 1 } : s));
      return { landingSections: next };
    }
    default:
      return state;
  }
}
