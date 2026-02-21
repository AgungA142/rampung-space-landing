import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") ?? "0");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const sort = searchParams.get("sort") ?? "created_at";
  const order = searchParams.get("order") ?? "desc";
  const status = searchParams.get("status");
  const complexity = searchParams.get("complexity");
  const search = searchParams.get("search");

  let query = adminDb
    .from("diagnostic_submissions")
    .select("*", { count: "exact" });

  if (status) {
    const statuses = status.split(",");
    query = query.in("status", statuses);
  }

  if (complexity) {
    const levels = complexity.split(",");
    query = query.in("complexity_level", levels);
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`
    );
  }

  query = query
    .order(sort, { ascending: order === "asc" })
    .range(page * limit, (page + 1) * limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
