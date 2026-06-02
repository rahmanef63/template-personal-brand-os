/** Curated Unsplash landscapes — the no-API-key fallback the Unsplash tab shows
 *  by default (and when `searchUnsplash` isn't wired). URLs are built from
 *  stable photo IDs via the images.unsplash.com CDN. */

import type { UnsplashPhoto } from "../types";

const IDS = [
  "1506744038136-46273834b3fb", "1469474968028-56623f02e42e",
  "1470071459604-3b5ec3a7fe05", "1447752875215-b2761acb3c5d",
  "1441974231531-c6227db76b6e", "1465146344425-f00d5f5c8f07",
  "1518173946687-a4c8892bbd9f", "1472214103451-9374bd1c798e",
  "1433086966358-54859d0ed716", "1426604966848-d7adac402bff",
  "1501785888041-af3ef285b470", "1506905925346-21bda4d32df4",
];

const cdn = (id: string, w: number, q: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const CURATED_UNSPLASH: UnsplashPhoto[] = IDS.map((id) => ({
  id,
  regular: cdn(id, 1080, 70),
  thumb: cdn(id, 240, 60),
  full: cdn(id, 2400, 80),
  width: 1280,
  height: 768,
  alt: "Landscape",
  photographer: "Unsplash",
  photographerUrl: "https://unsplash.com",
  source: `https://unsplash.com/photos/${id}`,
}));
