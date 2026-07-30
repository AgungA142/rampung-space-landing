export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "admin";
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
