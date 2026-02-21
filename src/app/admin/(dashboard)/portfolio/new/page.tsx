"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import PortfolioForm from "@/components/admin/PortfolioForm";

export default function NewPortfolioPage() {
  const router = useRouter();

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
      <PortfolioForm />
    </div>
  );
}
