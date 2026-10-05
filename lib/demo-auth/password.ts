import { pbkdf2Sync, timingSafeEqual } from "node:crypto";
import { getDemoCredential } from "./session";

const algorithm = "pbkdf2-sha256";
const fallbackIterations = 210_000;
const fallbackSalt = Buffer.from("mira-link-demo-auth-fallback", "utf8");
const fallbackHash = pbkdf2Sync("invalid-password", fallbackSalt, fallbackIterations, 32, "sha256");

function decodeCredential(value: string | undefined) {
  if (!value) return null;
  const [name, iterationsValue, saltValue, hashValue, extra] = value.split("$");
  const iterations = Number(iterationsValue);
  if (name !== algorithm || extra || !Number.isSafeInteger(iterations) || iterations < 100_000) return null;
  try {
    const salt = Buffer.from(saltValue, "base64url");
    const hash = Buffer.from(hashValue, "base64url");
    if (salt.length < 16 || hash.length !== 32) return null;
    return { iterations, salt, hash };
  } catch {
    return null;
  }
}

export function verifyDemoCredentials(usernameValue: string, passwordValue: string) {
  const username = usernameValue.trim().toLowerCase();
  const credential = decodeCredential(getDemoCredential(username));
  const candidate = credential
    ? pbkdf2Sync(passwordValue, credential.salt, credential.iterations, credential.hash.length, "sha256")
    : pbkdf2Sync(passwordValue, fallbackSalt, fallbackIterations, fallbackHash.length, "sha256");
  const expected = credential?.hash ?? fallbackHash;
  return {
    username,
    valid: username.length > 0 && passwordValue.length > 0 && timingSafeEqual(candidate, expected) && Boolean(credential),
  };
}
