const encoder = new TextEncoder();

export const DEMO_SESSION_COOKIE = "mira_demo_session";
export const DEMO_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

function configuredUsers() {
  try {
    const parsed: unknown = JSON.parse(process.env.DEMO_AUTH_USERS ?? "{}");
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") return new Map<string, string>();
    return new Map(
      Object.entries(parsed)
        .filter((entry): entry is [string, string] => /^[a-z0-9._-]{1,64}$/u.test(entry[0]) && typeof entry[1] === "string"),
    );
  } catch {
    return new Map<string, string>();
  }
}

export function getDemoCredential(username: string) {
  return configuredUsers().get(username);
}

export function isDemoUserActive(username: string) {
  return configuredUsers().has(username);
}

function sessionSecret() {
  const secret = process.env.DEMO_AUTH_SESSION_SECRET ?? "";
  return secret.length >= 32 ? secret : null;
}

async function signature(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function equal(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export async function createDemoSession(username: string) {
  const secret = sessionSecret();
  if (!secret || !isDemoUserActive(username)) throw new Error("Demo authentication is not configured.");
  const payload: SessionPayload = {
    username,
    expiresAt: Math.floor(Date.now() / 1000) + DEMO_SESSION_MAX_AGE,
  };
  const encodedPayload = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const encodedSignature = toBase64Url(await signature(encodedPayload, secret));
  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifyDemoSession(token: string | undefined) {
  const secret = sessionSecret();
  if (!secret || !token) return null;
  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return null;

  try {
    const expectedSignature = await signature(encodedPayload, secret);
    if (!equal(expectedSignature, fromBase64Url(encodedSignature))) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload))) as Partial<SessionPayload>;
    if (
      typeof payload.username !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Math.floor(Date.now() / 1000) ||
      !isDemoUserActive(payload.username)
    ) return null;
    return { username: payload.username, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
}

export function safeDemoReturnPath(value: string | null | undefined) {
  const fallback = "/demo";
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  try {
    const base = new URL("https://demo.invalid");
    const destination = new URL(value, base);
    const isDemoPath = destination.pathname === "/demo" || destination.pathname.startsWith("/demo/");
    const isAuthPath = destination.pathname === "/demo/login" || destination.pathname.startsWith("/demo/auth/");
    if (destination.origin !== base.origin || !isDemoPath || isAuthPath) return fallback;
    return `${destination.pathname}${destination.search}`;
  } catch {
    return fallback;
  }
}
