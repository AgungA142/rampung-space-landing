"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ProcessingScreenProps {
  onComplete: () => void;
}

export default function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const { locale } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);

    const timer = setTimeout(onComplete, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Braco mood="thinking" size={140} showParticles />
      </motion.div>

      <motion.p
        className="font-[family-name:var(--font-sora)] text-xl text-white mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {locale === "id"
          ? "Sedang menganalisis proyek Anda"
          : "Analyzing your project"}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.p>

      <div className="w-full max-w-xs mt-6">
        <ProgressBar value={progress} max={100} showLabel />
      </div>
    </div>
  );
}
