"use client";

import * as React from "react";
import { useConvex, useMutation } from "convex/react";
import { Download, Loader2, Upload, Database } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * One-click backup / restore. Download a structured JSON snapshot of all site
 * content (no credentials), or restore from one. Restore replaces existing
 * content, so it double-confirms. Both calls are admin-gated server-side.
 */
export function BackupCard() {
  const convex = useConvex();
  const importAll = useMutation(api.backup.importAll);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = React.useState(false);
  const [importing, setImporting] = React.useState(false);

  async function download() {
    setExporting(true);
    try {
      const snapshot = await convex.query(api.backup.exportAll, {});
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date(snapshot.exportedAt).toISOString().slice(0, 10);
      a.href = url;
      a.download = `site-backup-${stamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup terunduh.");
    } catch {
      toast.error("Gagal membuat backup.");
    } finally {
      setExporting(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-pick same file
    if (!file) return;
    if (!window.confirm("Restore akan MENGGANTI semua konten saat ini dengan isi backup. Lanjut?")) return;
    setImporting(true);
    try {
      const snapshot = JSON.parse(await file.text());
      if (!snapshot?.tables) throw new Error("invalid");
      const r = await importAll({ snapshot });
      toast.success(`Restore selesai — ${r.inserted} item dipulihkan.`);
    } catch {
      toast.error("File backup tidak valid atau gagal restore.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <div>
          <h3 className="flex items-center gap-2 font-medium">
            <Database className="size-4 text-brand" /> Backup & Restore
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Unduh snapshot semua konten (blog, portfolio, halaman, pengaturan). Simpan
            sendiri, atau pulihkan kapan saja. Tidak menyertakan data login.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={download} disabled={exporting} className="gap-1.5">
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Download JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={importing} className="gap-1.5">
            {importing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            Import JSON
          </Button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
        </div>
        <p className="text-[11px] text-muted-foreground">
          ⚠️ Restore mengganti konten yang ada. Unduh backup dulu sebelum restore.
        </p>
      </CardContent>
    </Card>
  );
}
