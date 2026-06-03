"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { CheckCircle2, Circle, AlertTriangle, Loader2, ArrowRight, Copy, Check } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CORE_VERSION } from "@/lib/headless-core/version";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Self-diagnosing setup page (`/setup`). A non-coder opens this and sees, in
 * plain language, exactly what's done and what's left — no terminal, no docs
 * hunting. Each unfinished step links straight to the fix.
 *
 * Detection ladder:
 *  1. NEXT_PUBLIC_CONVEX_URL present?           (build-time env, read directly)
 *  2. Backend deployed? (functions answer)      (status query resolves vs errors)
 *  3. Owner claimed / 4. Seeded / 5. Onboarded  (from setup.status)
 */
export function SetupHealth() {
  if (!CONVEX_URL || CONVEX_URL.includes("placeholder")) {
    return (
      <Shell>
        <StepRow state="todo" title="Hubungkan database (Convex)">
          <p className="text-sm text-muted-foreground">
            Website belum tahu alamat database-nya. Di <b>Vercel → Settings →
            Environment Variables</b>, isi dua ini lalu <b>Redeploy</b>:
          </p>
          <EnvBlock />
          <p className="text-xs text-muted-foreground">
            Belum punya nilainya? Buat project di{" "}
            <a className="text-brand underline" href="https://convex.dev" target="_blank" rel="noreferrer">convex.dev</a>{" "}
            — URL ada di Settings, deploy key di Settings → Deploy Keys.
          </p>
        </StepRow>
        <Footer />
      </Shell>
    );
  }
  return (
    <Shell>
      <BackendBoundary>
        <Checklist />
      </BackendBoundary>
      <Footer />
    </Shell>
  );
}

function Checklist() {
  const status = useQuery(api.setup.status);
  if (status === undefined) {
    return (
      <div className="grid h-32 place-items-center text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }
  const allDone = status.ownerClaimed && status.seeded && status.onboarded;
  return (
    <>
      {allDone && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-4 py-3 text-sm">
          <CheckCircle2 className="size-5 text-brand" />
          <span>Semua beres — website kamu siap. 🎉</span>
        </div>
      )}
      <StepRow state="done" title="Database terhubung">
        <p className="text-sm text-muted-foreground">Website tersambung ke Convex.</p>
      </StepRow>
      <StepRow state="done" title="Backend ter-deploy">
        <p className="text-sm text-muted-foreground">Fungsi & tabel database aktif.</p>
      </StepRow>
      <StepRow
        state={status.ownerClaimed ? "done" : "todo"}
        title="Akun admin diklaim"
      >
        {status.ownerClaimed ? (
          <p className="text-sm text-muted-foreground">Pemilik sudah terdaftar. Pendaftaran admin tertutup.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Daftar sebagai pemilik. Akun pertama otomatis jadi admin — tidak perlu kunci.
            </p>
            <Button asChild size="sm" className="w-fit">
              <Link href="/admin">Daftar sebagai pemilik <ArrowRight className="size-4" /></Link>
            </Button>
          </>
        )}
      </StepRow>
      <StepRow state={status.seeded ? "done" : "todo"} title="Konten terisi">
        {status.seeded ? (
          <p className="text-sm text-muted-foreground">Sudah ada konten.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Isi konten contoh dari dashboard (tombol "Isi konten contoh"), atau lewat wizard onboarding.
            </p>
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href="/dashboard">Buka dashboard <ArrowRight className="size-4" /></Link>
            </Button>
          </>
        )}
      </StepRow>
      <StepRow state={status.onboarded ? "done" : "todo"} title="Onboarding selesai">
        <p className="text-sm text-muted-foreground">
          {status.onboarded
            ? "Identitas situs sudah diisi."
            : "Lengkapi nama situs, branding, dan kontak di wizard (muncul saat pertama masuk dashboard)."}
        </p>
      </StepRow>
    </>
  );
}

// --- error boundary: backend reachable but functions not deployed ----------
class BackendBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <StepRow state="warn" title="Backend belum ter-deploy">
          <p className="text-sm text-muted-foreground">
            Database tersambung tapi fungsinya belum ada (error <code>Server Error</code>).
            Pastikan <b>CONVEX_DEPLOY_KEY</b> terisi di Vercel, lalu <b>Redeploy</b> —
            build otomatis push fungsi & tabel ke Convex.
          </p>
          <EnvBlock />
        </StepRow>
      );
    }
    return this.props.children;
  }
}

// --- presentational --------------------------------------------------------
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Setup</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Status website kamu</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cek satu halaman: apa yang sudah jalan, apa yang masih kurang.
      </p>
      <Card className="mt-8 border-border/60">
        <CardContent className="divide-y divide-border/50 p-0">{children}</CardContent>
      </Card>
    </div>
  );
}

function StepRow({
  state,
  title,
  children,
}: {
  state: "done" | "todo" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  const Icon = state === "done" ? CheckCircle2 : state === "warn" ? AlertTriangle : Circle;
  const color = state === "done" ? "text-brand" : state === "warn" ? "text-amber-500" : "text-muted-foreground/50";
  return (
    <div className="flex gap-3 p-5">
      <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} />
      <div className="flex flex-col gap-2">
        <p className="font-medium">{title}</p>
        {children}
      </div>
    </div>
  );
}

function EnvBlock() {
  const text = "NEXT_PUBLIC_CONVEX_URL\nCONVEX_DEPLOY_KEY";
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-md border border-border/60 bg-muted/40 p-3 text-xs">
        <code>
          NEXT_PUBLIC_CONVEX_URL = https://NAMA.convex.cloud{"\n"}
          CONVEX_DEPLOY_KEY = (deploy key production)
        </code>
      </pre>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-md border border-border/60 bg-background text-muted-foreground transition hover:text-foreground"
        aria-label="Salin nama variabel"
      >
        {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

function Footer() {
  return (
    <p className="mt-6 text-center text-[11px] text-muted-foreground">
      Personal Brand OS v{CORE_VERSION} ·{" "}
      <Link href="/" className="underline">ke situs</Link> ·{" "}
      <Link href="/admin" className="underline">admin</Link>
    </p>
  );
}
