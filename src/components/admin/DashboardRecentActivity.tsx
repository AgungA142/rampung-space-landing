"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StatusBadge, ComplexityBadge } from "./StatusBadge";
import { timeAgo } from "@/lib/helpers";
import type { DiagnosticSubmission } from "@/types/diagnostic";

interface DashboardRecentActivityProps {
  submissions: DiagnosticSubmission[];
}

export default function DashboardRecentActivity({ submissions }: DashboardRecentActivityProps) {
  const router = useRouter();

  if (submissions.length === 0) {
    return (
      <div className="bg-navy-light rounded-xl border border-white/10 p-8 text-center">
        <p className="text-slate-grey text-sm">Belum ada submissions.</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-light rounded-xl border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm">Recent Submissions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy text-slate-grey text-xs uppercase tracking-wider">
              <th className="px-4 py-2.5 text-left font-medium">Nama</th>
              <th className="px-4 py-2.5 text-left font-medium">Email</th>
              <th className="px-4 py-2.5 text-left font-medium">Platform</th>
              <th className="px-4 py-2.5 text-left font-medium">Complexity</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
              <th className="px-4 py-2.5 text-left font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr
                key={s.id}
                onClick={() => router.push(`/admin/submissions/${s.id}`)}
                className="border-b border-white/5 text-sm text-white cursor-pointer hover:bg-navy/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-slate-grey">{s.email}</td>
                <td className="px-4 py-3 capitalize">{s.platform.replace("_", " ")}</td>
                <td className="px-4 py-3"><ComplexityBadge level={s.complexity_level} /></td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-slate-grey text-xs">{timeAgo(s.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-white/5">
        <Link
          href="/admin/submissions"
          className="text-sm text-pistachio hover:text-pistachio-light flex items-center gap-1 transition-colors"
        >
          Lihat Semua Submissions <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
