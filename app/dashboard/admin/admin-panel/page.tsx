import { AdminPanelOverview } from "@/features/_shared/admin-panel/AdminPanelOverview";
import { ADMIN_PANEL_BASE } from "@/features/_app/nav-config";

export default function Page() {
  return <AdminPanelOverview adminBase={ADMIN_PANEL_BASE} />;
}
