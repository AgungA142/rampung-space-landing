import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateScore, getFlags } from "@/components/diagnostic/scoringEngine";
import type { DiagnosticFormData } from "@/types/diagnostic";

export async function POST(request: NextRequest) {
  try {
    const body: DiagnosticFormData = await request.json();

    // Validate required fields
    if (!body.name || body.name.length < 2) {
      return NextResponse.json({ error: "Name is required (min 2 chars)" }, { status: 400 });
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!body.platform) {
      return NextResponse.json({ error: "Platform is required" }, { status: 400 });
    }
    if (body.platform === "other" && !body.platform_other) {
      return NextResponse.json({ error: "Please specify your platform" }, { status: 400 });
    }
    if (!body.target_user) {
      return NextResponse.json({ error: "Target user is required" }, { status: 400 });
    }
    if (!body.features || body.features.length === 0) {
      return NextResponse.json({ error: "At least 1 feature is required" }, { status: 400 });
    }
    if (!body.timeline) {
      return NextResponse.json({ error: "Timeline is required" }, { status: 400 });
    }

    // Calculate scores
    const score = calculateScore(body);
    const flags = getFlags(body, score);

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("diagnostic_submissions")
      .insert({
        name: body.name,
        email: body.email,
        company: body.company || null,
        budget_idr: body.budget_idr ? parseInt(body.budget_idr.replace(/\D/g, ""), 10) : null,
        budget_usd: body.budget_usd ? parseInt(body.budget_usd.replace(/\D/g, ""), 10) : null,
        platform: body.platform,
        platform_other: body.platform_other || null,
        target_user: body.target_user,
        features: body.features,
        timeline: body.timeline,
        score_budget: score.budget,
        score_platform: score.platform,
        score_target_user: score.targetUser,
        score_features: score.features,
        score_timeline: score.timeline,
        total_score: score.totalScore,
        complexity_level: score.complexityLevel,
        timeline_warning: flags.timelineWarning,
        needs_multi_tenant: flags.needsMultiTenant,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "Failed to save submission" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
