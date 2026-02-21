"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, ExternalLink, Download } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { StatusBadge, ComplexityBadge } from "@/components/admin/StatusBadge";
import { timeAgo } from "@/lib/helpers";
import { exportToCsv } from "@/lib/exportCsv";
import type { DiagnosticSubmission } from "@/types/diagnostic";

export default function UserDetailPage() {
  const params = useParams<{ email: string }>();
  const email = decodeURIComponent(params.email);
  const router = useRouter();
  const supabase = useSupabase();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<DiagnosticSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("diagnostic_submissions")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });
      const subs = (data ?? []) as DiagnosticSubmission[];
      setSubmissions(subs);
      // Use admin_notes from the most recent submission
      if (subs.length > 0 && subs[0].admin_notes) {
        setNotes(subs[0].admin_notes);
      }
      setLoading(false);
    }
    if (email) fetch();
  }, [email, supabase]);

  const handleSaveNotes = useCallback(async () => {
    if (submissions.length === 0) return;
    setSavingNotes(true);
    try {
      const res = await window.fetch(`/api/admin/submissions/${submissions[0].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notes }),
      });
      if (!res.ok) throw new Error("Failed");
      toast("success", "Notes tersimpan");
    } catch {
      toast("error", "Gagal menyimpan notes");
    } finally {
      setSavingNotes(false);
    }
  }, [notes, submissions, toast]);

  const handleExport = () => {
    if (submissions.length === 0) return;
    const exportData = submissions.map((s) => ({
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
    exportToCsv(exportData, `user-${email}`);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast("info", "Email disalin");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="h-96 w-full" />
      </div>
    );
  }

  const user = submissions[0];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        icon={<ArrowLeft size={16} />}
        onClick={() => router.push("/admin/users")}
      >
        Kembali ke Users
      </Button>

      {/* User Info */}
      <div className="bg-navy-light rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-semibold mb-4">User Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-grey">Nama</span>
            <span className="text-white font-medium">{user?.name ?? "-"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-grey">Email</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-[family-name:var(--font-space-mono)] text-xs">{email}</span>
              <button type="button" onClick={copyEmail} className="text-slate-grey hover:text-pistachio">
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-grey">Company</span>
            <span className="text-white">{user?.company ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-grey">Total Submissions</span>
            <span className="text-white font-bold">{submissions.length}</span>
          </div>
        </div>
      </div>

      {/* Submissions History */}
      <div className="bg-navy-light rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-semibold mb-4">Histori Submissions</h3>
        <div className="space-y-4">
          {submissions.map((s, i) => (
            <div key={s.id} className="border border-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-grey">
                  Submission #{i + 1} — {new Date(s.created_at).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
                <StatusBadge status={s.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-grey">Platform:</span>
                  <span className="text-white capitalize">{s.platform.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-grey">Target:</span>
                  <span className="text-white capitalize">{s.target_user}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-grey">Complexity:</span>
                  <ComplexityBadge level={s.complexity_level} />
                  <span className="text-slate-grey text-xs">({s.total_score})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-grey">Timeline:</span>
                  <span className="text-white capitalize">{s.timeline.replace("_", " ")}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/admin/submissions/${s.id}`)}
                className="mt-3 text-xs text-pistachio hover:text-pistachio-light flex items-center gap-1 transition-colors"
              >
                Lihat Detail <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Notes */}
      <div className="bg-navy-light rounded-xl border border-white/10 p-5">
        <h3 className="text-white font-semibold mb-4">Admin Notes</h3>
        <Textarea
          rows={4}
          placeholder="Catatan tentang user ini..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSaveNotes}
          loading={savingNotes}
          className="mt-3"
        >
          Simpan Notes
        </Button>
      </div>

      {/* Export */}
      <Button
        variant="secondary"
        size="sm"
        icon={<Download size={16} />}
        onClick={handleExport}
      >
        Export Data User
      </Button>
    </div>
  );
}
