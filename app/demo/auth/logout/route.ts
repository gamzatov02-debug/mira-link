import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo-auth/session";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/demo/login", request.url), 303);
  response.cookies.set({
    name: DEMO_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/demo",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
