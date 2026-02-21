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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  const allowedFields = [
    "title", "slug", "challenge", "solution", "tech_stack", "tags",
    "thumbnail_url", "images", "is_featured", "is_published", "sort_order",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const adminDb = createAdminClient();
  const { data, error } = await adminDb
    .from("portfolios")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const adminDb = createAdminClient();

  // Get portfolio to clean up images
  const { data: portfolio } = await adminDb
    .from("portfolios")
    .select("thumbnail_url, images")
    .eq("id", id)
    .single();

  // Delete from database
  const { error } = await adminDb.from("portfolios").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Clean up storage files (best effort)
  if (portfolio) {
    const urls = [
      ...(portfolio.thumbnail_url ? [portfolio.thumbnail_url] : []),
      ...((portfolio.images as string[]) ?? []),
    ];
    for (const url of urls) {
      try {
        const path = new URL(url).pathname.split("/storage/v1/object/public/media/")[1];
        if (path) {
          await adminDb.storage.from("media").remove([path]);
        }
      } catch {
        // Ignore storage cleanup errors
      }
    }
  }

  return NextResponse.json({ success: true });
}
