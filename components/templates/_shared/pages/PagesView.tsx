"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagesStore } from "./pages-context";
import { blankPage, duplicatePage } from "./duplicate";
import { PageCreateDialog, type CreateDialogMode } from "./page-create-dialog";
import type { PageEntry } from "./types";

/**
 * Admin Pages list — system + custom pages with row actions
 * (View / Edit / Duplicate / Delete). New/Duplicate route through a
 * shadcn Dialog for slug + title entry. Delete is confirm-in-row.
 */
export function PagesView({
  publicBase,
  adminBase,
}: {
  publicBase: string;
  adminBase: string;
}) {
  const { pages, create } = usePagesStore();
  const [dialog, setDialog] = React.useState<CreateDialogMode>(null);

  const ordered = React.useMemo(
    () =>
      pages
        .slice()
        .sort((a, b) =>
          a.systemPage === b.systemPage ? a.slug.localeCompare(b.slug) : a.systemPage ? -1 : 1,
        ),
    [pages],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="text-xs text-muted-foreground">
            {pages.length} total · {pages.filter((p) => p.systemPage).length} system ·{" "}
            {pages.filter((p) => !p.systemPage).length} custom
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setDialog({ mode: "new" })}>
          <Plus className="size-3.5" /> New page
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[22%]">Slug</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[16%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordered.map((p) => (
              <PageRow
                key={p.id}
                page={p}
                publicBase={publicBase}
                adminBase={adminBase}
                onDuplicate={(src) => setDialog({ mode: "dup", source: src })}
              />
            ))}
            {ordered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                  No pages yet. Click <span className="font-medium">New page</span>.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PageCreateDialog
        dialog={dialog}
        onClose={() => setDialog(null)}
        onConfirm={({ slug, title }) => {
          const next =
            dialog?.mode === "dup"
              ? duplicatePage(dialog.source, { slug, title })
              : { ...blankPage(slug), title };
          create(next);
          setDialog(null);
          if (typeof window !== "undefined") {
            window.location.href = `${adminBase}/pages/${next.id}`;
          }
        }}
      />
    </div>
  );
}

function PageRow({
  page,
  publicBase,
  adminBase,
  onDuplicate,
}: {
  page: PageEntry;
  publicBase: string;
  adminBase: string;
  onDuplicate: (src: PageEntry) => void;
}) {
  const { remove } = usePagesStore();
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{page.slug || "/"}</TableCell>
      <TableCell className="text-xs">
        <div className="line-clamp-1 font-medium">{page.title}</div>
        {page.description && (
          <div className="line-clamp-1 text-muted-foreground">{page.description}</div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={page.status === "published" ? "default" : "outline"} className="text-[10px]">
          {page.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-[10px]">
          {page.systemPage ? "system" : "custom"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Button asChild size="icon" variant="ghost" className="size-7" title="View public">
            <Link href={`${publicBase}/${page.slug}`} target="_blank">
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="size-7"
            title={page.systemPage ? "System pages are read-only" : "Edit"}
            disabled={page.systemPage}
          >
            <Link href={`${adminBase}/pages/${page.id}`}>
              <Pencil className="size-3.5" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            title="Duplicate"
            onClick={() => onDuplicate(page)}
          >
            <Copy className="size-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-destructive hover:text-destructive"
            title={page.systemPage ? "System pages can't be deleted" : "Delete"}
            disabled={page.systemPage}
            onClick={() => {
              if (confirm(`Delete page "${page.title}"?`)) remove(page.id);
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
