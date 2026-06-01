/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as chat from "../chat.js";
import type * as comments from "../comments.js";
import type * as http from "../http.js";
import type * as landing from "../landing.js";
import type * as leads from "../leads.js";
import type * as pages from "../pages.js";
import type * as portfolio from "../portfolio.js";
import type * as posts from "../posts.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as subscribers from "../subscribers.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  chat: typeof chat;
  comments: typeof comments;
  http: typeof http;
  landing: typeof landing;
  leads: typeof leads;
  pages: typeof pages;
  portfolio: typeof portfolio;
  posts: typeof posts;
  resources: typeof resources;
  seed: typeof seed;
  services: typeof services;
  subscribers: typeof subscribers;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
