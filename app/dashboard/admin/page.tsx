import { DashboardView } from "@/features/admin/dashboard/DashboardView";
import { SetupBanner } from "@/components/setup-banner";

export default function Page() {
  return (
    <>
      <SetupBanner />
      <DashboardView />
    </>
  );
}
