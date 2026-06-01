import type { PublicNavAction, PublicNavItem, PublicNavSlice } from "./types";

/**
 * BG-wave — pure reducer for the public-nav slice. Mount in template
 * root reducer the same way as pages/landing reducers:
 *
 *   case "PUBLIC_NAV_UPSERT":
 *   case "PUBLIC_NAV_DELETE":
 *   case "PUBLIC_NAV_REORDER":
 *     return { ...state, ...publicNavReducer(state, action) };
 *
 * Auto-shifts sibling orders on upsert + closes gaps on delete so
 * positions stay contiguous (same algorithm as landing/reducer.ts).
 */
export function publicNavReducer(state: PublicNavSlice, action: PublicNavAction): PublicNavSlice {
  switch (action.type) {
    case "PUBLIC_NAV_UPSERT": {
      const idx = state.publicNav.findIndex((n) => n.id === action.payload.id);
      const previousOrder = idx >= 0 ? state.publicNav[idx].order : null;
      const targetOrder = action.payload.order;
      const others = state.publicNav.filter((n) => n.id !== action.payload.id);
      let shifted = others;
      if (previousOrder == null) {
        shifted = others.map((n) =>
          n.order >= targetOrder ? { ...n, order: n.order + 1 } : n,
        );
      } else if (previousOrder !== targetOrder) {
        shifted = others.map((n) => {
          if (targetOrder < previousOrder && n.order >= targetOrder && n.order < previousOrder) {
            return { ...n, order: n.order + 1 };
          }
          if (targetOrder > previousOrder && n.order > previousOrder && n.order <= targetOrder) {
            return { ...n, order: n.order - 1 };
          }
          return n;
        });
      }
      const next: PublicNavItem[] = [...shifted, action.payload];
      next.sort((a, b) => a.order - b.order);
      return { publicNav: next };
    }
    case "PUBLIC_NAV_DELETE": {
      const removed = state.publicNav.find((n) => n.id === action.payload.id);
      if (!removed) return state;
      const next = state.publicNav
        .filter((n) => n.id !== action.payload.id)
        .map((n) => (n.order > removed.order ? { ...n, order: n.order - 1 } : n));
      return { publicNav: next };
    }
    case "PUBLIC_NAV_REORDER": {
      const idx = state.publicNav.findIndex((n) => n.id === action.payload.id);
      if (idx < 0) return state;
      const swapWith = action.payload.direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= state.publicNav.length) return state;
      const a = state.publicNav[idx];
      const b = state.publicNav[swapWith];
      const next = state.publicNav.map((n) => {
        if (n.id === a.id) return { ...n, order: b.order };
        if (n.id === b.id) return { ...n, order: a.order };
        return n;
      });
      next.sort((x, y) => x.order - y.order);
      return { publicNav: next };
    }
    default:
      return state;
  }
}

/** Resolve a PublicNavItem to a concrete href. Binds pageRef → page slug
 *  when the page exists; falls back to literal href otherwise. */
export function resolvePublicNavHref(
  item: PublicNavItem,
  pages: { id: string; slug: string }[],
  basePath = "",
): string {
  if (item.pageRef) {
    const page = pages.find((p) => p.id === item.pageRef);
    if (page) return `${basePath}/${page.slug.replace(/^\//, "")}`;
  }
  return item.href ?? "#";
}
