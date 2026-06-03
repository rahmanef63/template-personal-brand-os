#!/usr/bin/env node
// Clone smoke-test — verifies a fresh clone has everything a non-coder needs to
// deploy successfully. Runs LOCALLY (or in a pre-push hook) — no GitHub Actions
// cloud minutes. Exit non-zero on any failure.
//
//   node scripts/smoke-test.mjs            # full (invariants + tsc + build)
//   node scripts/smoke-test.mjs --no-build # skip next build (fast)
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const noBuild = process.argv.includes("--no-build");
let failed = 0;
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => { console.log(`  \x1b[31m✗ ${m}\x1b[0m`); failed++; };

console.log("\n● Required files");
const required = [
  "version.json",
  "vercel.json",
  "package.json",
  ".env.example",
  "convex/schema.ts",
  "convex/auth.ts",
  "convex/setup.ts",
  "scripts/setup-auth.mjs",
  "lib/headless-core/version.ts",
  "app/setup/page.tsx",
];
for (const f of required) (existsSync(f) ? ok(f) : bad(`missing ${f}`));

console.log("\n● Manifest + scripts");
try {
  const v = JSON.parse(readFileSync("version.json", "utf8"));
  v.version && v.core ? ok(`version.json (v${v.version})`) : bad("version.json missing version/core");
} catch { bad("version.json invalid JSON"); }
try {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  pkg.scripts?.["build:auto"] ? ok("package.json build:auto present") : bad("package.json missing build:auto");
} catch { bad("package.json invalid"); }
try {
  const vc = JSON.parse(readFileSync("vercel.json", "utf8"));
  /build:auto/.test(vc.buildCommand ?? "") ? ok("vercel.json buildCommand -> build:auto") : bad("vercel.json buildCommand wrong");
} catch { bad("vercel.json invalid"); }

console.log("\n● Env documentation");
try {
  const env = readFileSync(".env.example", "utf8");
  for (const k of ["NEXT_PUBLIC_CONVEX_URL", "CONVEX_DEPLOY_KEY"])
    (env.includes(k) ? ok(`.env.example documents ${k}`) : bad(`.env.example missing ${k}`));
} catch { bad(".env.example unreadable"); }

function run(label, cmd) {
  process.stdout.write(`\n● ${label}\n`);
  try {
    execSync(cmd, { stdio: "pipe" });
    ok(`${label} passed`);
  } catch (e) {
    bad(`${label} failed`);
    const out = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    console.log(out.split("\n").slice(-25).join("\n"));
  }
}

run("Typecheck", "npx tsc --noEmit");
if (!noBuild) run("Build", "npm run build");

console.log(`\n${failed === 0 ? "\x1b[32mSMOKE PASS\x1b[0m" : `\x1b[31mSMOKE FAIL — ${failed} issue(s)\x1b[0m`}\n`);
process.exit(failed === 0 ? 0 : 1);
