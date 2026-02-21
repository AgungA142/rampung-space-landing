"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import SubmissionDetail from "@/components/admin/SubmissionDetail";
import type { DiagnosticSubmission } from "@/types/diagnostic";

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = useSupabase();
  const [submission, setSubmission] = useState<DiagnosticSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmission() {
      const { data } = await supabase
        .from("diagnostic_submissions")
        .select("*")
        .eq("id", id)
        .single();
      setSubmission(data as DiagnosticSubmission | null);
      setLoading(false);
    }
    if (id) fetchSubmission();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Skeleton variant="rectangular" className="h-64 lg:col-span-3" />
          <Skeleton variant="rectangular" className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-grey">Submission tidak ditemukan.</p>
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/submissions")} className="mt-4">
          Kembali ke Submissions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        icon={<ArrowLeft size={16} />}
        onClick={() => router.push("/admin/submissions")}
      >
        Kembali ke Submissions
      </Button>
      <SubmissionDetail submission={submission} />
    </div>
  );
}
