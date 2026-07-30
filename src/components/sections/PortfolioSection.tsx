"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* TODO: Remove placeholders when real data available */
const placeholderPortfolios = [
 {
    id: "sarekatbot",
    title: "Sarekatbot: Kelola Keuangan Digital",
    titleEn: "Sarekatbot: Digital Financial Management",
    challenge: "Banyak orang malas mencatat keuangan karena terlalu banyak mengunduh aplikasi baru yang jarang dibuka, padahal pencatatan seharusnya menyatu dengan aplikasi komunikasi sehari-hari.",
    challengeEn: "Many people neglect financial tracking due to app fatigue from downloading single-purpose apps, whereas financial logging should seamlessly integrate into daily communication platforms.",
    solution: "SarekatBot hadir dengan filosofi 'Sangkan Reujeung Katata' (Supaya Bersama-sama Menjadi Tertata), sebuah Telegram Bot berbasis AI dengan NLP untuk mencatat transaksi lewat bahasa natural, OCR untuk scan nota, serta fitur histori saldo otomatis.",
    solutionEn: "Driven by the 'Sangkan Reujeung Katata' philosophy (To order and organize together), SarekatBot is an AI-powered Telegram Bot utilizing NLP for natural language transaction logging, OCR for receipt scanning, and automated balance tracking.",
    tags: ["Telegram Bot", "AI", "Fintech"],
    url: "https://t.me/SarekatBot",
  },
  {
    "id": "VSNotes",
    "title": "VSNotes: Video auto Summary Notes",
    "titleEn": "VSNotes: Video auto Summary Notes",
    "challenge": "Aktivitas mencatat secara manual selagi menonton video edukasi atau mendengarkan podcast sering kali memecah konsentrasi, sehingga esensi dan konteks menyeluruh dari materi tersebut gagal dipahami dengan optimal.",
    "challengeEn": "Manually taking notes while watching instructional videos or listening to podcasts often divides attention, preventing users from fully absorbing the comprehensive content and context.",
    "solution": "VSNotes memberikan solusi otomatisasi catatan dari berbagai platform video. Aplikasi ini menangkap dan merekam output audio device dari media yang sedang diputar, kemudian menggunakan AI untuk menyusun rangkuman komprehensif secara otomatis.",
    "solutionEn": "VSNotes provides an automated solution by capturing and recording audio directly from the active playback device across various platforms, utilizing AI to instantly generate accurate notes and summaries.",
    "tags": ["Desktop App", "AI", "Educational"],
    "url": "https://vsnotes.space/"
  }
];

