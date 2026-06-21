// DEMO-only persistence + cross-iframe sync for the interactive demo shell.
//
// In DEMO (NEXT_PUBLIC_DEMO=1) the store never touches Convex; it reads/writes
// the whole frontend State as one JSON blob in localStorage and broadcasts each
// dispatched action over a BroadcastChannel so the *other* iframe (public <->
// admin in Split/Admin mode) re-renders live. None of this loads in real clones
// — every import here is gated behind IS_DEMO at the call sites.
//
// SSR-safe: every function guards on `typeof window` so it's a harmless no-op
// during prerender (the demo state only materialises after mount in the client).

import type { Action, State } from "@/features/_app/types";

/** localStorage key for the persisted demo State blob. Bump the vN on a
 *  breaking State-shape change so stale payloads don't deserialize wrong. */
export const DEMO_STATE_KEY = "pb:demo:state:v1";

/** BroadcastChannel name shared by every demo iframe of this origin. */
const DEMO_CHANNEL = "pb:demo";

/** Read the persisted demo State, or fall back to `seed` (and persist it so the
 *  two iframes start from a single shared snapshot). SSR-safe. */
export function loadDemoState(seed: State, key: string = DEMO_STATE_KEY): State {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return seed;
    // ponytail: shallow-merge over seed so a State field added in a newer build
    // gets its default instead of being undefined from an older payload.
    return { ...seed, ...(JSON.parse(raw) as Partial<State>) } as State;
  } catch {
    return seed;
  }
}

/** Persist the full demo State blob. SSR-safe no-op on the server. */
export function saveDemoState(state: State, key: string = DEMO_STATE_KEY): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* quota / private-mode — demo just won't persist, not worth surfacing */
  }
}

/** Drop the persisted blob so the next load returns to SEED_STATE. */
export function resetDemoState(key: string = DEMO_STATE_KEY): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Open the demo BroadcastChannel (or null if unavailable / SSR). Caller owns
 *  closing it. */
export function openDemoChannel(): BroadcastChannel | null {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return null;
  try {
    return new BroadcastChannel(DEMO_CHANNEL);
  } catch {
    return null;
  }
}

/** Fire-and-forget broadcast of a dispatched action to the sibling iframe(s). */
export function broadcastAction(channel: BroadcastChannel | null, action: Action): void {
  try {
    channel?.postMessage(action);
  } catch {
    /* ignore — best-effort live sync */
  }
}
