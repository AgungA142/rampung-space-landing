import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { sessionCookie, verifySessionToken } from "@/lib/auth/session";
import { resolveAdminSession } from "@/lib/auth/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";
import type { AdminProfile } from "@/types/admin";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie.name)?.value;
  const rawSession = token ? await verifySessionToken(token) : null;
  const session = await resolveAdminSession(rawSession);

  if (!session) {
    redirect("/admin/login");
  }

  const adminProfile: AdminProfile = {
    id: session.id,
    email: session.email,
    full_name: session.full_name,
    role: session.role,
  };

  return <AdminShell user={adminProfile}>{children}</AdminShell>;
}
