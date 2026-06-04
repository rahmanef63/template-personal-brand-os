"use client";

/** EmbedRenderer — block-type "embed". Detects iframe-friendly providers
 *  (YouTube / Vimeo / Loom / Figma / CodePen / Spotify) and rewrites
 *  the URL to the embed form. Other URLs render as a sandboxed iframe
 *  fallback. Edit mode shows URL input. */

import { useState } from "react";
import { Tv2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { BlockRendererProps } from "../../types";

function toEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "youtu.be" || host === "m.youtube.com") {
      const id = host === "youtu.be" ? u.pathname.slice(1) : u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "loom.com" || host.endsWith(".loom.com")) {
      return url.replace("/share/", "/embed/");
    }
    if (host === "codepen.io") {
      return url.replace("/pen/", "/embed/");
    }
    if (host === "open.spotify.com") {
      return `https://open.spotify.com/embed${u.pathname}`;
    }
    if (host === "figma.com" || host.endsWith(".figma.com")) {
      return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
    }

    return url;
  } catch {
    return null;
  }
}

export function EmbedRenderer({ block, onUpdate }: BlockRendererProps) {
  const [editing, setEditing] = useState(!block.url);
  const url = block.url ?? "";
  const embed = url ? toEmbed(url) : null;

  if (editing || !url) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/20 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Tv2 className="h-3.5 w-3.5" /> Embed URL — YouTube · Vimeo · Loom · Figma · CodePen · Spotify
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            autoFocus
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://…"
            className="h-8 text-xs"
          />
          <Button size="sm" disabled={!url} onClick={() => setEditing(false)} className="h-8 text-xs">
            Embed
          </Button>
        </div>
      </div>
    );
  }

  if (!embed) {
    return (
      <div className="my-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
        Cannot embed this URL. <Button variant="link" type="button" onClick={() => setEditing(true)} className="h-auto p-0 text-xs underline">Edit</Button>
      </div>
    );
  }

  return (
    <div className="my-2 overflow-hidden rounded-md border border-border bg-muted/10">
      <div className="relative aspect-video">
        <iframe
          src={embed}
          title={`Embed: ${url}`}
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex items-center justify-between border-t border-border px-2 py-1 text-[10px] text-muted-foreground">
        <span className="truncate">{url}</span>
        <Button variant="link" type="button" onClick={() => setEditing(true)} className="ml-2 h-auto p-0 text-[10px] underline">edit</Button>
      </div>
    </div>
  );
}
