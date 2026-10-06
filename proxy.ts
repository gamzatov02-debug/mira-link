import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, safeDemoReturnPath, verifyDemoSession } from "@/lib/demo-auth/session";

const publicDemoPaths = new Set([
  "/demo/login",
  "/demo/auth/login",
  "/demo/auth/logout",
]);

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return NextResponse.next();

  const path = request.nextUrl.pathname;
  if (publicDemoPaths.has(path)) {
    if (path === "/demo/login") {
      const session = await verifyDemoSession(request.cookies.get(DEMO_SESSION_COOKIE)?.value);
      if (session) {
        return NextResponse.redirect(new URL(safeDemoReturnPath(request.nextUrl.searchParams.get("next")), request.url));
      }
    }
    return NextResponse.next();
  }

  const session = await verifyDemoSession(request.cookies.get(DEMO_SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  const login = new URL("/demo/login", request.url);
  login.searchParams.set("next", safeDemoReturnPath(`${path}${request.nextUrl.search}`));
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/demo/:path*"],
};
