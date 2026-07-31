import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, sessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const adminDb = createAdminClient();
  const { data: admin } = await adminDb
    .from("admin_users")
    .select("id, email, password_hash, full_name, role")
    .eq("email", email)
    .single();

  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
  }

  const token = await createSessionToken({
    id: admin.id,
    email: admin.email,
    full_name: admin.full_name,
    role: admin.role,
  });

  const response = NextResponse.json({
    data: { id: admin.id, email: admin.email, full_name: admin.full_name, role: admin.role },
  });
  response.cookies.set(sessionCookie.name, token, {
    ...sessionCookie.options,
    maxAge: sessionCookie.maxAge,
  });
  return response;
}
