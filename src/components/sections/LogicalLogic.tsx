"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import DiagnosticWizard from "@/components/diagnostic/DiagnosticWizard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function LogicalLogic() {
  const { locale } = useLanguage();

  return (
    <motion.section
      id="diagnostic"
      className="py-20 md:py-28 relative"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(168, 230, 110, 0.05) 0%, transparent 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h2 className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold text-white">
            {locale === "id" ? "Diagnosa Proyek Anda" : "Diagnose Your Project"}
          </h2>
          <p className="text-slate-grey mt-3 max-w-lg mx-auto">
            {locale === "id"
              ? "Jawab beberapa pertanyaan singkat, kami bantu analisis kebutuhan proyek Anda."
              : "Answer a few quick questions, we'll help analyze your project needs."}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <DiagnosticWizard />
        </motion.div>
      </div>
    </motion.section>
  );
}
