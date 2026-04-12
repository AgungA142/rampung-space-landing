"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData } from "@/types/diagnostic";

interface StepContactProps {
  data: DiagnosticFormData;
  errors: Record<string, string>;
  onChange: (field: keyof DiagnosticFormData, value: string) => void;
}

export default function StepContact({ data, errors, onChange }: StepContactProps) {
  const { locale } = useLanguage();

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-6">
        <Braco mood="wave" size={70} showParticles={false} />
        <div className="bg-navy rounded-xl px-4 py-2 text-sm text-slate-grey">
          {locale === "id"
            ? "Halo! Mari kenalan dulu."
            : "Hi! Let's get to know each other."}
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label={locale === "id" ? "Nama Lengkap *" : "Full Name *"}
          placeholder={locale === "id" ? "Masukkan nama Anda" : "Enter your name"}
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label={locale === "id" ? "WhatsApp *" : "WhatsApp *"}
          type="tel"
          placeholder="6281234567890"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={15}
          value={data.phone}
          onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, ""))}
          error={errors.phone}
          helper={locale === "id" ? "Masukkan nomor telepon dengan angka saja" : "Enter phone number using digits only"}
        />
        <Input
          label={locale === "id" ? "Nama Perusahaan / Proyek" : "Company / Project Name"}
          placeholder={locale === "id" ? "Opsional" : "Optional"}
          value={data.company || ""}
          onChange={(e) => onChange("company", e.target.value)}
        />
      </div>
    </div>
  );
}
