"use client";

import * as React from "react";
import { useAction } from "convex/react";
import { KeyRound, Loader2, Check } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Password reset without an email provider. Proof-of-ownership = the admin's
 * `users` _id from the Convex dashboard (Data → users) — only someone with
 * dashboard access can read it, which already equals full control of the
 * deployment. id + email must both match; old sessions are invalidated.
 */
export function ResetForm({ onBack }: { onBack: () => void }) {
  const reset = useAction(api.authReset.resetWithAdminId);
  const [adminUserId, setAdminUserId] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await reset({ adminUserId, email, newPassword });
      setDone(true);
    } catch (err) {
      const data = (err as { data?: unknown })?.data;
      setError(typeof data === "string" ? data : "Reset gagal — periksa kembali ID dan email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <Card className="w-full max-w-sm border-border/60 shadow-[var(--shadow-lift)]">
        <CardContent className="p-7">
          <div className="mb-6 flex items-center gap-2 text-brand">
            <KeyRound className="size-4" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Reset password</span>
          </div>
          {done ? (
            <>
              <p className="flex items-center gap-2 text-sm">
                <Check className="size-4 text-brand" /> Password diganti. Masuk dengan password baru.
              </p>
              <Button type="button" className="mt-4 w-full" onClick={onBack}>
                Ke halaman masuk
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold tracking-tight">Lupa password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Buktikan kepemilikan dengan <b>ID admin</b> dari Convex dashboard:
                buka <b>dashboard.convex.dev → project kamu → Data → tabel{" "}
                <code>users</code></b>, salin nilai <code>_id</code> di baris akun kamu.
              </p>
              <form onSubmit={submit} className="mt-6 space-y-3">
                <Input
                  placeholder="ID admin (users._id)"
                  value={adminUserId}
                  onChange={(e) => setAdminUserId(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email akun"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password baru (min. 8 karakter)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? <Loader2 className="size-4 animate-spin" /> : "Ganti password"}
                </Button>
              </form>
              <button
                type="button"
                onClick={onBack}
                className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                ← Kembali ke halaman masuk
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
