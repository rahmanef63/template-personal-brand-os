// headless-core — the keystone module every clone (and every template adopting
// this engine) imports from. It collects the cross-cutting primitives that make
// a clone self-manageable by a non-coder: version/update, stage detection, and
// the site-settings contract. Kept inside the repo (not a separate npm package)
// so a "Use this template" clone stays a single self-contained unit.
export * from "./version";
export * from "./settings";
export {
  IS_DEMO,
  CLONE_URL,
  REPO_URL,
} from "@/lib/stage";
