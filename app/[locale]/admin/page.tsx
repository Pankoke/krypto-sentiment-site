import { redirect } from "next/navigation";
import { ensureAdminPageSession, canAccessAdminInCurrentEnv } from "lib/admin/auth";
import AdminDashboardClient from "./pageClient";

export default async function AdminDashboard({ params }: { params: { locale: "de" | "en" } }) {
  const hasSession = await ensureAdminPageSession();
  if (!hasSession) {
    redirect(`/${params.locale}/admin/login`);
  }

  return <AdminDashboardClient locale={params.locale} adminAllowed={canAccessAdminInCurrentEnv()} />;
}
