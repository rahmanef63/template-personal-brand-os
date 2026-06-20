"use client";

import { UsersBindingsProvider } from "./bindings";
import { UsersBlockView } from "./UsersBlockView";
import { useConvexUsersBindings } from "./useConvexUsersBindings";

/** Convex-backed mount of the Users block — wraps the bare view in a provider
 *  whose value is the persisted (auth users + adminRoles) bindings instead of
 *  the in-memory demo fallback. */
export function UsersBlockConvex() {
  return (
    <UsersBindingsProvider value={useConvexUsersBindings()}>
      <UsersBlockView />
    </UsersBindingsProvider>
  );
}
