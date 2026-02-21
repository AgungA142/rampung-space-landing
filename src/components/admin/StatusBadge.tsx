import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import type { SubmissionStatus, ComplexityLevel } from "@/types/diagnostic";

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; variant: BadgeVariant }> = {
  new: { label: "Baru", variant: "info" },
  contacted: { label: "Dihubungi", variant: "warning" },
  in_progress: { label: "Dalam Proses", variant: "default" },
  completed: { label: "Selesai", variant: "success" },
  archived: { label: "Diarsipkan", variant: "error" },
};

interface StatusBadgeProps {
  status: SubmissionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, variant: "default" as BadgeVariant };
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
}

const COMPLEXITY_CONFIG: Record<ComplexityLevel, { label: string; className: string }> = {
  Low: { label: "Low", className: "bg-green-500/20 text-green-400" },
  Medium: { label: "Medium", className: "bg-yellow-500/20 text-yellow-400" },
  High: { label: "High", className: "bg-orange-500/20 text-orange-400" },
  Enterprise: { label: "Enterprise", className: "bg-red-500/20 text-red-400" },
};

interface ComplexityBadgeProps {
  level: ComplexityLevel;
}

export function ComplexityBadge({ level }: ComplexityBadgeProps) {
  const config = COMPLEXITY_CONFIG[level] ?? { label: level, className: "bg-white/10 text-white" };
  return (
    <span className={`inline-flex items-center font-medium rounded-full px-2 py-0.5 text-xs ${config.className}`}>
      {config.label}
    </span>
  );
}
