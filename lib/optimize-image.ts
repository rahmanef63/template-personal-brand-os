// Client-side image optimization before upload: re-encode to WebP + cap the
// longest edge. Native Canvas — no dependency, no server round-trip. Browser only.
//
// ponytail: covers the 99% (PNG / JPEG / WebP / BMP raster photos). SVG + GIF
// pass through untouched — a canvas re-encode would wreck vector scaling /
// animation. Never regresses: if the WebP somehow ends up larger, the original
// wins; any decode/encode failure also falls back to the original so an upload
// never breaks.

const MAX_EDGE = 2048; // longest side in px — ample for a full-bleed hero on retina
const QUALITY = 0.82; // WebP quality — near-lossless to the eye, large size win

const RASTER = /^image\/(png|jpe?g|webp|bmp)$/i;

export async function optimizeImage(file: File): Promise<Blob> {
  if (typeof document === "undefined" || !RASTER.test(file.type)) return file;
  try {
    // imageOrientation:"from-image" honors EXIF rotation (phone photos).
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", QUALITY),
    );
    // Bail to the original if the encode failed or didn't actually shrink it.
    if (!blob || blob.size >= file.size) return file;
    return blob;
  } catch {
    return file;
  }
}
