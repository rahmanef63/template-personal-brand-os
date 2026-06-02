import { AdminPanelOverview } from "@/components/templates/_shared/admin-panel/AdminPanelOverview";
import { ADMIN_PANEL_BASE } from "@/components/templates/personal-brand/shared/nav-config";

export default function Page() {
  return <AdminPanelOverview adminBase={ADMIN_PANEL_BASE} />;
}
