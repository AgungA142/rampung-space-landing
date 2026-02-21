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
          label="Email *"
          type="email"
          placeholder="nama@email.com"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          error={errors.email}
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
