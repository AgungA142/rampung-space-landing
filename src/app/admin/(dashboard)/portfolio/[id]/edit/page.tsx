"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import PortfolioForm from "@/components/admin/PortfolioForm";
import type { Portfolio } from "@/types/portfolio";

export default function EditPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = useSupabase();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", id)
        .single();
      setPortfolio(data as Portfolio | null);
      setLoading(false);
    }
    if (id) fetch();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="h-96 w-full max-w-3xl" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-grey">Portfolio tidak ditemukan.</p>
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/portfolio")} className="mt-4">
          Kembali ke Portfolio
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
        onClick={() => router.push("/admin/portfolio")}
      >
        Kembali ke Portfolio
      </Button>
      <PortfolioForm portfolio={portfolio} />
    </div>
  );
}
