"use client";

import { Lock, CreditCard, Zap, BarChart3, Upload, Plug, Settings, MapPin, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData, Feature } from "@/types/diagnostic";

interface StepFeaturesProps {
  data: DiagnosticFormData;
  errors: Record<string, string>;
  onChange: (field: keyof DiagnosticFormData, value: Feature[]) => void;
}

const featureOptions: { value: Feature; icon: typeof Lock; labelId: string; labelEn: string }[] = [
  { value: "auth", icon: Lock, labelId: "Autentikasi (Login/Register)", labelEn: "Authentication (Login/Register)" },
  { value: "payment", icon: CreditCard, labelId: "Integrasi Pembayaran", labelEn: "Payment Integration" },
  { value: "realtime", icon: Zap, labelId: "Fitur Real-time (Chat, Notifikasi)", labelEn: "Real-time Features (Chat, Notifications)" },
  { value: "dashboard", icon: BarChart3, labelId: "Dashboard & Analitik", labelEn: "Dashboard & Analytics" },
  { value: "file_upload", icon: Upload, labelId: "Upload & Manajemen File", labelEn: "File Upload & Management" },
  { value: "third_party_api", icon: Plug, labelId: "Integrasi API Pihak Ketiga", labelEn: "Third-party API Integration" },
  { value: "admin_panel", icon: Settings, labelId: "Admin Panel / CMS", labelEn: "Admin Panel / CMS" },
  { value: "geolocation", icon: MapPin, labelId: "Geolokasi / Maps", labelEn: "Geolocation / Maps" },
];

export default function StepFeatures({ data, errors, onChange }: StepFeaturesProps) {
  const { locale } = useLanguage();

  const toggle = (feature: Feature) => {
    const current = data.features || [];
    const next = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    onChange("features", next);
  };

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-4">
        <Braco mood="idle" size={70} showParticles={false} />
        <div className="bg-navy rounded-xl px-4 py-2 text-sm text-slate-grey">
          {locale === "id"
            ? "Fitur apa saja yang dibutuhkan?"
            : "What features do you need?"}
        </div>
      </div>

      <p className="text-sm text-slate-grey mb-3">
        {locale === "id"
          ? "Pilih semua fitur yang relevan dengan proyek Anda:"
          : "Select all features relevant to your project:"}
      </p>

      {errors.features && (
        <p className="text-sm text-red-400 mb-3">{errors.features}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {featureOptions.map((opt) => {
          const Icon = opt.icon;
          const selected = (data.features || []).includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`relative text-left p-3 md:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                selected
                  ? "border-pistachio bg-pistachio/10 shadow-[0_0_15px_rgba(168,230,110,0.15)]"
                  : "border-white/10 bg-navy hover:border-pistachio/50 hover:bg-pistachio/5"
              }`}
            >
              {selected && (
                <Check size={16} className="absolute top-2 right-2 text-pistachio" />
              )}
              <Icon size={20} className="text-pistachio mb-1.5" />
              <p className="text-white font-medium text-xs md:text-sm leading-tight">
                {locale === "id" ? opt.labelId : opt.labelEn}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
