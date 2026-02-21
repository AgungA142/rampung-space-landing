"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Copy, Trash2, Check, AlertTriangle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import ScoreBreakdown from "./ScoreBreakdown";
import { StatusBadge, ComplexityBadge } from "./StatusBadge";
import { formatCurrency } from "@/lib/helpers";
import type { DiagnosticSubmission, SubmissionStatus } from "@/types/diagnostic";

interface SubmissionDetailProps {
  submission: DiagnosticSubmission;
}

const statusOptions = [
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "in_progress", label: "Dalam Proses" },
  { value: "completed", label: "Selesai" },
  { value: "archived", label: "Diarsipkan" },
];

const FEATURE_LABELS: Record<string, string> = {
  auth: "Authentication",
  payment: "Payment Gateway",
  realtime: "Realtime / Chat",
  dashboard: "Dashboard / Analytics",
  file_upload: "File Upload",
  third_party_api: "API Integration",
  admin_panel: "Admin Panel",
  geolocation: "Geolocation / Map",
};

export default function SubmissionDetail({ submission }: SubmissionDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [status, setStatus] = useState(submission.status);
  const [notes, setNotes] = useState(submission.admin_notes ?? "");
  const [contactedAt, setContactedAt] = useState(submission.contacted_at);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateSubmission = useCallback(
    async (updates: Record<string, unknown>) => {
      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    [submission.id]
  );

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus as SubmissionStatus);
    try {
      await updateSubmission({ status: newStatus });
      toast("success", "Status berhasil diperbarui");
    } catch {
      toast("error", "Gagal memperbarui status");
      setStatus(submission.status);
    }
  };

  const handleMarkContacted = async () => {
    const now = new Date().toISOString();
    setContactedAt(now);
    setStatus("contacted");
    try {
      await updateSubmission({ contacted_at: now, status: "contacted" });
      toast("success", "Ditandai sudah dihubungi");
    } catch {
      toast("error", "Gagal memperbarui");
      setContactedAt(submission.contacted_at);
      setStatus(submission.status);
    }
  };

  const handleSaveNotes = useCallback(async () => {
    setSavingNotes(true);
    try {
      await updateSubmission({ admin_notes: notes });
      toast("success", "Notes tersimpan");
    } catch {
      toast("error", "Gagal menyimpan notes");
    } finally {
      setSavingNotes(false);
    }
  }, [notes, updateSubmission, toast]);

  // Auto-save notes after 2s debounce
  useEffect(() => {
    if (notes === (submission.admin_notes ?? "")) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSaveNotes();
    }, 2000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [notes, submission.admin_notes, handleSaveNotes]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions/${submission.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast("success", "Submission dihapus");
      router.push("/admin/submissions");
    } catch {
      toast("error", "Gagal menghapus submission");
      setDeleting(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(submission.email);
    toast("info", "Email disalin");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Column - Data */}
      <div className="lg:col-span-3 space-y-6">
        {/* Contact Info */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Contact Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-grey">Nama</span>
              <span className="text-white font-medium">{submission.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-grey">Email</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-[family-name:var(--font-space-mono)] text-xs">
                  {submission.email}
                </span>
                <button type="button" onClick={copyEmail} className="text-slate-grey hover:text-pistachio transition-colors">
                  <Copy size={14} />
                </button>
              </div>
            </div>
            {submission.company && (
              <div className="flex justify-between">
                <span className="text-slate-grey">Company</span>
                <span className="text-white">{submission.company}</span>
              </div>
            )}
          </div>
        </div>

        {/* Wizard Answers */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Wizard Answers</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-grey">Budget</span>
              <span className="text-white">
                {submission.budget_idr ? formatCurrency(submission.budget_idr, "IDR") : "-"}
                {submission.budget_usd ? ` (${formatCurrency(submission.budget_usd, "USD")})` : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-grey">Platform</span>
              <span className="text-white capitalize">
                {submission.platform.replace("_", " ")}
                {submission.platform_other ? ` (${submission.platform_other})` : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-grey">Target User</span>
              <span className="text-white capitalize">{submission.target_user}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-grey">Features</span>
              <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                {submission.features.map((f) => (
                  <Badge key={f} variant="default" size="sm">
                    {FEATURE_LABELS[f] ?? f}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-grey">Timeline</span>
              <span className="text-white capitalize">{submission.timeline.replace("_", " ")}</span>
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Flags</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className={submission.timeline_warning ? "text-yellow-400" : "text-slate-grey/30"} />
              <span className={submission.timeline_warning ? "text-yellow-400" : "text-slate-grey"}>
                Timeline Warning: {submission.timeline_warning ? "Ya" : "Tidak"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={14} className={submission.needs_multi_tenant ? "text-blue-400" : "text-slate-grey/30"} />
              <span className={submission.needs_multi_tenant ? "text-blue-400" : "text-slate-grey"}>
                Multi-tenant: {submission.needs_multi_tenant ? "Ya" : "Tidak"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Scoring & Admin */}
      <div className="lg:col-span-2 space-y-6">
        {/* Score Breakdown */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Score Breakdown</h3>
          <ScoreBreakdown
            scoreBudget={submission.score_budget}
            scorePlatform={submission.score_platform}
            scoreTargetUser={submission.score_target_user}
            scoreFeatures={submission.score_features}
            scoreTimeline={submission.score_timeline}
            totalScore={submission.total_score}
            complexityLevel={submission.complexity_level}
          />
        </div>

        {/* Status */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Status</h3>
          <Select
            options={statusOptions}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
          />

          <div className="mt-4">
            <Button
              variant="secondary"
              size="sm"
              icon={<Check size={16} />}
              onClick={handleMarkContacted}
              disabled={!!contactedAt}
              fullWidth
            >
              {contactedAt ? "Sudah Dihubungi" : "Tandai Sudah Dihubungi"}
            </Button>
            {contactedAt && (
              <p className="text-xs text-slate-grey mt-2">
                Dihubungi pada: {new Date(contactedAt).toLocaleString("id-ID")}
              </p>
            )}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Admin Notes</h3>
          <Textarea
            rows={4}
            placeholder="Catatan internal tim..."
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

        {/* Actions */}
        <div className="bg-navy-light rounded-xl border border-white/10 p-5">
          <h3 className="text-white font-semibold mb-4">Actions</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => setShowDeleteModal(true)}
            className="text-red-400 hover:text-red-300"
          >
            Hapus Submission
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Submission"
        size="sm"
      >
        <p className="text-slate-grey text-sm mb-6">
          Yakin ingin menghapus submission ini? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDelete}
            loading={deleting}
            className="!bg-red-500 !text-white hover:!bg-red-600 !shadow-none"
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
