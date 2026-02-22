"use client";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
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
    id: "placeholder-1",
    title: "KopiOps: Supply Chain Dashboard",
    challenge: "Manajemen supply chain kopi dari petani ke roaster masih manual, rawan error, dan sulit dilacak.",
    challengeEn: "Coffee supply chain management from farmer to roaster was still manual, error-prone, and hard to track.",
    solution: "Dashboard real-time yang menghubungkan petani, pengepul, dan roaster dalam satu platform.",
    solutionEn: "Real-time dashboard connecting farmers, collectors, and roasters in one platform.",
    techStack: ["React", "Node.js", "PostgreSQL", "AWS"],
    tags: ["MVP", "Web App"],
  },
  {
    id: "placeholder-2",
    title: "EduTrack: Student Progress Tracker",
    challenge: "Sekolah kesulitan memantau progress belajar murid secara real-time dan memberikan feedback yang personalized.",
    challengeEn: "Schools struggled to monitor student learning progress in real-time and provide personalized feedback.",
    solution: "Aplikasi mobile yang memungkinkan guru input progress harian dan orang tua memantau.",
    solutionEn: "Mobile app enabling teachers to input daily progress and parents to monitor.",
    techStack: ["Flutter", "Firebase", "Python"],
    tags: ["MVP", "Mobile App"],
  },
  {
    id: "placeholder-3",
    title: "PajakKu: Tax Filing Simplified",
    challenge: "UMKM kesulitan menghitung dan melaporkan pajak karena proses yang rumit dan berubah-ubah.",
    challengeEn: "SMEs struggled with calculating and filing taxes due to complex and ever-changing processes.",
    solution: "Web app wizard yang memandu UMKM step-by-step dalam menghitung dan melaporkan pajak.",
    solutionEn: "Web app wizard guiding SMEs step-by-step in calculating and filing taxes.",
    techStack: ["Next.js", "Supabase", "Tailwind CSS"],
    tags: ["Web App"],
  },
];

export default function PortfolioSection() {
  const { locale, t } = useLanguage();

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
          className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16"
        >
          {t.portfolio.heading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderPortfolios.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card variant="interactive" padding="none" className="h-full flex flex-col">
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-gradient-to-br from-pistachio/10 to-pistachio-deep/10 rounded-t-2xl flex items-center justify-center">
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
                  <h3 className="font-[family-name:var(--font-sora)] text-xl font-bold text-white mt-3">
                    {project.title}
                  </h3>

                  {/* Challenge */}
                  <div className="mt-3">
                    <span className="text-xs font-[family-name:var(--font-space-mono)] text-pistachio uppercase tracking-wider">
                      THE CHALLENGE
                    </span>
                    <p className="text-slate-grey text-sm mt-1">
                      {locale === "en" ? project.challengeEn : project.challenge}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="mt-3">
                    <span className="text-xs font-[family-name:var(--font-space-mono)] text-pistachio uppercase tracking-wider">
                      THE SOLUTION
                    </span>
                    <p className="text-slate-grey text-sm mt-1">
                      {locale === "en" ? project.solutionEn : project.solution}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex gap-2 flex-wrap mt-4">
                    {project.techStack.map((tech) => (
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
                      onClick={() => scrollTo("#diagnostic")}
                    >
                      {t.portfolio.cta}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
