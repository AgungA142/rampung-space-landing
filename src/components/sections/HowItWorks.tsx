"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb, Search, Code, Rocket } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const icons = [Lightbulb, Search, Code, Rocket];

export default function HowItWorks() {
  const { locale, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const bracoX = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);

  const steps = [
    {
      title: locale === "id" ? "Space" : "Space",
      subtitle: locale === "id" ? "Ruang Ide" : "Ideas Room",
      desc: locale === "id"
        ? "Ceritakan ide dan masalahmu. Kami dengarkan, kami pahami."
        : "Tell us your ideas and problems. We listen, we understand.",
    },
    {
      title: locale === "id" ? "Diagnosa" : "Diagnose",
      subtitle: locale === "id" ? "Analisis Kebutuhan" : "Requirement Analysis",
      desc: locale === "id"
        ? "Kami analisis kebutuhan teknis, scope proyek, dan timeline yang realistis."
        : "We analyze technical requirements, project scope, and realistic timelines.",
    },
    {
      title: locale === "id" ? "Build" : "Build",
      subtitle: locale === "id" ? "Proses Pengembangan" : "Development Process",
      desc: locale === "id"
        ? "Tim kami mulai membangun. Update mingguan, transparan, tanpa drama."
        : "Our team starts building. Weekly updates, transparent, no drama.",
    },
    {
      title: locale === "id" ? "Rampung" : "Rampung",
      subtitle: locale === "id" ? "Selesai & Siap Rilis" : "Done & Ready to Launch",
      desc: locale === "id"
        ? "Produk selesai, teruji, dan siap rilis. Beres! Tuntas!"
        : "Product done, tested, and ready to launch. Complete! Done!",
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      id="cara-kerja"
      className="py-20 md:py-28 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.h2
          variants={itemVariants}
          className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold text-white text-center mb-16 md:mb-20"
        >
          {locale === "id" ? "Cara Kerja Kami: " : "How We Work: "}
          <span className="text-pistachio">The Rampung Way</span>
        </motion.h2>

        {/* Desktop Horizontal */}
        <div className="hidden md:block relative">
          {/* Background line */}
          <div className="absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-slate-grey/20 border-dashed" />
          {/* Progress fill */}
          <motion.div
            className="absolute top-6 left-[12.5%] h-0.5 bg-pistachio"
            style={{ width: lineWidth }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center w-1/4"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 rounded-full bg-pistachio text-midnight flex items-center justify-center font-[family-name:var(--font-sora)] font-bold text-lg relative z-10">
                    {i + 1}
                  </div>
                  <Icon size={24} className="text-pistachio mt-4" />
                  <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mt-3">
                    {step.title}
                  </h3>
                  <span className="text-pistachio text-sm font-[family-name:var(--font-space-mono)] mt-1">
                    {step.subtitle}
                  </span>
                  <p className="text-slate-grey text-sm mt-2 max-w-[200px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Braco walking */}
          <motion.div
            className="relative mt-4 ml-[12.5%]"
            style={{ x: bracoX }}
          >
            <Braco mood="walk" size={50} showParticles={false} />
          </motion.div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-grey/20" />
          <motion.div
            className="absolute left-3 top-0 w-0.5 bg-pistachio origin-top"
            style={{ height: lineWidth }}
          />

          <div className="space-y-10">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <motion.div key={i} className="relative" variants={itemVariants}>
                  {/* Dot */}
                  <div className="absolute -left-5 w-6 h-6 rounded-full bg-pistachio text-midnight flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon size={20} className="text-pistachio" />
                      <h3 className="font-[family-name:var(--font-sora)] text-lg font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-pistachio text-xs font-[family-name:var(--font-space-mono)] mt-0.5 block">
                      {step.subtitle}
                    </span>
                    <p className="text-slate-grey text-sm mt-2">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
