export type Platform = "web_app" | "mobile_android" | "other";
export type TargetUser = "internal" | "b2b" | "b2c" | "marketplace" | "unknown";
export type Timeline = "urgent" | "normal" | "flexible" | "long_term" | "undecided";
export type ComplexityLevel = "Low" | "Medium" | "High" | "Enterprise";
export type SubmissionStatus = "new" | "contacted" | "in_progress" | "completed" | "archived";

export type Feature =
  | "auth"
  | "payment"
  | "realtime"
  | "dashboard"
  | "file_upload"
  | "third_party_api"
  | "admin_panel"
  | "geolocation";

export interface DiagnosticSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company?: string;
  budget_idr?: number;
  budget_usd?: number;
  platform: Platform;
  platform_other?: string;
  target_user: TargetUser;
  features: Feature[];
  timeline: Timeline;
  score_budget: number;
  score_platform: number;
  score_target_user: number;
  score_features: number;
  score_timeline: number;
  total_score: number;
  complexity_level: ComplexityLevel;
  timeline_warning: boolean;
  needs_multi_tenant: boolean;
  status: SubmissionStatus;
  admin_notes?: string;
  contacted_at?: string;
}

export interface DiagnosticFormData {
  name: string;
  email: string;
  company?: string;
  budget_idr?: string;
  budget_usd?: string;
  platform: Platform;
  platform_other?: string;
  target_user: TargetUser;
  features: Feature[];
  timeline: Timeline;
}

export interface DiagnosticScore {
  budget: number;
  platform: number;
  targetUser: number;
  features: number;
  timeline: number;
  totalScore: number;
  complexityLevel: ComplexityLevel;
}
