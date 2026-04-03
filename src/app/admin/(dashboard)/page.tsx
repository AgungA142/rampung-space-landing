"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import DashboardCards from "@/components/admin/DashboardCards";
import DashboardRecentActivity from "@/components/admin/DashboardRecentActivity";
import type { DashboardStats } from "@/types/admin";
import type { DiagnosticSubmission } from "@/types/diagnostic";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<DiagnosticSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/admin/submissions?view=dashboard", {
        credentials: "include",
      });
      const result = await res.json();

      if (!res.ok) {
        setStats(null);
        setRecent([]);
        setLoading(false);
        return;
      }

      setStats(result.stats as DashboardStats);
      setRecent((result.recent ?? []) as DiagnosticSubmission[]);
      setLoading(false);
    }

    fetchData();
  }, []);

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
