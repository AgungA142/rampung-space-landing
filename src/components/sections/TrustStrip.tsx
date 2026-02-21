"use client";

import { Users, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const techStack = [
  "React", "Next.js", "Node.js", "Python", "TypeScript", "PostgreSQL", "AWS", "Tailwind CSS",
];

export default function TrustStrip() {
  const { t } = useLanguage();

  const items = (
    <div className="flex items-center gap-8 px-4">
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Users size={18} className="text-pistachio" />
        <span className="font-[family-name:var(--font-sora)] font-bold text-white">10+</span>
        <span className="text-slate-grey text-sm">{t.socialProof.clients}</span>
      </div>
      <span className="text-slate-grey/30">|</span>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <CheckCircle size={18} className="text-pistachio" />
        <span className="font-[family-name:var(--font-sora)] font-bold text-white">15+</span>
        <span className="text-slate-grey text-sm">{t.socialProof.projects}</span>
      </div>
      <span className="text-slate-grey/30">|</span>
      {/* TODO: Replace with real data */}
      {techStack.map((tech) => (
        <span
          key={tech}
          className="text-slate-grey/60 text-sm font-[family-name:var(--font-space-mono)] whitespace-nowrap"
        >
          {tech}
        </span>
      ))}
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
