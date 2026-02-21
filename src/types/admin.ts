export interface AdminProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  role: "super_admin" | "admin";
  created_at: string;
}

export interface DashboardStats {
  total_submissions: number;
  new_submissions: number;
  contacted_submissions: number;
  in_progress_submissions: number;
  completed_submissions: number;
  total_portfolios: number;
  total_testimonials: number;
  submissions_this_week: number;
}
