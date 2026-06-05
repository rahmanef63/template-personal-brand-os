import { v, ConvexError } from "convex/values";
import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { modifyAccountCredentials, invalidateSessions } from "@convex-dev/auth/server";

// Password reset WITHOUT an email provider: proof-of-ownership = the admin's
// `users` _id, which is only visible in the Convex dashboard (Data → users).
// Anyone who can read the dashboard already owns the deployment, so this is
// equivalent to dashboard-level control — no Resend/SMTP setup needed.
// The _id is unguessable; id + email must BOTH match.

export const ownerForReset = internalQuery({
  args: { adminUserId: v.string(), email: v.string() },
  handler: async (ctx, { adminUserId, email }) => {
    const id = ctx.db.normalizeId("users", adminUserId.trim());
    if (!id) return null;
    const user = await ctx.db.get(id);
    if (!user) return null;
    const stored = user.email as string | undefined;
    if (!stored || stored.toLowerCase() !== email.trim().toLowerCase()) return null;
    // Return the STORED email casing — it's the authAccounts id.
    return { userId: id, accountEmail: stored };
  },
});

export const resetWithAdminId = action({
  args: {
    adminUserId: v.string(),
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, { adminUserId, email, newPassword }) => {
    if (!process.env.JWT_PRIVATE_KEY) {
      throw new ConvexError(
        "Kunci login belum terpasang di backend. Buka /setup untuk panduan.",
      );
    }
    if (newPassword.length < 8) {
      throw new ConvexError("Password minimal 8 karakter.");
    }
    const match = await ctx.runQuery(internal.authReset.ownerForReset, {
      adminUserId,
      email,
    });
    if (!match) {
      throw new ConvexError("ID admin atau email tidak cocok.");
    }
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: match.accountEmail, secret: newPassword },
    });
    // Old sessions die with the old password.
    await invalidateSessions(ctx, { userId: match.userId });
    return { ok: true as const };
  },
});
