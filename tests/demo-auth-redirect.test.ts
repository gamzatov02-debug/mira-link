import assert from "node:assert/strict";
import { pbkdf2Sync } from "node:crypto";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST as login } from "../app/demo/auth/login/route";
import { POST as logout } from "../app/demo/auth/logout/route";
import { demoLoginPath, demoProxyRedirect } from "../lib/demo-auth/redirect";
import { createDemoSession, DEMO_SESSION_COOKIE } from "../lib/demo-auth/session";
import { proxy } from "../proxy";

const username = "developer";
const password = "correct-horse-demo-password";
const salt = Buffer.from("0123456789abcdef", "utf8");
const hash = pbkdf2Sync(password, salt, 210_000, 32, "sha256");

process.env.DEMO_AUTH_USERS = JSON.stringify({
  [username]: `pbkdf2-sha256$210000$${salt.toString("base64url")}$${hash.toString("base64url")}`,
});
process.env.DEMO_AUTH_SESSION_SECRET = "demo-auth-test-secret-at-least-32-characters";
process.env.RENDER_EXTERNAL_URL = "https://mira-link-demo.onrender.com";

function loginRequest(passwordValue = password) {
  const form = new FormData();
  form.set("username", username);
  form.set("password", passwordValue);
  form.set("next", "/demo/guest/home");
  return new Request("http://0.0.0.0:10000/demo/auth/login", {
    method: "POST",
    body: form,
    headers: {
      host: "attacker.invalid",
      "x-forwarded-host": "attacker.invalid",
      "x-forwarded-proto": "https",
    },
  });
}

test("successful login keeps the redirect relative to the public host", async () => {
  const response = await login(loginRequest());
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/demo/guest/home");
  assert.match(response.headers.get("set-cookie") ?? "", /^mira_demo_session=/u);
});

test("failed login keeps its error redirect relative", async () => {
  const response = await login(loginRequest("wrong-password"));
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/demo/login?error=1&next=%2Fdemo%2Fguest%2Fhome");
});

test("logout keeps its redirect relative and expires the session", async () => {
  const response = await logout();
  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/demo/login");
  assert.match(response.headers.get("set-cookie") ?? "", /^mira_demo_session=;/u);
});

test("the auth proxy uses the public origin for protected and authenticated routes", async () => {
  const protectedResponse = await proxy(new NextRequest("http://0.0.0.0:10000/demo/guest/home?tab=bill"));
  assert.equal(protectedResponse.status, 307);
  assert.equal(
    protectedResponse.headers.get("location"),
    "https://mira-link-demo.onrender.com/demo/login?next=%2Fdemo%2Fguest%2Fhome%3Ftab%3Dbill",
  );

  const token = await createDemoSession(username);
  const loginPageRequest = new NextRequest("http://0.0.0.0:10000/demo/login?next=%2Fdemo%2Fguest%2Fhome", {
    headers: { cookie: `${DEMO_SESSION_COOKIE}=${token}` },
  });
  const authenticatedResponse = await proxy(loginPageRequest);
  assert.equal(authenticatedResponse.status, 307);
  assert.equal(authenticatedResponse.headers.get("location"), "https://mira-link-demo.onrender.com/demo/guest/home");
});

test("unsafe return destinations fall back to the demo root", () => {
  for (const value of ["https://attacker.invalid", "//attacker.invalid", "/outside", "/demo/auth/logout", "\\demo\\guest"]) {
    assert.equal(demoLoginPath(value), "/demo/login?next=%2Fdemo");
  }
});

test("the proxy redirect fails closed without a configured public origin", () => {
  const keys = ["DEMO_AUTH_PUBLIC_ORIGIN", "RENDER_EXTERNAL_URL", "NETLIFY", "DEPLOY_PRIME_URL", "URL"] as const;
  const saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  for (const key of keys) delete process.env[key];

  try {
    assert.throws(
      () => demoProxyRedirect("/demo/login"),
      /Missing demo auth public origin/u,
    );
  } finally {
    for (const key of keys) {
      const value = saved[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
