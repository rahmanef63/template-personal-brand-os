import type { LandingSection } from "../landing/types";
import type { PagesAction, PagesSlice } from "./types";

/**
 * Pure reducer for the pages slice. Mount into your template's root
 * reducer via:
 *
 *   case "PAGE_CREATE":
 *   case "PAGE_UPDATE":
 *   case "PAGE_DELETE":
 *   case "PAGE_REORDER_BLOCK":
 *   case "PAGE_SECTION_UPSERT":
 *   case "PAGE_SECTION_DELETE":
 *     return { ...state, pages: pagesReducer(state, action).pages };
 *
 * BI-wave — added section CRUD so custom pages share the same
 * LandingSection composition primitive as the landing surface.
 */
export function pagesReducer(state: PagesSlice, action: PagesAction): PagesSlice {
  switch (action.type) {
    case "PAGE_CREATE":
      return { ...state, pages: [...state.pages, action.payload] };

    case "PAGE_UPDATE": {
      const { id, patch } = action.payload;
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === id && !p.systemPage ? { ...p, ...patch, updatedAt: Date.now() } : p,
        ),
      };
    }

    case "PAGE_DELETE":
      return {
        ...state,
        pages: state.pages.filter((p) => !(p.id === action.payload.id && !p.systemPage)),
      };

    case "PAGE_REORDER_BLOCK": {
      const { id, from, to } = action.payload;
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.id !== id || p.systemPage) return p;
          if (from === to) return p;
          if (from < 0 || to < 0 || from >= p.blocks.length || to >= p.blocks.length) return p;
          const next = p.blocks.slice();
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return { ...p, blocks: next, updatedAt: Date.now() };
        }),
      };
    }

    case "PAGE_SECTION_UPSERT": {
      const { pageId, section } = action.payload;
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === pageId
            ? {
                ...p,
                sections: upsertWithAutoShift(p.sections ?? [], section),
                updatedAt: Date.now(),
              }
            : p,
        ),
      };
    }

    case "PAGE_SECTION_DELETE": {
      const { pageId, sectionId } = action.payload;
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.id !== pageId) return p;
          const removed = (p.sections ?? []).find((s) => s.id === sectionId);
          if (!removed) return p;
          const next = (p.sections ?? [])
            .filter((s) => s.id !== sectionId)
            .map((s) => (s.order > removed.order ? { ...s, order: s.order - 1 } : s));
          return { ...p, sections: next, updatedAt: Date.now() };
        }),
      };
    }

    default:
      return state;
  }
}

/** Same auto-shift contract as `landingReducer` — sibling orders rebase
 *  so the chosen position is unique. Keeps positions contiguous. */
function upsertWithAutoShift(existing: LandingSection[], section: LandingSection): LandingSection[] {
  const idx = existing.findIndex((s) => s.id === section.id);
  const previousOrder = idx >= 0 ? existing[idx].order : null;
  const targetOrder = section.order;
  const others = existing.filter((s) => s.id !== section.id);
  let shifted = others;
  if (previousOrder == null) {
    shifted = others.map((s) =>
      s.order >= targetOrder ? { ...s, order: s.order + 1 } : s,
    );
  } else if (previousOrder !== targetOrder) {
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
  const next: LandingSection[] = [...shifted, section];
  next.sort((a, b) => a.order - b.order);
  return next;
}
