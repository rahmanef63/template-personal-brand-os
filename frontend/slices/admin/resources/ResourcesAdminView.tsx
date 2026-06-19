"use client";

import * as React from "react";
import { Download, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { nid, useResources, useStore } from "@/features/_app/store";
import type { Resource } from "@/features/_app/types";

export function ResourcesAdminView() {
  const resources = useResources();
  const { dispatch } = useStore();
  const [editingId, setEditingId] = React.useState<string | "new" | null>(null);
  const editing = editingId === "new" ? null : resources.find((r) => r.id === editingId) ?? null;

  const totalDownloads = resources.reduce((sum, r) => sum + r.downloads, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
          <p className="text-sm text-muted-foreground">
            {resources.length} resources · {totalDownloads.toLocaleString()} total downloads
          </p>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setEditingId("new")}>
          <Plus className="size-4" /> New resource
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((r) => (
          <Card key={r.id} className="border-border/60 bg-card/60">
            <CardContent className="space-y-2 p-5">
              <div className="flex items-center justify-between">
                <Download className="size-4 text-muted-foreground" />
                {r.gated ? (
                  <Badge variant="outline" className="rounded-full text-[10px]">email-required</Badge>
                ) : (
                  <Badge className="rounded-full bg-emerald-500/15 text-[10px] text-emerald-300 hover:bg-emerald-500/15">free</Badge>
                )}
              </div>
              <p className="text-sm font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.description}</p>
              <p className="text-[10px] text-muted-foreground">{r.fileLabel} · {r.downloads.toLocaleString()} downloads</p>
              <div className="flex items-center gap-1 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingId(r.id)}>Edit</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Hapus "${r.title}"?`)) {
                      dispatch({ type: "resource.delete", id: r.id });
                      toast.success("Resource dihapus");
                    }
                  }}
                >
                  <Trash2 className="size-3.5 text-rose-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ResourceDialog open={editingId !== null} existing={editing} onClose={() => setEditingId(null)} />
    </div>
  );
}

function ResourceDialog({
  open,
  existing,
  onClose,
}: {
  open: boolean;
  existing: Resource | null;
  onClose: () => void;
}) {
  const { dispatch } = useStore();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [fileLabel, setFileLabel] = React.useState("PDF · 12 hal");
  const [gated, setGated] = React.useState(true);

  React.useEffect(() => {
    setTitle(existing?.title ?? "");
    setDescription(existing?.description ?? "");
    setFileLabel(existing?.fileLabel ?? "PDF · 12 hal");
    setGated(existing?.gated ?? true);
  }, [existing, open]);

  function save() {
    if (!title) {
      toast.error("Title wajib");
      return;
    }
    const res: Resource = {
      id: existing?.id ?? nid("res"),
      title,
      description,
      fileLabel,
      gated,
      downloads: existing?.downloads ?? 0,
    };
    dispatch({ type: "resource.upsert", res });
    toast.success("Resource tersimpan");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existing ? `Edit ${existing.title}` : "New resource"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description" />
          <Input value={fileLabel} onChange={(e) => setFileLabel(e.target.value)} placeholder="File label (PDF · 38 hal)" />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={gated}
              onChange={(e) => setGated(e.target.checked)}
              className="size-4 rounded border bg-background"
            />
            Email-gated (lead capture)
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={save}><Save className="size-4" /> Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
