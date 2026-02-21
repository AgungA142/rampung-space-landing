"use client";

import { motion } from "framer-motion";
import { CheckCircle, Eye, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/Card";
import { Braco } from "@/components/braco/Braco";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const values = [
  { icon: CheckCircle, key: "resultOriented" as const },
  { icon: Eye, key: "transparent" as const },
  { icon: Zap, key: "modernStack" as const },
];

/* TODO: Replace with real team data */
const team = [
  { name: "Founder", role: "CEO & Lead Developer", initials: "RS" },
];

export default function AboutSection() {
  const { locale, t } = useLanguage();

  return (
    <motion.section
      id="tentang"
      className="py-20 md:py-28"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left — Content */}
          <div className="flex-1">
            <motion.h2
              variants={itemVariants}
              className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold text-white"
            >
              Space for <span className="text-pistachio">Ideas</span>.
              <br />
              Rampung for <span className="text-pistachio">Results</span>.
            </motion.h2>

            <motion.div variants={itemVariants} className="mt-6 space-y-4 text-slate-grey">
              <p>
                {locale === "id"
                  ? "Kami percaya setiap ide layak diwujudkan. Rampung Space hadir sebagai partner teknis yang mengubah kompleksitas menjadi solusi yang fungsional dan berdampak."
                  : "We believe every idea deserves to be realized. Rampung Space exists as a technical partner that transforms complexity into functional, impactful solutions."}
              </p>
              <p>
                {locale === "id"
                  ? "Dari konsep pertama hingga produk siap rilis, kami mendampingi setiap langkah. Karena bagi kami, proyek baru selesai ketika benar-benar rampung."
                  : "From the first concept to a launch-ready product, we accompany every step. Because for us, a project is only done when it's truly rampung."}
              </p>
            </motion.div>

            {/* Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {values.map(({ icon: Icon, key }) => (
                <motion.div key={key} variants={itemVariants}>
                  <Card variant="outline" padding="md" className="h-full">
                    <Icon size={24} className="text-pistachio" />
                    <h3 className="font-[family-name:var(--font-sora)] text-white font-semibold mt-3">
                      {t.about.values[key].title}
                    </h3>
                    <p className="text-slate-grey text-sm mt-2">
                      {t.about.values[key].description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Team */}
            <motion.div variants={itemVariants} className="mt-10">
              <div className="flex items-center gap-4">
                {team.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-pistachio-deep flex items-center justify-center text-white font-[family-name:var(--font-sora)] font-bold">
                      {member.initials}
                    </div>
                    <div>
                      <p className="text-white font-[family-name:var(--font-sora)] text-sm font-semibold">
                        {member.name}
                      </p>
                      <p className="text-slate-grey text-xs">{member.role}</p>
                    </div>
                  </div>
                ))}
                {/* TODO: Replace with real team data */}
              </div>
            </motion.div>
          </div>

          {/* Right — Braco (desktop only) */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex items-center justify-center flex-shrink-0"
          >
            <Braco mood="idle" size={160} showParticles={false} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
