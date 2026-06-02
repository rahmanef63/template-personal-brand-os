"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  ImagePickerButton,
  unsplashSearchVia,
  type ImageValue,
} from "@/components/image-picker";

// Project adapter for the portable image-picker slice: ONE button → dialog
// (gallery · upload · link · Unsplash). Upload backend = Convex files; Unsplash
// = the /api/unsplash route. Drop-in for the old ConvexImageUpload — same
// `onUploaded(url)` callback, so callers store a plain URL string.
const searchUnsplash = unsplashSearchVia("/api/unsplash");

export function ImageField({
  label = "Pilih gambar",
  onUploaded,
}: {
  label?: string;
  onUploaded: (url: string) => void;
}) {
  const genUrl = useMutation(api.files.generateUploadUrl);
  const getUrl = useMutation(api.files.getUrl);

  const onUpload = React.useCallback(
    async (file: File) => {
      const uploadUrl = await genUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await res.json()) as { storageId: string };
      const served = await getUrl({ storageId: storageId as never });
      return (served as string) ?? "";
    },
    [genUrl, getUrl],
  );

  return (
    <ImagePickerButton
      label={label}
      variant="outline"
      size="sm"
      className="w-full gap-1"
      onUpload={onUpload}
      searchUnsplash={searchUnsplash}
      onChange={(img: ImageValue) => onUploaded(img.value)}
    />
  );
}
