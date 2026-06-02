import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

// Admin signup is gated by a server-side secret (ADMIN_SIGNUP_KEY), set in the
// Convex deployment env. Only someone who knows it can create an admin account —
// the public can never self-register and hijack the dashboard. The key doubles
// as a one-/many-use onboarding token: hand it to whoever should own a clone,
// they sign up once with it and pick their own password. Rotate/remove the env
// var to close signups entirely (existing admins keep logging in).
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        if (params.flow === "signUp") {
          const required = process.env.ADMIN_SIGNUP_KEY;
          if (!required || params.signupKey !== required) {
            throw new ConvexError(
              "Pendaftaran admin ditutup — setup key salah atau belum diset.",
            );
          }
        }
        const email = params.email as string;
        const name = (params.name as string | undefined) || email;
        return { email, name };
      },
    }),
  ],
});
