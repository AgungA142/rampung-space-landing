import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get(sessionCookie.name)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
