import { redirect } from "next/navigation";
// Admin login lives in the dashboard gate; /login is a friendly alias.
export default function Page() {
  redirect("/dashboard/admin");
}
