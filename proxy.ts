import { NextResponse, type NextRequest } from "next/server";

// Inlined, not imported: anything beyond next/server here 500s every route at import time.
const SESSION_COOKIE = "__session";

export function proxy(request: NextRequest) {
  try {
    if (!process.env.FIREBASE_PROJECT_ID) return NextResponse.next();
    if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
