// Single source of version truth for the template + its headless core.
//
// `version.json` (repo root) is the machine-readable manifest the in-app update
// channel reads on BOTH sides: the running clone imports CORE_VERSION here, and
// the upstream check fetches the raw version.json from GitHub to compare.
//
// Bump rule: edit version.json, keep this import in sync (it imports the JSON so
// there's only one number to change).
import manifest from "@/version.json";

export const CORE_VERSION: string = manifest.core;
export const TEMPLATE_VERSION: string = manifest.version;
export const RELEASE_CHANNEL: string = manifest.channel;

// Upstream template repo — the canonical source a clone updates from.
export const UPSTREAM_OWNER = "rahmanef63";
export const UPSTREAM_REPO = "template-personal-brand-os";
export const UPSTREAM_REPO_URL = `https://github.com/${UPSTREAM_OWNER}/${UPSTREAM_REPO}`;
// Raw manifest on the default branch — what `checkUpdate` fetches to learn the latest version.
export const UPSTREAM_VERSION_URL = `https://raw.githubusercontent.com/${UPSTREAM_OWNER}/${UPSTREAM_REPO}/main/version.json`;

/** semver-ish compare: returns >0 if a>b, <0 if a<b, 0 if equal. Tolerates "1.2.3". */
export function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}
