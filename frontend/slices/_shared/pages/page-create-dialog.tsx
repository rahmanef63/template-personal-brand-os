"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PageEntry } from "./types";

export type CreateDialogMode = { mode: "new" } | { mode: "dup"; source: PageEntry } | null;

/** Slug + title entry dialog. Powers both "New page" and "Duplicate" flows. */
export function PageCreateDialog({
  dialog,
  onClose,
  onConfirm,
}: {
  dialog: CreateDialogMode;
  onClose: () => void;
  onConfirm: (values: { slug: string; title: string }) => void;
}) {
  const initial = React.useMemo(() => {
    if (!dialog) return { slug: "", title: "" };
    if (dialog.mode === "new") return { slug: "new-page", title: "Untitled" };
    return { slug: `${dialog.source.slug}-copy`, title: `${dialog.source.title} (copy)` };
  }, [dialog]);

  const [slug, setSlug] = React.useState(initial.slug);
  const [title, setTitle] = React.useState(initial.title);

  React.useEffect(() => {
    setSlug(initial.slug);
    setTitle(initial.title);
  }, [initial]);

  return (
    <Dialog open={!!dialog} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialog?.mode === "dup" ? "Duplicate page" : "New page"}</DialogTitle>
          <DialogDescription>
            {dialog?.mode === "dup"
              ? `Cloning "${dialog.source.title}". Edit slug + title for the new copy.`
              : "Enter the new page slug + title."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="page-slug" className="text-xs">Slug</Label>
            <Input
              id="page-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              URL segment. Slashes allowed for nesting (e.g. case-studies/acme).
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="page-title" className="text-xs">Title</Label>
            <Input id="page-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">Cancel</Button>
          </DialogClose>
          <Button size="sm" disabled={!slug || !title} onClick={() => onConfirm({ slug, title })}>
            {dialog?.mode === "dup" ? "Duplicate" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
