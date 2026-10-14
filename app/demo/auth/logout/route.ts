import { DEMO_SESSION_COOKIE } from "@/lib/demo-auth/session";
import { demoRedirect } from "@/lib/demo-auth/redirect";

export async function POST() {
  const response = demoRedirect("/demo/login", 303);
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
