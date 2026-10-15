import { NextResponse } from "next/server";
import { safeDemoReturnPath } from "./session";

type DemoRedirectStatus = 303 | 307;

export function demoLoginPath(nextValue: string | null | undefined, hasError = false) {
  const search = new URLSearchParams();
  if (hasError) search.set("error", "1");
  search.set("next", safeDemoReturnPath(nextValue));
  return `/demo/login?${search.toString()}`;
}

function demoRedirectLocation(location: string) {
  const base = new URL("https://demo.invalid");
  const destination = new URL(location, base);
  const isRelativePath = location.startsWith("/") && !location.startsWith("//");
  const isDemoPath = destination.pathname === "/demo" || destination.pathname.startsWith("/demo/");
  if (!isRelativePath || destination.origin !== base.origin || !isDemoPath) {
    throw new Error("Invalid demo redirect path.");
  }
  return `${destination.pathname}${destination.search}`;
}

export function demoRedirect(location: string, status: DemoRedirectStatus = 307) {
  return new NextResponse(null, {
    status,
    headers: { Location: demoRedirectLocation(location) },
  });
}

export function demoProxyRedirect(location: string) {
  const netlifyOrigin = process.env.NETLIFY === "true"
    ? process.env.DEPLOY_PRIME_URL ?? process.env.URL
    : undefined;
  const publicOrigin = process.env.DEMO_AUTH_PUBLIC_ORIGIN ?? process.env.RENDER_EXTERNAL_URL ?? netlifyOrigin;
  if (!publicOrigin) {
    throw new Error("Missing demo auth public origin.");
  }
  const origin = new URL(publicOrigin);
  if (origin.protocol !== "https:" && origin.protocol !== "http:") {
    throw new Error("Invalid demo auth public origin.");
  }
  return NextResponse.redirect(new URL(demoRedirectLocation(location), origin.origin));
}
