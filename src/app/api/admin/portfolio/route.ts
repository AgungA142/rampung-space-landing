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
    .from("portfolios")
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

  const { title, slug, challenge, solution, tech_stack, tags } = body;
  if (!title || !slug || !challenge || !solution || !tech_stack?.length || !tags?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("portfolios")
    .insert({
      title: body.title,
      slug: body.slug,
      challenge: body.challenge,
      solution: body.solution,
      tech_stack: body.tech_stack,
      tags: body.tags,
      thumbnail_url: body.thumbnail_url ?? null,
      images: body.images ?? [],
      is_featured: body.is_featured ?? false,
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
