import { pbkdf2Sync, randomBytes } from "node:crypto";

const username = (process.argv[2] ?? "").trim().toLowerCase();
if (!/^[a-z0-9._-]{1,64}$/u.test(username)) {
  console.error("Usage: printf '%s' 'password' | node scripts/hash-demo-password.mjs <username>");
  process.exit(1);
}

let password = "";
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/[\r\n]+$/u, "");
if (password.length < 12) {
  console.error("Password must contain at least 12 characters.");
  process.exit(1);
}

const iterations = 210_000;
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256");
const credential = `pbkdf2-sha256$${iterations}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
process.stdout.write(`${JSON.stringify({ [username]: credential })}\n`);
