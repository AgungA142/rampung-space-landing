"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, AlertTriangle, Building2 } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import DataTable, { type Column, type FilterConfig } from "@/components/admin/DataTable";
import { StatusBadge, ComplexityBadge } from "@/components/admin/StatusBadge";
import { timeAgo } from "@/lib/helpers";
import { exportToCsv } from "@/lib/exportCsv";
import type { DiagnosticSubmission } from "@/types/diagnostic";

const columns: Column<DiagnosticSubmission & Record<string, unknown>>[] = [
  {
    key: "name",
    label: "Nama",
    width: "150px",
    render: (row) => (
      <div>
        <p className="font-medium text-white">{row.name}</p>
        {row.company && <p className="text-xs text-slate-grey">{row.company}</p>}
      </div>
    ),
  },
  {
    key: "email",
    label: "Email",
    width: "180px",
    render: (row) => <span className="text-slate-grey">{row.email}</span>,
  },
  {
    key: "platform",
    label: "Platform",
    width: "100px",
    render: (row) => (
      <span className="capitalize text-sm">{row.platform.replace("_", " ")}</span>
    ),
  },
  {
    key: "target_user",
    label: "Target",
    width: "100px",
    render: (row) => <span className="capitalize text-sm">{row.target_user}</span>,
  },
  {
    key: "complexity_level",
    label: "Complexity",
    width: "100px",
    render: (row) => <ComplexityBadge level={row.complexity_level} />,
  },
  {
    key: "total_score",
    label: "Score",
    width: "60px",
    render: (row) => (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-navy text-xs font-bold text-pistachio">
        {row.total_score}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    width: "120px",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "created_at",
    label: "Tanggal",
    width: "100px",
    render: (row) => (
      <span className="text-xs text-slate-grey" title={new Date(row.created_at).toLocaleString()}>
        {timeAgo(row.created_at)}
      </span>
    ),
  },
  {
    key: "flags",
    label: "Flags",
    width: "60px",
    sortable: false,
    render: (row) => (
      <div className="flex items-center gap-1">
        {row.timeline_warning && <span title="Timeline Warning"><AlertTriangle size={14} className="text-yellow-400" /></span>}
        {row.needs_multi_tenant && <span title="Multi-tenant"><Building2 size={14} className="text-blue-400" /></span>}
      </div>
    ),
  },
];

const filters: FilterConfig[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "new", label: "Baru" },
      { value: "contacted", label: "Dihubungi" },
      { value: "in_progress", label: "Proses" },
      { value: "completed", label: "Selesai" },
      { value: "archived", label: "Arsip" },
    ],
  },
  {
    key: "complexity_level",
    label: "Complexity",
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "High", label: "High" },
      { value: "Enterprise", label: "Enterprise" },
    ],
  },
];

export default function SubmissionsPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [data, setData] = useState<DiagnosticSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: submissions } = await supabase
        .from("diagnostic_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      setData((submissions ?? []) as DiagnosticSubmission[]);
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  const handleExport = useCallback(() => {
    if (data.length === 0) return;
    const exportData = data.map((s) => ({
      name: s.name,
      email: s.email,
      company: s.company ?? "",
      platform: s.platform,
      target_user: s.target_user,
      features: s.features.join(", "),
      timeline: s.timeline,
      total_score: s.total_score,
      complexity_level: s.complexity_level,
      status: s.status,
      created_at: s.created_at,
    }));
    exportToCsv(exportData, "submissions");
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data as (DiagnosticSubmission & Record<string, unknown>)[]}
        isLoading={loading}
        searchable
        searchPlaceholder="Cari nama, email, atau perusahaan..."
        searchKeys={["name", "email", "company"]}
        filters={filters}
        defaultSort={{ column: "created_at", direction: "desc" }}
        pageSize={20}
        onRowClick={(row) => router.push(`/admin/submissions/${row.id}`)}
        emptyMessage="Belum ada submissions. Submissions akan muncul saat ada yang mengisi form Logical-Logic di landing page."
        toolbar={
          <Button
            variant="ghost"
            size="sm"
            icon={<Download size={16} />}
            onClick={handleExport}
            className="ml-auto"
          >
            Export CSV
          </Button>
        }
      />
    </div>
  );
}
