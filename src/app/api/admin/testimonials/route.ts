import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const adminDb = createAdminClient();
  const { data: profile } = await adminDb
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  return profile ? user : null;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!body.client_name || !body.quote || !body.rating) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("testimonials")
    .insert({
      client_name: body.client_name,
      client_company: body.client_company ?? null,
      client_position: body.client_position ?? null,
      avatar_url: body.avatar_url ?? null,
      quote: body.quote,
      rating: body.rating,
      is_published: body.is_published ?? false,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
