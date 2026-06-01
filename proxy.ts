// Next 16 proxy (renamed from middleware.ts).
// Stub — extend with auth gate via convexAuthNextjsToken() when ready.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
