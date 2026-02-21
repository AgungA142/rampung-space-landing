"use client";

import { Building2, Handshake, Users, Store, HelpCircle, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData, TargetUser } from "@/types/diagnostic";

interface StepTargetUserProps {
  data: DiagnosticFormData;
  errors: Record<string, string>;
  onChange: (field: keyof DiagnosticFormData, value: string) => void;
}

export default function StepTargetUser({ data, errors, onChange }: StepTargetUserProps) {
  const { locale } = useLanguage();

  const options: { value: TargetUser; icon: typeof Users; label: string; desc: string }[] = [
    {
      value: "internal",
      icon: Building2,
      label: "Internal",
      desc: locale === "id"
        ? "Tim/perusahaan sendiri, < 50 pengguna"
        : "Your own team/company, < 50 users",
    },
    {
      value: "b2b",
      icon: Handshake,
      label: "B2B",
      desc: locale === "id"
        ? "Bisnis ke bisnis, ratusan pengguna"
        : "Business to business, hundreds of users",
    },
    {
      value: "b2c",
      icon: Users,
      label: "B2C",
      desc: locale === "id"
        ? "Konsumen umum, ribuan-jutaan pengguna"
        : "General consumers, thousands-millions of users",
    },
    {
      value: "marketplace",
      icon: Store,
      label: "Marketplace",
      desc: locale === "id"
        ? "Platform multi-sisi (penjual + pembeli)"
        : "Multi-sided platform (sellers + buyers)",
    },
  ];

  const select = (value: TargetUser) => onChange("target_user", value);

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-6">
        <Braco mood="idle" size={70} showParticles={false} />
        <div className="bg-navy rounded-xl px-4 py-2 text-sm text-slate-grey">
          {locale === "id"
            ? "Siapa yang akan menggunakan produknya?"
            : "Who will use the product?"}
        </div>
      </div>

      {errors.target_user && (
        <p className="text-sm text-red-400 mb-3">{errors.target_user}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const selected = data.target_user === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => select(opt.value)}
              className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                selected
                  ? "border-pistachio bg-pistachio/10 shadow-[0_0_15px_rgba(168,230,110,0.15)]"
                  : "border-white/10 bg-navy hover:border-pistachio/50 hover:bg-pistachio/5"
              }`}
            >
              {selected && (
                <Check size={16} className="absolute top-3 right-3 text-pistachio" />
              )}
              <Icon size={24} className="text-pistachio mb-2" />
              <p className="text-white font-semibold text-sm">{opt.label}</p>
              <p className="text-slate-grey text-xs mt-1">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* "Belum tahu" full width */}
      <button
        type="button"
        onClick={() => select("unknown")}
        className={`relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 mt-3 cursor-pointer ${
          data.target_user === "unknown"
            ? "border-pistachio bg-pistachio/10 shadow-[0_0_15px_rgba(168,230,110,0.15)]"
            : "border-white/10 bg-navy hover:border-pistachio/50 hover:bg-pistachio/5"
        }`}
      >
        {data.target_user === "unknown" && (
          <Check size={16} className="absolute top-3 right-3 text-pistachio" />
        )}
        <div className="flex items-center gap-3">
          <HelpCircle size={24} className="text-slate-grey" />
          <div>
            <p className="text-white font-semibold text-sm">
              {locale === "id" ? "Belum tahu" : "Not sure yet"}
            </p>
            <p className="text-slate-grey text-xs">
              {locale === "id" ? "Akan ditentukan nanti" : "To be determined later"}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
