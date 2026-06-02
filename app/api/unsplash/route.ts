import { NextRequest, NextResponse } from "next/server";

// Server proxy for Unsplash search — keeps UNSPLASH_ACCESS_KEY server-side.
// Without the key it returns an empty set so the picker falls back to its
// bundled curated photos (zero-config still works).
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query") ?? "";
  const perPage = req.nextUrl.searchParams.get("per_page") ?? "24";
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key || !query.trim()) {
    return NextResponse.json({ photos: [], error: key ? undefined : "no-key" });
  }
  try {
    const r = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      { headers: { Authorization: `Client-ID ${key}` } },
    );
    if (!r.ok) return NextResponse.json({ photos: [], error: `Unsplash ${r.status}` });
    const d = (await r.json()) as { results?: unknown[]; total?: number };
    const photos = (d.results ?? []).map((raw) => {
      const p = raw as Record<string, any>;
      return {
        id: p.id,
        regular: p.urls.regular,
        thumb: p.urls.thumb,
        full: p.urls.full,
        width: p.width,
        height: p.height,
        alt: p.alt_description ?? "",
        photographer: p.user?.name ?? "",
        photographerUrl: p.user?.links?.html ?? "",
        source: p.links?.html ?? "",
      };
    });
    return NextResponse.json({ photos, total: d.total });
  } catch (e) {
    return NextResponse.json({ photos: [], error: (e as Error).message });
  }
}
