import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  // Add app tables here. Example:
  // notes: defineTable({
  //   userId: v.id("users"),
  //   title: v.string(),
  //   body: v.string(),
  //   createdAt: v.number(),
  // }).index("by_user", ["userId"]),
});
