"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { UsersBindings } from "./bindings";
import { SEED_USERS } from "./seed";
import type { UserRow } from "./types";

/** Convex-backed UsersBindings — real persistence. `users` is the join of the
 *  @convex-dev/auth `users` table with the adminRoles mapping (see
 *  convex/adminPanel_users.ts). While the query is loading (=== undefined) we
 *  return SEED_USERS so the UI is never blank, mirroring the in-memory demo. */
export function useConvexUsersBindings(): UsersBindings {
  const data = useQuery(api.adminPanel_users.get);
  const changeRoleMut = useMutation(api.adminPanel_users.changeRole);
  const revokeMut = useMutation(api.adminPanel_users.revoke);

  const isLoading = data === undefined;
  const users: UserRow[] = data ?? SEED_USERS;

  const changeRole: UsersBindings["changeRole"] = React.useCallback(
    (id, role) => {
      void changeRoleMut({ id: id as Id<"users">, role });
    },
    [changeRoleMut],
  );

  const revoke: UsersBindings["revoke"] = React.useCallback(
    (id) => {
      void revokeMut({ id: id as Id<"users"> });
    },
    [revokeMut],
  );

  return { users, isLoading, changeRole, revoke };
}
