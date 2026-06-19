import { NotionDatabaseHost } from "@/features/_shared/notion/database-host";

export default function Page() {
  return (
    <div className="p-4 md:p-6">
      <NotionDatabaseHost />
    </div>
  );
}
