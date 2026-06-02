import { PagesView } from "@/components/templates/_shared/pages/PagesView";
import {
  ADMIN_BASE,
  PUBLIC_BASE,
} from "@/components/templates/personal-brand/shared/nav-config";

export default function Page() {
  return <PagesView publicBase={PUBLIC_BASE} adminBase={ADMIN_BASE} />;
}
