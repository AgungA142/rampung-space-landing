import type { NextRequest } from "next/server";
import { sessionCookie, verifySessionToken, type AdminSessionPayload } from "./session";
import { createAdminClient } from "@/lib/supabase/admin";

export async function resolveAdminSession(
  session: AdminSessionPayload | null
): Promise<AdminSessionPayload | null> {
  if (!session) return null;

  const adminDb = createAdminClient();
  const { data: admin } = await adminDb
    .from("admin_users")
    .select("id, email, full_name, role")
    .eq("id", session.id)
    .single();

  if (!admin) return null;

  return {
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role,
  };
}

export async function requireAdmin(request: NextRequest): Promise<AdminSessionPayload | null> {
  const token = request.cookies.get(sessionCookie.name)?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return resolveAdminSession(session);
}
