"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Skeleton } from "@/components/ui/Skeleton";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { timeAgo } from "@/lib/helpers";

interface UserRow extends Record<string, unknown> {
  email: string;
  name: string;
  company: string | null;
  total_submissions: number;
  last_submission: string;
}

const columns: Column<UserRow>[] = [
  {
    key: "name",
    label: "Nama",
    render: (row) => <span className="font-medium text-white">{row.name}</span>,
  },
  {
    key: "email",
    label: "Email",
    render: (row) => <EmailCell email={row.email} />,
  },
  {
    key: "company",
    label: "Perusahaan",
    render: (row) => <span className="text-slate-grey">{row.company ?? "-"}</span>,
  },
  {
    key: "total_submissions",
    label: "Total Submissions",
    render: (row) => (
      <span>
        {row.total_submissions}
        {row.total_submissions > 1 && (
          <Badge variant="info" size="sm" className="ml-1.5">{row.total_submissions}x</Badge>
        )}
      </span>
    ),
  },
  {
    key: "last_submission",
    label: "Last Submission",
    render: (row) => (
      <span className="text-xs text-slate-grey">{timeAgo(row.last_submission)}</span>
    ),
  },
];

function EmailCell({ email }: { email: string }) {
  const { toast } = useToast();
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    toast("info", "Email disalin");
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-grey font-[family-name:var(--font-space-mono)] text-xs">{email}</span>
      <button type="button" onClick={copy} className="text-slate-grey hover:text-pistachio transition-colors">
        <Copy size={12} />
      </button>
    </div>
  );
}

export default function UsersPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase
        .from("diagnostic_submissions")
        .select("email, name, company, created_at")
        .order("created_at", { ascending: false });

      if (!data) {
        setLoading(false);
        return;
      }

      // Aggregate by email
      const map = new Map<string, UserRow>();
      for (const row of data) {
        const existing = map.get(row.email);
        if (existing) {
          existing.total_submissions += 1;
          if (row.created_at > existing.last_submission) {
            existing.last_submission = row.created_at;
            existing.name = row.name;
            existing.company = row.company;
          }
        } else {
          map.set(row.email, {
            email: row.email,
            name: row.name,
            company: row.company ?? null,
            total_submissions: 1,
            last_submission: row.created_at,
          });
        }
      }

      setUsers(Array.from(map.values()).sort((a, b) =>
        b.last_submission.localeCompare(a.last_submission)
      ));
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={users}
        isLoading={loading}
        searchable
        searchPlaceholder="Cari nama atau email..."
        searchKeys={["name", "email"]}
        pageSize={20}
        onRowClick={(row) => router.push(`/admin/users/${encodeURIComponent(row.email)}`)}
        emptyMessage="Belum ada users."
      />
    </div>
  );
}
