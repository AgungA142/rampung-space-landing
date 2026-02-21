"use client";

import { Clock, Calendar, CalendarDays, CalendarRange, HelpCircle, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Badge } from "@/components/ui/Badge";
import { Braco } from "@/components/braco/Braco";
import type { DiagnosticFormData, Timeline } from "@/types/diagnostic";

interface StepTimelineProps {
  data: DiagnosticFormData;
  errors: Record<string, string>;
  onChange: (field: keyof DiagnosticFormData, value: string) => void;
}

const timelineOptions: {
  value: Timeline;
  icon: typeof Clock;
  labelId: string;
  labelEn: string;
  badge: string;
}[] = [
  { value: "urgent", icon: Clock, labelId: "Kurang dari 1 bulan", labelEn: "Less than 1 month", badge: "Urgent" },
  { value: "normal", icon: Calendar, labelId: "1 - 3 bulan", labelEn: "1 - 3 months", badge: "Normal" },
  { value: "flexible", icon: CalendarDays, labelId: "3 - 6 bulan", labelEn: "3 - 6 months", badge: "Flexible" },
  { value: "long_term", icon: CalendarRange, labelId: "Lebih dari 6 bulan", labelEn: "More than 6 months", badge: "Long-term" },
  { value: "undecided", icon: HelpCircle, labelId: "Belum ditentukan", labelEn: "Not decided yet", badge: "" },
];

export default function StepTimeline({ data, errors, onChange }: StepTimelineProps) {
  const { locale } = useLanguage();

  return (
    <div>
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 mb-6">
        <Braco mood="idle" size={70} showParticles={false} />
        <div className="bg-navy rounded-xl px-4 py-2 text-sm text-slate-grey">
          {locale === "id"
            ? "Kapan targetnya harus selesai?"
            : "When do you need it done?"}
        </div>
      </div>

      {errors.timeline && (
        <p className="text-sm text-red-400 mb-3">{errors.timeline}</p>
      )}

      <div className="space-y-3">
        {timelineOptions.map((opt) => {
          const Icon = opt.icon;
          const selected = data.timeline === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange("timeline", opt.value)}
              className={`relative w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                selected
                  ? "border-pistachio bg-pistachio/10 shadow-[0_0_15px_rgba(168,230,110,0.15)]"
                  : "border-white/10 bg-navy hover:border-pistachio/50 hover:bg-pistachio/5"
              }`}
            >
              {selected && (
                <Check size={16} className="absolute top-3 right-3 text-pistachio" />
              )}
              <Icon size={20} className={opt.value === "undecided" ? "text-slate-grey" : "text-pistachio"} />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  {locale === "id" ? opt.labelId : opt.labelEn}
                </p>
              </div>
              {opt.badge && (
                <Badge
                  variant={opt.value === "urgent" ? "warning" : "default"}
                  size="sm"
                >
                  {opt.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
