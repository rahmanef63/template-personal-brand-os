import { PagesView } from "@/features/_shared/pages/PagesView";
import {
  ADMIN_BASE,
  PUBLIC_BASE,
} from "@/features/_app/nav-config";

export default function Page() {
  return <PagesView publicBase={PUBLIC_BASE} adminBase={ADMIN_BASE} />;
}
