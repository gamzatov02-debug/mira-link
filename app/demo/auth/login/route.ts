import { NextResponse } from "next/server";
import { verifyDemoCredentials } from "@/lib/demo-auth/password";
import {
  createDemoSession,
  DEMO_SESSION_COOKIE,
  DEMO_SESSION_MAX_AGE,
  safeDemoReturnPath,
} from "@/lib/demo-auth/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const usernameValue = String(form.get("username") ?? "").slice(0, 128);
  const passwordValue = String(form.get("password") ?? "").slice(0, 1024);
  const returnPath = safeDemoReturnPath(String(form.get("next") ?? "/demo"));
  const { username, valid } = verifyDemoCredentials(usernameValue, passwordValue);

  if (!valid) {
    const login = new URL("/demo/login", request.url);
    login.searchParams.set("error", "1");
    login.searchParams.set("next", returnPath);
    return NextResponse.redirect(login, 303);
  }

  const token = await createDemoSession(username);
  const response = NextResponse.redirect(new URL(returnPath, request.url), 303);
  response.cookies.set({
    name: DEMO_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: DEMO_SESSION_MAX_AGE,
    path: "/demo",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
