import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";
import type { AdminProfile } from "@/types/admin";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/admin/login");
  }

  const adminProfile: AdminProfile = {
    id: profile.id,
    user_id: profile.user_id ?? profile.id,
    full_name: profile.full_name ?? "Admin",
    avatar_url: profile.avatar_url,
    role: profile.role ?? "admin",
    created_at: profile.created_at,
  };

  return <AdminShell user={adminProfile}>{children}</AdminShell>;
}
