import { SCORING } from "@/lib/constants";
import type {
  DiagnosticFormData,
  DiagnosticScore,
  Feature,
  ComplexityLevel,
} from "@/types/diagnostic";

function calculateFeaturesScore(features: Feature[]): number {
  if (features.length === 0) return 1;

  const totalWeight = features.reduce(
    (sum, feature) => {
      const key = feature.trim().toLowerCase().replace(/\s+/g, "_");
      return sum + (SCORING.featureWeights[key as keyof typeof SCORING.featureWeights] ?? 1);
    },
    0
  );

  const tier = SCORING.featureNormalization.find((r) => totalWeight <= r.max);
  return tier?.score ?? 5;
}

export function calculateScore(data: DiagnosticFormData): DiagnosticScore {
  const platform = SCORING.platform[data.platform] ?? 3;
  const targetUser = SCORING.targetUser[data.target_user] ?? 0;
  const features = calculateFeaturesScore(data.features);
  const timeline = SCORING.timeline[data.timeline] ?? 0;

  const scores = [platform, targetUser, features, timeline];
  const totalScore = scores.filter((s) => s > 0).reduce((a, b) => a + b, 0);

  const complexityTier = SCORING.complexity.find((c) => totalScore <= c.max);
  const complexityLevel: ComplexityLevel = complexityTier?.level ?? "Enterprise";

  return {
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
    needsMultiTenant: false,
  };
}
