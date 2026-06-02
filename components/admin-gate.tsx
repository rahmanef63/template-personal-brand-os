"use client";

import * as React from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function Spinner() {
  return (
    <div className="grid min-h-screen place-items-center text-muted-foreground">
      <Loader2 className="size-6 animate-spin" />
    </div>
  );
}

// Gates the admin dashboard behind @convex-dev/auth (Password). The auth hooks
// require ConvexAuthProvider, which only mounts client-side — so the outer gate
// renders a spinner during SSR/prerender (no auth hook called) and defers the
// auth check to <AdminGateInner> after mount.
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <Spinner />;
  return <AdminGateInner>{children}</AdminGateInner>;
}

function AdminGateInner({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <LoginForm />;
  return <>{children}</>;
}

function LoginForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = React.useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [signupKey, setSignupKey] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email, password, name, signupKey, flow });
    } catch (err) {
      setError(
        flow === "signIn"
          ? "Email atau password salah."
          : "Gagal mendaftar — setup key salah, atau email sudah dipakai / password kurang kuat.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <Card className="w-full max-w-sm border-border/60 shadow-[var(--shadow-lift)]">
        <CardContent className="p-7">
          <div className="mb-6 flex items-center gap-2 text-brand">
            <Lock className="size-4" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Admin</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {flow === "signIn" ? "Masuk dashboard" : "Buat akun admin"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {flow === "signIn" ? "Kelola konten situ kamu." : "Akun pertama jadi pemilik."}
          </p>
          <form onSubmit={submit} className="mt-6 space-y-3">
            {flow === "signUp" && (
              <>
                <Input placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
                <Input
                  placeholder="Setup key"
                  value={signupKey}
                  onChange={(e) => setSignupKey(e.target.value)}
                  required
                />
              </>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : flow === "signIn" ? "Masuk" : "Daftar"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
            className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {flow === "signIn" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
