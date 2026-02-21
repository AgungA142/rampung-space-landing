"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import DashboardCards from "@/components/admin/DashboardCards";
import DashboardRecentActivity from "@/components/admin/DashboardRecentActivity";
import type { DashboardStats } from "@/types/admin";
import type { DiagnosticSubmission } from "@/types/diagnostic";

export default function AdminDashboardPage() {
  const supabase = useSupabase();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<DiagnosticSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [
        totalSub,
        newSub,
        contactedSub,
        inProgressSub,
        completedSub,
        totalPort,
        totalTest,
        weekSub,
        recentSub,
      ] = await Promise.all([
        supabase.from("diagnostic_submissions").select("id", { count: "exact", head: true }),
        supabase.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "contacted"),
        supabase.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "in_progress"),
        supabase.from("diagnostic_submissions").select("id", { count: "exact", head: true }).eq("status", "completed"),
        supabase.from("portfolios").select("id", { count: "exact", head: true }),
        supabase.from("testimonials").select("id", { count: "exact", head: true }),
        supabase.from("diagnostic_submissions").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
        supabase.from("diagnostic_submissions").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        total_submissions: totalSub.count ?? 0,
        new_submissions: newSub.count ?? 0,
        contacted_submissions: contactedSub.count ?? 0,
        in_progress_submissions: inProgressSub.count ?? 0,
        completed_submissions: completedSub.count ?? 0,
        total_portfolios: totalPort.count ?? 0,
        total_testimonials: totalTest.count ?? 0,
        submissions_this_week: weekSub.count ?? 0,
      });
      setRecent((recentSub.data ?? []) as DiagnosticSubmission[]);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton variant="card" count={4} className="h-28" />
        </div>
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && <DashboardCards stats={stats} />}

      {stats && stats.submissions_this_week > 0 && (
        <Badge variant="primary" size="md">
          Submissions Minggu Ini: {stats.submissions_this_week}
        </Badge>
      )}

      <DashboardRecentActivity submissions={recent} />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/portfolio/new">
          <Button variant="secondary" size="sm" icon={<Plus size={16} />}>
            Tambah Portfolio
          </Button>
        </Link>
        <Link href="/admin/testimonials/new">
          <Button variant="secondary" size="sm" icon={<Plus size={16} />}>
            Tambah Testimonial
          </Button>
        </Link>
      </div>
    </div>
  );
}
