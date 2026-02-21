import { SCORING } from "@/lib/constants";
import type {
  DiagnosticFormData,
  DiagnosticScore,
  Feature,
  ComplexityLevel,
} from "@/types/diagnostic";

function calculateBudgetScore(idr?: string, usd?: string): number {
  const idrNum = idr ? parseInt(idr.replace(/\D/g, ""), 10) : 0;
  const usdNum = usd ? parseInt(usd.replace(/\D/g, ""), 10) : 0;

  let scoreIdr = 0;
  let scoreUsd = 0;

  if (idrNum > 0) {
    const tier = SCORING.budget.idr.find((t) => idrNum <= t.max);
    scoreIdr = tier?.score ?? 5;
  }
  if (usdNum > 0) {
    const tier = SCORING.budget.usd.find((t) => usdNum <= t.max);
    scoreUsd = tier?.score ?? 5;
  }

  return Math.max(scoreIdr, scoreUsd);
}

function calculateFeaturesScore(features: Feature[]): number {
  if (features.length === 0) return 1;

  const totalWeight = features.reduce(
    (sum, f) => sum + (SCORING.featureWeights[f] ?? 0),
    0
  );

  const tier = SCORING.featureNormalization.find((r) => totalWeight <= r.max);
  return tier?.score ?? 5;
}

export function calculateScore(data: DiagnosticFormData): DiagnosticScore {
  const budget = calculateBudgetScore(data.budget_idr, data.budget_usd);
  const platform = SCORING.platform[data.platform] ?? 3;
  const targetUser = SCORING.targetUser[data.target_user] ?? 0;
  const features = calculateFeaturesScore(data.features);
  const timeline = SCORING.timeline[data.timeline] ?? 0;

  const scores = [budget, platform, targetUser, features, timeline];
  const totalScore = scores.filter((s) => s > 0).reduce((a, b) => a + b, 0);

  const complexityTier = SCORING.complexity.find((c) => totalScore <= c.max);
  const complexityLevel: ComplexityLevel = complexityTier?.level ?? "Enterprise";

  return {
    budget,
    platform,
    targetUser,
    features,
    timeline,
    totalScore,
    complexityLevel,
  };
}

export function getFlags(data: DiagnosticFormData, score: DiagnosticScore) {
  return {
    timelineWarning: data.timeline === "urgent" && score.totalScore >= 15,
    needsMultiTenant: data.target_user === "marketplace",
  };
}
