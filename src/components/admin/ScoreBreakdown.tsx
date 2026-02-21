"use client";

import { ComplexityBadge } from "./StatusBadge";
import type { ComplexityLevel } from "@/types/diagnostic";

interface ScoreBreakdownProps {
  scoreBudget: number;
  scorePlatform: number;
  scoreTargetUser: number;
  scoreFeatures: number;
  scoreTimeline: number;
  totalScore: number;
  complexityLevel: ComplexityLevel;
}

const categories = [
  { key: "budget", label: "Budget", max: 5 },
  { key: "platform", label: "Platform", max: 5 },
  { key: "targetUser", label: "Target User", max: 5 },
  { key: "features", label: "Features", max: 5 },
  { key: "timeline", label: "Timeline", max: 5 },
] as const;

function ScoreBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct <= 40 ? "bg-green-400" : pct <= 70 ? "bg-yellow-400" : "bg-orange-400";

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="w-full h-2 bg-navy rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-slate-grey w-8 text-right font-[family-name:var(--font-space-mono)]">
        {value}/{max}
      </span>
    </div>
  );
}

export default function ScoreBreakdown({
  scoreBudget,
  scorePlatform,
  scoreTargetUser,
  scoreFeatures,
  scoreTimeline,
  totalScore,
  complexityLevel,
}: ScoreBreakdownProps) {
  const scores: Record<string, number> = {
    budget: scoreBudget,
    platform: scorePlatform,
    targetUser: scoreTargetUser,
    features: scoreFeatures,
    timeline: scoreTimeline,
  };

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <div key={cat.key} className="flex items-center gap-3">
          <span className="text-sm text-slate-grey w-24 shrink-0">{cat.label}</span>
          <ScoreBar value={scores[cat.key]} max={cat.max} />
        </div>
      ))}
      <div className="border-t border-white/10 pt-3 mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-white">
          Total: {totalScore}/25
        </span>
        <ComplexityBadge level={complexityLevel} />
      </div>
    </div>
  );
}