export default function PortfolioSection() {
  const { locale, t } = useLanguage();
  const portfolios = placeholderPortfolios;
  const total = portfolios.length;

  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopPage, setDesktopPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const desktopGroupSize = 3;
  const totalDesktopPages = Math.ceil(total / desktopGroupSize);
  const hasDesktopNav = totalDesktopPages > 1;

  const desktopGroups: (typeof portfolios)[] = [];
  for (let i = 0; i < total; i += desktopGroupSize) {
    desktopGroups.push(portfolios.slice(i, i + desktopGroupSize));
  }

  const nextMobile = useCallback(() => setMobileIndex((i) => (i + 1) % total), [total]);
  const prevMobile = useCallback(() => setMobileIndex((i) => (i - 1 + total) % total), [total]);
  const nextDesktop = useCallback(
    () => setDesktopPage((p) => (p + 1) % totalDesktopPages),
    [totalDesktopPages]
  );
  const prevDesktop = useCallback(
    () => setDesktopPage((p) => (p - 1 + totalDesktopPages) % totalDesktopPages),
    [totalDesktopPages]
  );

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextMobile();
      if (hasDesktopNav) nextDesktop();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextMobile, nextDesktop, hasDesktopNav]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const renderCard = (project: (typeof portfolios)[0]) => {
    // Card click: go to url
    const handleCardClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (project.url) {
        window.open(project.url, "_blank", "noopener,noreferrer");
      }
    };

    return (
      <div
        className="h-full flex flex-col cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleCardClick(e as any);
          }
        }}
      >
        <Card variant="interactive" padding="none" className="h-full flex flex-col">
          {/* Thumbnail placeholder */}
          {/* <div className="aspect-video bg-linear-to-br from-pistachio/10 to-pistachio-deep/10 rounded-t-2xl flex items-center justify-center overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div> */}
          <div className="aspect-video bg-linear-to-br from-pistachio/10 to-pistachio-deep/10 rounded-t-2xl flex items-center justify-center">
            <FolderOpen size={40} className="text-pistachio/30" />
          </div>

          <div className="flex flex-col flex-1 p-4">
            {/* Tags */}
            <div className="flex gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h3 className="font-sora text-xl font-bold text-white mt-3">
              {locale === "en" ? project.titleEn : project.title}
            </h3>

            {/* Challenge */}
            <div className="mt-3">
              <span className="text-xs font-space-mono text-pistachio uppercase tracking-wider">
                THE CHALLENGE
              </span>
              <p className="text-slate-grey text-sm mt-1">
                {locale === "en" ? project.challengeEn : project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div className="mt-3">
              <span className="text-xs font-space-mono text-pistachio uppercase tracking-wider">
                THE SOLUTION
              </span>
              <p className="text-slate-grey text-sm mt-1">
                {locale === "en" ? project.solutionEn : project.solution}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="flex gap-2 flex-wrap mt-4">
              {project.tags.map((tech) => (
                <span
                  key={tech}
                  className="bg-midnight text-slate-grey text-xs px-2 py-1 rounded border border-slate-grey/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollTo("#diagnostic");
                }}
              >
                {t.portfolio.cta}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <motion.section
      id="portfolio"
      className="py-20 md:py-28 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.h2
          variants={itemVariants}
          className="font-sora text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16"
        >
          {t.portfolio.heading}
        </motion.h2>

        {/* Desktop (md+): 3 cards per view */}
        <motion.div
          variants={itemVariants}
          className="hidden md:block"
          {...(hasDesktopNav
            ? {
                onMouseEnter: () => setIsPaused(true),
                onMouseLeave: () => setIsPaused(false),
                onTouchStart: () => setIsPaused(true),
                onTouchEnd: () => setIsPaused(false),
              }
            : {})}
        >
          {hasDesktopNav ? (
            <>
              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={desktopPage}
                    className="grid grid-cols-3 gap-6"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {desktopGroups[desktopPage].map((project) => (
                      <div key={project.id}>{renderCard(project)}</div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Desktop nav */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevDesktop}
                  className="p-2 rounded-full text-slate-grey hover:text-pistachio hover:bg-pistachio/10 transition-colors cursor-pointer"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-2">
                  {desktopGroups.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setDesktopPage(i)}
                      className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                        i === desktopPage ? "bg-pistachio" : "bg-slate-grey/30"
                      }`}
                      aria-label={`Go to page ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextDesktop}
                  className="p-2 rounded-full text-slate-grey hover:text-pistachio hover:bg-pistachio/10 transition-colors cursor-pointer"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {portfolios.map((project) => (
                <div key={project.id}>{renderCard(project)}</div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Mobile: 1 card carousel */}
        <motion.div
          variants={itemVariants}
          className="md:hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              {portfolios.map((project, i) =>
                i === mobileIndex ? (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderCard(project)}
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>
          {/* Mobile nav */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prevMobile}
              className="p-2 rounded-full text-slate-grey hover:text-pistachio hover:bg-pistachio/10 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {portfolios.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMobileIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    i === mobileIndex ? "bg-pistachio" : "bg-slate-grey/30"
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextMobile}
              className="p-2 rounded-full text-slate-grey hover:text-pistachio hover:bg-pistachio/10 transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
