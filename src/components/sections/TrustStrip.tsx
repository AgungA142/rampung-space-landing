"use client";

import { Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Use i18n trustMarkers

export default function TrustStrip() {
  const { t } = useLanguage();

  const items = (
    <div className="flex items-center gap-8 px-4">
      {/* <div className="flex items-center gap-2 whitespace-nowrap">
        <Users size={18} className="text-pistachio" />
        <span className="font-sora font-bold text-white">10+</span>
        <span className="text-slate-grey text-sm">{t.socialProof.clients}</span>
      </div>
      <span className="text-slate-grey/30">|</span>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <CheckCircle size={18} className="text-pistachio" />
        <span className="font-sora font-bold text-white">15+</span>
        <span className="text-slate-grey text-sm">{t.socialProof.projects}</span>
      </div>
      <span className="text-slate-grey/30">|</span> */}
      {/* Use i18n trustMarkers */}
      {Array.isArray(t.trustMarkers?.items)
        ? t.trustMarkers.items.map((marker) => (
            <span
              key={marker}
              className="text-slate-grey/60 text-sm font-space-mono whitespace-nowrap"
            >
              {marker}
            </span>
          ))
        : null}
    </div>
  );

  return (
    <section className="bg-navy-light border-y border-slate-grey/10 py-4 md:py-6 overflow-hidden">
      <div
        className="flex animate-marquee hover:[animation-play-state:paused]"
      >
        {items}
        {items}
      </div>
    </section>
  );
}
