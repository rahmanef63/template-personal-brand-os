/**
 * Shared landing-sections admin slice. Generic CRUD that any template
 * mounts by:
 *   1. Adding `landingSections: LandingSection[]` to State + LandingAction
 *   2. Folding `landingReducer` into the root reducer
 *   3. Wrapping StoreProvider with <LandingProvider value={adapter}/>
 *   4. Registering /admin/landing + /admin/landing/[id] routes that
 *      render <LandingView/> + <LandingEditorView id/>
 */
export { LandingProvider, useLandingStore, type LandingStore } from "./landing-context";
export { landingReducer } from "./reducer";
export { defaultLandingSections } from "./seed-factory";
export { LandingView } from "./LandingView";
export { LandingEditorView, blankSection } from "./LandingEditorView";
export { LANDING_FIELDS } from "./landing-fields";
export { LandingSectionShell } from "./LandingSectionShell";
export type { LandingSection, LandingSectionKind, LandingAction, LandingSlice } from "./types";
