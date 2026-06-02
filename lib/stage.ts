// Stage detection for the template.
//
//   Stage 1 — DEMO:       the live showcase on our Vercel. NEXT_PUBLIC_DEMO=1 is
//                         set ONLY on that project, so demo-only UI (the "Deploy
//                         your own" button) renders here and nowhere else.
//   Stage 2 — ONBOARDING: a fresh clone. The flag is absent (the cloner never sets
//                         it), so demo UI disappears; the setup wizard takes over.
//
// Why an env flag, not a .gitignore'd file: a deployed build comes from git, so a
// gitignored file wouldn't exist on the demo either. The flag is the robust switch.
export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

// Vercel "Deploy / clone" URL — prompts for the two infra env vars + links the guide.
const REPO = "https://github.com/rahmanef63/template-personal-brand-os";
export const CLONE_URL =
  process.env.NEXT_PUBLIC_CLONE_URL ||
  `https://vercel.com/new/clone?repository-url=${REPO}` +
    `&env=NEXT_PUBLIC_CONVEX_URL,CONVEX_DEPLOY_KEY` +
    `&envDescription=${encodeURIComponent("Convex deployment URL + production deploy key (lihat panduan)")}` +
    `&envLink=${encodeURIComponent(`${REPO}/blob/main/docs/USER-GUIDE.md`)}` +
    `&project-name=my-brand-site&repository-name=my-brand-site`;

export const REPO_URL = REPO;
