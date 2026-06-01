"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

// Reusable admin image upload → Convex storage. Calls onUploaded(servedUrl).
// The served URL lives on the deployment domain (*.convex.cloud), whitelisted
// in next.config.mjs so next/image renders it.
export function ConvexImageUpload({
  onUploaded,
  label = "Upload image",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getUrl = useMutation(api.files.getUrl);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await res.json()) as { storageId: string };
      const served = await getUrl({ storageId: storageId as never });
      if (served) onUploaded(served);
    } catch (err) {
      console.error("[ConvexImageUpload] failed", err);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handle} />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" /> {busy ? "Uploading…" : label}
      </Button>
    </>
  );
}
