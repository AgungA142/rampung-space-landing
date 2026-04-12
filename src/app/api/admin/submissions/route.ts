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
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const view = searchParams.get("view");
  const page = parseInt(searchParams.get("page") ?? "0");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const sort = searchParams.get("sort") ?? "created_at";
  const order = searchParams.get("order") ?? "desc";
  const status = searchParams.get("status");
  const complexity = searchParams.get("complexity");
  const search = searchParams.get("search");
  const phone = searchParams.get("phone");

  if (view === "dashboard") {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      totalSub,
      newSub,
      contactedSub,
      inProgressSub,
      completedSub,
      totalPort,
      totalTest,
      weekSub,
      recentSub,
    ] = await Promise.all([
      adminDb.from("diagnostic_submissions").select("id", { count: "exact", head: true }),
      adminDb.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      adminDb.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "contacted"),
      adminDb.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
      adminDb.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "completed"),
      adminDb.from("portfolios").select("id", { count: "exact", head: true }),
      adminDb.from("testimonials").select("id", { count: "exact", head: true }),
      adminDb.from("diagnostic_submissions").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      adminDb.from("diagnostic_submissions").select("*").order("created_at", { ascending: false }).limit(5),
    ]);

    return NextResponse.json({
      stats: {
        total_submissions: totalSub.count ?? 0,
        new_submissions: newSub.count ?? 0,
        contacted_submissions: contactedSub.count ?? 0,
        in_progress_submissions: inProgressSub.count ?? 0,
        completed_submissions: completedSub.count ?? 0,
        total_portfolios: totalPort.count ?? 0,
        total_testimonials: totalTest.count ?? 0,
        submissions_this_week: weekSub.count ?? 0,
      },
      recent: recentSub.data ?? [],
    });
  }

  if (view === "users") {
    const { data, error } = await adminDb
      .from("diagnostic_submissions")
      .select("phone, name, company, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const map = new Map<
      string,
      { phone: string; name: string; company: string | null; total_submissions: number; last_submission: string }
    >();

    for (const row of data ?? []) {
      const existing = map.get(row.phone);
      if (existing) {
        existing.total_submissions += 1;
        if (row.created_at > existing.last_submission) {
          existing.last_submission = row.created_at;
          existing.name = row.name;
          existing.company = row.company;
        }
      } else {
        map.set(row.phone, {
          phone: row.phone,
          name: row.name,
          company: row.company ?? null,
          total_submissions: 1,
          last_submission: row.created_at,
        });
      }
    }

    const users = Array.from(map.values()).sort((a, b) =>
      b.last_submission.localeCompare(a.last_submission)
    );

    return NextResponse.json({ data: users });
  }

  let query = adminDb
    .from("diagnostic_submissions")
    .select("*", { count: "exact" });

  if (phone) {
    query = query.eq("phone", phone);
  }

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
      `name.ilike.%${search}%,phone.ilike.%${search}%,company.ilike.%${search}%`
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
