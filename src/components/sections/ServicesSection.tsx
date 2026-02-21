"use client";

import { motion } from "framer-motion";
import { Rocket, Globe, Smartphone, Server, Palette, MessageSquare } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Braco } from "@/components/braco/Braco";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const serviceIcons = [Globe, Smartphone, Server, Palette, MessageSquare] as const;

export default function ServicesSection() {
  const { locale, t } = useLanguage();

  const services = [
    {
      icon: Globe,
      title: locale === "id" ? "Web Application Development" : "Web Application Development",
      desc: locale === "id"
        ? "Aplikasi web modern, responsif, dan scalable untuk kebutuhan bisnis Anda."
        : "Modern, responsive, and scalable web applications for your business needs.",
    },
    {
      icon: Smartphone,
      title: locale === "id" ? "Mobile App Development" : "Mobile App Development",
      desc: locale === "id"
        ? "Aplikasi mobile Android yang performant dan user-friendly."
        : "Performant and user-friendly Android mobile applications.",
    },
    {
      icon: Server,
      title: locale === "id" ? "API & Backend Systems" : "API & Backend Systems",
      desc: locale === "id"
        ? "Arsitektur backend yang robust, API yang well-documented, dan database yang optimal."
        : "Robust backend architecture, well-documented APIs, and optimized databases.",
    },
    {
      icon: Palette,
      title: locale === "id" ? "UI/UX Design" : "UI/UX Design",
      desc: locale === "id"
        ? "Desain interface yang intuitif dan pengalaman pengguna yang menyenangkan."
        : "Intuitive interface design and delightful user experience.",
    },
    {
      icon: MessageSquare,
      title: locale === "id" ? "Tech Consultation" : "Tech Consultation",
      desc: locale === "id"
        ? "Konsultasi teknis untuk membantu Anda memilih stack dan arsitektur yang tepat."
        : "Technical consultation to help you choose the right stack and architecture.",
    },
  ];

  return (
    <motion.section
      id="layanan"
      className="py-20 md:py-28 relative"
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
          {t.services.heading}
        </motion.h2>

        {/* MVP Featured Card */}
        <motion.div variants={itemVariants}>
          <Card variant="interactive" padding="lg" className="border-pistachio/30 bg-gradient-to-r from-pistachio/5 to-transparent mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Rocket size={48} className="text-pistachio flex-shrink-0" />
                  <div>
                    <h3 className="font-[family-name:var(--font-sora)] text-xl md:text-2xl font-bold text-white">
                      {t.services.mvp.title}
                    </h3>
                    <p className="text-slate-grey mt-2">
                      {t.services.mvp.description}
                    </p>
                  </div>
                </div>
              </div>
              <Badge variant="primary" size="md" className="flex-shrink-0">
                {t.services.primaryFocus}
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div key={i} variants={itemVariants}>
                <Card variant="interactive" padding="md" className="h-full">
                  <Icon size={32} className="text-pistachio mb-3" />
                  <h3 className="font-[family-name:var(--font-sora)] text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="text-slate-grey text-sm mt-2 line-clamp-2">
                    {service.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Braco - desktop only */}
      <div className="hidden lg:block absolute bottom-8 right-8 opacity-70">
        <Braco mood="idle" size={80} showParticles={false} />
      </div>
    </motion.section>
  );
}
