import { NextResponse } from "next/server";
import { safeDemoReturnPath } from "./session";

type DemoRedirectStatus = 303 | 307;

export function demoLoginPath(nextValue: string | null | undefined, hasError = false) {
  const search = new URLSearchParams();
  if (hasError) search.set("error", "1");
  search.set("next", safeDemoReturnPath(nextValue));
  return `/demo/login?${search.toString()}`;
}

export function demoRedirect(location: string, status: DemoRedirectStatus = 307) {
  const base = new URL("https://demo.invalid");
  const destination = new URL(location, base);
  const isRelativePath = location.startsWith("/") && !location.startsWith("//");
  const isDemoPath = destination.pathname === "/demo" || destination.pathname.startsWith("/demo/");
  if (!isRelativePath || destination.origin !== base.origin || !isDemoPath) {
    throw new Error("Invalid demo redirect path.");
  }
  return new NextResponse(null, {
    status,
    headers: { Location: `${destination.pathname}${destination.search}` },
  });
}
