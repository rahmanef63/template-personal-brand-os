"use client";

import * as React from "react";
import { SEED_USERS } from "./seed";
import type { RoleId, UserRow } from "./types";

/** Adapter pattern (CB-wave) — every block's data IO goes through a
 *  bindings object. Demo provides the default (useState + SEED). A
 *  consumer wrapping the block in <UsersBindingsProvider value={...}>
 *  can swap to any other source (Convex, REST, mock) WITHOUT touching
 *  the BlockView.
 *
 *  Contract:
 *    users      — current snapshot. Demo is sync; Convex returns
 *                 SEED while loading then swaps to the real list.
 *    isLoading  — true only while the first fetch resolves.
 *    changeRole — optimistic in demo; Convex impl issues mutation.
 *    revoke     — same.
 *
 *  See eject-spec.md → Phase 2 (file writer + path rewriter) — the
 *  bindings file is what an ejected app overrides to wire its own
 *  Convex / REST / external auth source.
 */
export type UsersBindings = {
  users: UserRow[];
  isLoading: boolean;
  changeRole: (id: string, role: RoleId) => void;
  revoke: (id: string) => void;
};

/** Hook factory — the default demo-mode bindings (in-memory). Hold
 *  state once per <UsersBindingsProvider> instance OR per
 *  <UsersBlockView> when no provider is in scope. */
export function useDefaultUsersBindings(): UsersBindings {
  const [users, setUsers] = React.useState<UserRow[]>(SEED_USERS);
  const changeRole = React.useCallback<UsersBindings["changeRole"]>((id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }, []);
  const revoke = React.useCallback<UsersBindings["revoke"]>((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);
  return { users, isLoading: false, changeRole, revoke };
}

const UsersBindingsContext = React.createContext<UsersBindings | null>(null);

export function UsersBindingsProvider({
  value,
  children,
}: {
  value: UsersBindings;
  children: React.ReactNode;
}) {
  return (
    <UsersBindingsContext.Provider value={value}>{children}</UsersBindingsContext.Provider>
  );
}

/** Consume bindings. If no provider in scope, falls back to the
 *  default (demo) bindings — so the demo iframe works with no setup. */
export function useUsersBindings(): UsersBindings {
  const ctx = React.useContext(UsersBindingsContext);
  const fallback = useDefaultUsersBindings();
  return ctx ?? fallback;
}
