"use client";

import { useCallback } from "react";
import { Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData } from "@/types/diagnostic";

interface StepBudgetProps {
  data: DiagnosticFormData;
  onChange: (field: keyof DiagnosticFormData, value: string) => void;
}

function formatIDR(value: string): string {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return new Intl.NumberFormat("id-ID").format(parseInt(num, 10));
}

function formatUSD(value: string): string {
  const num = value.replace(/\D/g, "");
  if (!num) return "";
  return new Intl.NumberFormat("en-US").format(parseInt(num, 10));
}

export default function StepBudget({ data, onChange }: StepBudgetProps) {
  const { locale } = useLanguage();

  const handleIDR = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      onChange("budget_idr", raw);
    },
    [onChange]
  );

  const handleUSD = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      onChange("budget_usd", raw);
    },
    [onChange]
  );

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-6">
        <Braco mood="idle" size={70} showParticles={false} />
        <div className="bg-navy rounded-xl px-4 py-2 text-sm text-slate-grey">
          {locale === "id"
            ? "Berapa budget yang Anda siapkan?"
            : "What's your budget range?"}
        </div>
      </div>

      <p className="text-sm text-slate-grey mb-4">
        {locale === "id"
          ? "Isi salah satu atau keduanya:"
          : "Fill in one or both:"}
      </p>

      <div className="space-y-4">
        <Input
          label={locale === "id" ? "Budget (Rupiah)" : "Budget (IDR)"}
          prefix={<span className="text-sm font-semibold">Rp</span>}
          placeholder={locale === "id" ? "Contoh: 50000000" : "e.g. 50000000"}
          value={data.budget_idr ? formatIDR(data.budget_idr) : ""}
          onChange={handleIDR}
          inputMode="numeric"
        />
        <Input
          label={locale === "id" ? "Budget (Dollar)" : "Budget (USD)"}
          prefix={<span className="text-sm font-semibold">$</span>}
          placeholder={locale === "id" ? "Contoh: 3500" : "e.g. 3500"}
          value={data.budget_usd ? formatUSD(data.budget_usd) : ""}
          onChange={handleUSD}
          inputMode="numeric"
        />
      </div>

      <div className="flex items-start gap-2 mt-4 text-xs text-slate-grey italic">
        <Lightbulb size={14} className="text-pistachio flex-shrink-0 mt-0.5" />
        <span>
          {locale === "id"
            ? "Belum tahu budgetnya? Tidak masalah, lewati saja."
            : "Not sure about budget? No problem, just skip."}
        </span>
      </div>
    </div>
  );
}
