"use client";

// SSG-safe Convex auth provider for Next 16 + cacheComponents:true.
//
// Why not ConvexAuthNextjsProvider? Postmortem 5.2: it crashes during static
// prerender (calls useConvexAuth() with undefined context). This client-only
// mount + Suspense wrap pattern matches what the si-coder skill ships.
//
// Auth actions are routed through HTTP (not WebSocket) so signIn / signOut
// work even when the client hasn't established its WS yet.

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexHttpClient } from "convex/browser";
import { useEffect, useState, type ReactNode } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [convex] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    const client = new ConvexReactClient(url);
    const http = new ConvexHttpClient(url);
    const orig = client.action.bind(client);
    (client as unknown as { action: typeof client.action }).action = ((ref, args) => {
      const name = (ref as unknown as { _name?: string })?._name ?? String(ref);
      return typeof name === "string" && name.startsWith("auth:")
        ? http.action(ref, args)
        : orig(ref, args);
    }) as typeof client.action;
    return client;
  });

  useEffect(() => setMounted(true), []);
  if (!convex) return <>{children}</>;
  // Outer ConvexProvider ALWAYS supplies the client, so `useQuery` can never
  // throw "Could not find Convex client" — during SSR/prerender, during the
  // mount transition, or under the auth provider. ConvexAuthProvider nests
  // client-side only (it errors during static prerender).
  return (
    <ConvexProvider client={convex}>
      {mounted ? <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider> : children}
    </ConvexProvider>
  );
}
