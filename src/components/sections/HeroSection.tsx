"use client";

import { motion } from "framer-motion";
import { ChevronDown, Stethoscope } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";
import { Button } from "@/components/ui/Button";

const floatingSnippets = [
  { text: "{ }", x: "10%", y: "20%", delay: 0 },
  { text: "fn()", x: "85%", y: "15%", delay: 1.2 },
  { text: "</>", x: "5%", y: "70%", delay: 2.4 },
];

export default function HeroSection() {
  const { t } = useLanguage();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(168, 230, 110, 0.05) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    >
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-midnight to-transparent pointer-events-none" />

      {/* Floating code snippets (desktop only) */}
      {floatingSnippets.map((snippet, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block font-[family-name:var(--font-space-mono)] text-xs text-pistachio pointer-events-none select-none"
          style={{ left: snippet.x, top: snippet.y, opacity: 0.2 }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: snippet.delay,
            ease: "easeInOut",
          }}
        >
          {snippet.text}
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-20 md:pt-24 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          {/* Left — Text */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="font-[family-name:var(--font-sora)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Make Space.
              <br />
              Get <span className="text-pistachio">Rampung.</span>
            </motion.h1>

            <motion.p
              className="mt-6 text-lg md:text-xl text-slate-grey max-w-lg mx-auto md:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t.hero.subheadline}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                iconRight={<Stethoscope size={20} />}
                onClick={() => scrollTo("#diagnostic")}
              >
                {t.hero.ctaPrimary}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollTo("#portfolio")}
              >
                {t.hero.ctaSecondary}
              </Button>
            </motion.div>
          </div>

          {/* Right — Braco */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-pistachio/10 rounded-full blur-[80px] pointer-events-none" />
            <Braco mood="wave" size={200} showParticles />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-grey/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
