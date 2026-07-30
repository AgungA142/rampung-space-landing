"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { timeAgo } from "@/lib/helpers";

interface UserRow extends Record<string, unknown> {
  phone: string;
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
    key: "phone",
    label: "WhatsApp",
    render: (row) => <PhoneCell phone={row.phone} />,
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

function PhoneCell({ phone }: { phone: string }) {
  const { toast } = useToast();
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    toast("info", "Nomor disalin");
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-grey font-[family-name:var(--font-space-mono)] text-xs">{phone}</span>
      <button type="button" onClick={copy} className="text-slate-grey hover:text-pistachio transition-colors">
        <Copy size={12} />
      </button>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/submissions?view=users", {
        credentials: "include",
      });
      const result = await res.json();
      setUsers((result.data ?? []) as UserRow[]);
      setLoading(false);
    }
    fetchUsers();
  }, []);

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
        searchPlaceholder="Cari nama atau nomor WhatsApp..."
        searchKeys={["name", "phone"]}
        pageSize={20}
        onRowClick={(row) => router.push(`/admin/users/${encodeURIComponent(row.phone)}`)}
        emptyMessage="Belum ada users."
      />
    </div>
  );
}
