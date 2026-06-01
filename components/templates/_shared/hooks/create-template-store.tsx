"use client";

import * as React from "react";

/**
 * Factory: build a typed Provider + useStore hook for a website-template.
 *
 * Each template defines its own State + Action types and reducer; this
 * factory wires the shared concerns (localStorage hydrate, BroadcastChannel
 * cross-iframe sync, ready flag) so we don't reimplement them per template.
 *
 * Usage (per template):
 *
 * ```ts
 * const { Provider, useStore } = createTemplateStore<State, Action>({
 *   storageKey: "agency-studio:state:v1",
 *   channel: "agency-studio:sync",
 *   seed: SEED_STATE,
 *   reducer,
 * });
 * export const StoreProvider = Provider;
 * export { useStore };
 * ```
 */
export function createTemplateStore<S, A extends { type: string }>(opts: {
  storageKey: string;
  channel: string;
  seed: S;
  reducer: (state: S, action: A) => S;
}) {
  type Ctx = { state: S; dispatch: (a: A) => void; ready: boolean };
  const StoreCtx = React.createContext<Ctx | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    const [state, baseDispatch] = React.useReducer(opts.reducer, opts.seed);
    const [ready, setReady] = React.useState(false);
    const channelRef = React.useRef<BroadcastChannel | null>(null);

    React.useEffect(() => {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(opts.storageKey);
        if (raw) baseDispatch({ type: "hydrate", state: JSON.parse(raw) } as unknown as A);
      } catch {
        // ignore
      }
      setReady(true);

      const ch = new BroadcastChannel(opts.channel);
      channelRef.current = ch;
      ch.onmessage = (e) => {
        const action = e.data as A;
        if (action && typeof action === "object" && "type" in action) baseDispatch(action);
      };
      return () => {
        ch.close();
        channelRef.current = null;
      };
    }, []);

    React.useEffect(() => {
      if (!ready) return;
      try {
        window.localStorage.setItem(opts.storageKey, JSON.stringify(state));
      } catch {
        // ignore
      }
    }, [state, ready]);

    const dispatch = React.useCallback((action: A) => {
      baseDispatch(action);
      channelRef.current?.postMessage(action);
    }, []);

    const value = React.useMemo<Ctx>(() => ({ state, dispatch, ready }), [state, dispatch, ready]);
    return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
  }

  function useStore() {
    const c = React.useContext(StoreCtx);
    if (!c) throw new Error("useStore must be inside <StoreProvider>");
    return c;
  }

  return { Provider, useStore };
}
