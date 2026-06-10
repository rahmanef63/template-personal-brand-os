/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _shared_auth from "../_shared/auth.js";
import type * as _shared_crypto from "../_shared/crypto.js";
import type * as auth from "../auth.js";
import type * as authReset from "../authReset.js";
import type * as backup from "../backup.js";
import type * as chat from "../chat.js";
import type * as checkout from "../checkout.js";
import type * as comments from "../comments.js";
import type * as features_aiChat_action from "../features/aiChat/action.js";
import type * as features_notion__schema from "../features/notion/_schema.js";
import type * as features_notion_mutation from "../features/notion/mutation.js";
import type * as features_notion_query from "../features/notion/query.js";
import type * as features_payment__schema from "../features/payment/_schema.js";
import type * as features_payment_actions_doku from "../features/payment/actions/doku.js";
import type * as features_payment_actions_doku_helpers from "../features/payment/actions/doku_helpers.js";
import type * as features_payment_doku_client from "../features/payment/doku/client.js";
import type * as features_payment_doku_signature from "../features/payment/doku/signature.js";
import type * as features_payment_doku_types from "../features/payment/doku/types.js";
import type * as features_payment_http from "../features/payment/http.js";
import type * as features_payment_mutation from "../features/payment/mutation.js";
import type * as features_payment_query from "../features/payment/query.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as landing from "../landing.js";
import type * as leads from "../leads.js";
import type * as orders from "../orders.js";
import type * as pages from "../pages.js";
import type * as portfolio from "../portfolio.js";
import type * as posts from "../posts.js";
import type * as resources from "../resources.js";
import type * as seed from "../seed.js";
import type * as seedPoster from "../seedPoster.js";
import type * as services from "../services.js";
import type * as settings from "../settings.js";
import type * as setup from "../setup.js";
import type * as storeExtra from "../storeExtra.js";
import type * as subscribers from "../subscribers.js";
import type * as update from "../update.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "_shared/auth": typeof _shared_auth;
  "_shared/crypto": typeof _shared_crypto;
  auth: typeof auth;
  authReset: typeof authReset;
  backup: typeof backup;
  chat: typeof chat;
  checkout: typeof checkout;
  comments: typeof comments;
  "features/aiChat/action": typeof features_aiChat_action;
  "features/notion/_schema": typeof features_notion__schema;
  "features/notion/mutation": typeof features_notion_mutation;
  "features/notion/query": typeof features_notion_query;
  "features/payment/_schema": typeof features_payment__schema;
  "features/payment/actions/doku": typeof features_payment_actions_doku;
  "features/payment/actions/doku_helpers": typeof features_payment_actions_doku_helpers;
  "features/payment/doku/client": typeof features_payment_doku_client;
  "features/payment/doku/signature": typeof features_payment_doku_signature;
  "features/payment/doku/types": typeof features_payment_doku_types;
  "features/payment/http": typeof features_payment_http;
  "features/payment/mutation": typeof features_payment_mutation;
  "features/payment/query": typeof features_payment_query;
  files: typeof files;
  http: typeof http;
  landing: typeof landing;
  leads: typeof leads;
  orders: typeof orders;
  pages: typeof pages;
  portfolio: typeof portfolio;
  posts: typeof posts;
  resources: typeof resources;
  seed: typeof seed;
  seedPoster: typeof seedPoster;
  services: typeof services;
  settings: typeof settings;
  setup: typeof setup;
  storeExtra: typeof storeExtra;
  subscribers: typeof subscribers;
  update: typeof update;
  users: typeof users;
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
