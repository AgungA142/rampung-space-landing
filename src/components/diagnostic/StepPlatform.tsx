"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Plus, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData, Platform } from "@/types/diagnostic";

interface StepPlatformProps {
  data: DiagnosticFormData;
  errors: Record<string, string>;
  onChange: (field: keyof DiagnosticFormData, value: string) => void;
}

export default function StepPlatform({ data, errors, onChange }: StepPlatformProps) {
  const { locale } = useLanguage();

  const options: { value: Platform; icon: typeof Globe; label: string; sub: string }[] = [
    {
      value: "web_app",
      icon: Globe,
      label: "Web App",
      sub: locale === "id" ? "Aplikasi berbasis browser" : "Browser-based application",
    },
    {
      value: "mobile_android",
      icon: Smartphone,
      label: "Mobile Android",
      sub: locale === "id" ? "Aplikasi Android native/hybrid" : "Native/hybrid Android app",
    },
  ];

  const otherOption = {
    value: "other" as Platform,
    icon: Plus,
    label: locale === "id" ? "Lainnya" : "Other",
    sub: "iOS, Desktop, Cross-platform, dll.",
  };

  const select = (value: Platform) => onChange("platform", value);

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-6">
        <Braco mood="idle" size={70} showParticles={false} />
        <div className="bg-navy rounded-xl px-4 py-2 text-sm text-slate-grey">
          {locale === "id"
            ? "Mau dibangun untuk platform apa?"
            : "What platform should we build for?"}
        </div>
      </div>

      {errors.platform && (
        <p className="text-sm text-red-400 mb-3">{errors.platform}</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const selected = data.platform === opt.value;
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
              <p className="text-slate-grey text-xs mt-1">{opt.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Other option - full width */}
      <button
        type="button"
        onClick={() => select(otherOption.value)}
        className={`relative w-full text-left p-4 rounded-xl border-2 transition-all duration-200 mt-3 cursor-pointer ${
          data.platform === "other"
            ? "border-pistachio bg-pistachio/10 shadow-[0_0_15px_rgba(168,230,110,0.15)]"
            : "border-white/10 bg-navy hover:border-pistachio/50 hover:bg-pistachio/5"
        }`}
      >
        {data.platform === "other" && (
          <Check size={16} className="absolute top-3 right-3 text-pistachio" />
        )}
        <div className="flex items-center gap-3">
          <Plus size={24} className="text-pistachio" />
          <div>
            <p className="text-white font-semibold text-sm">{otherOption.label}</p>
            <p className="text-slate-grey text-xs">{otherOption.sub}</p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {data.platform === "other" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3"
          >
            <Input
              placeholder={
                locale === "id"
                  ? "Tulis platform yang diinginkan..."
                  : "Specify your platform..."
              }
              value={data.platform_other || ""}
              onChange={(e) => onChange("platform_other", e.target.value)}
              error={errors.platform_other}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
