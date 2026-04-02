"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData } from "@/types/diagnostic";
import { Button } from "@/components/ui/Button";

interface StepFeaturesProps {
  data: DiagnosticFormData;
  errors: Record<string, string>;
  onChange: (field: keyof DiagnosticFormData, value: string[]) => void;
}

const suggestions = [
  "dashboard",
  "android",
];

export default function StepFeatures({ data, errors, onChange }: StepFeaturesProps) {
  const { locale } = useLanguage();
  const [draft, setDraft] = useState("");
  const features = data.features || [];

  const addFeature = (rawValue: string) => {
    const value = rawValue.trim().replace(/\s+/g, " ");
    if (!value) return;

    const exists = features.some((feature) => feature.toLowerCase() === value.toLowerCase());
    if (exists) {
      setDraft("");
      return;
    }

    onChange("features", [...features, value]);
    setDraft("");
  };

  const removeFeature = (featureToRemove: string) => {
    onChange(
      "features",
      features.filter((feature) => feature !== featureToRemove)
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addFeature(draft);
    }
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
          ? "Ketik fitur yang dibutuhkan, lalu tekan Enter atau tombol tambah."
          : "Type the features you need, then press Enter or the add button."}
      </p>

      {errors.features && (
        <p className="text-sm text-red-400 mb-3">{errors.features}</p>
      )}

      <div className="rounded-2xl border border-white/10 bg-navy p-3 md:p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={locale === "id" ? "Contoh: web, android" : "Example: web, android"}
            className="h-11 flex-1 rounded-xl border border-white/10 bg-navy-light px-4 text-sm text-white outline-none transition focus:border-pistachio"
          />
          <Button
            type="button"
            variant="primary"
            size="md"
            iconRight={<Plus size={16} />}
            onClick={() => addFeature(draft)}
          >
            {locale === "id" ? "Tambah" : "Add"}
          </Button>
        </div>

        <p className="mt-3 text-xs text-slate-grey">
          {locale === "id"
            ? "Tips: tombol tambah membantu saat keyboard HP tidak nyaman untuk submit dengan Enter."
            : "Tip: the add button helps on mobile keyboards where Enter is less convenient."}
        </p>

        {features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-2 rounded-full border border-pistachio/40 bg-pistachio/10 px-3 py-2 text-sm text-white"
              >
                {feature}
                <button
                  type="button"
                  aria-label={locale === "id" ? `Hapus ${feature}` : `Remove ${feature}`}
                  onClick={() => removeFeature(feature)}
                  className="rounded-full p-0.5 text-pistachio transition hover:bg-white/10"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addFeature(suggestion)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-grey transition hover:border-pistachio/50 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
