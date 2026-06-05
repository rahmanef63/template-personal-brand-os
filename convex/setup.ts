import { action, query } from "./_generated/server";
import { createAccount } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Onboarding state for the admin UI. Public (no PII) so the login form and the
// dashboard setup banner can adapt before/after sign-in.
export const status = query({
  args: {},
  handler: async (ctx) => {
    const owner = await ctx.db.query("users").first();
    const post = await ctx.db.query("posts").first();
    const landing = await ctx.db.query("landingSections").first();
    const settings = await ctx.db.query("siteSettings").first();
    const keyConfigured = !!process.env.ADMIN_SIGNUP_KEY;
    const ownerClaimed = !!owner;
    return {
      ownerClaimed,
      seeded: !!(post || landing),
      // JWT auth keys present? (setup-auth.mjs provisions them at build; a
      // deploy key without WriteEnvironmentVariables leaves them missing.)
      authReady: !!process.env.JWT_PRIVATE_KEY,
      // Onboarding wizard is done once the owner finishes it (onboardedAt set).
      onboarded: !!settings?.onboardedAt,
      // Signup is open if no owner has claimed yet, or a key is configured (invites).
      signupOpen: !ownerClaimed || keyConfigured,
      // The "Setup key" field is only needed when a key is configured.
      signupKeyRequired: keyConfigured,
    };
  },
});

// Auto-create the owner from env (ADMIN_EMAIL + ADMIN_PASSWORD) on a fresh site —
// zero-touch admin for a clone. Safe: no-ops once any owner exists, and only acts
// on values the deployer set in their own Convex env. The login form calls this
// on first load; the owner can then sign in with those credentials.
export const bootstrapAdmin = action({
  args: {},
  handler: async (ctx) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return { ok: false, reason: "no-env" as const };
    const s = await ctx.runQuery(api.setup.status, {});
    if (s.ownerClaimed) return { ok: false, reason: "owner-exists" as const };
    try {
      await createAccount(ctx, {
        provider: "password",
        account: { id: email, secret: password },
        profile: { email, name: email },
      });
      return { ok: true as const, email };
    } catch {
      return { ok: false, reason: "create-failed" as const };
    }
  },
});
