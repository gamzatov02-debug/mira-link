import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

await mkdir(".test-runtime", { recursive: true });
await build({
  entryPoints: ["tests/demo-auth-redirect.test.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  alias: { "next/server": "next/server.js" },
  packages: "external",
  outfile: ".test-runtime/demo-auth-redirect.test.mjs",
});
const result = spawnSync(process.execPath, ["--test", ".test-runtime/demo-auth-redirect.test.mjs"], { stdio: "inherit" });
process.exit(result.status ?? 1);
