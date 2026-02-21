"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Card } from "@/components/ui/Card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

/* TODO: Remove placeholders when real data available */
const placeholderTestimonials = [
  {
    id: "placeholder-1",
    clientName: "Ahmad Rizky",
    clientCompany: "PT Maju Bersama",
    clientRole: "CEO",
    quote: "Rampung Space benar-benar membantu kami mewujudkan ide aplikasi internal kami dalam waktu singkat. Prosesnya transparan dan hasilnya memuaskan.",
    quoteEn: "Rampung Space truly helped us realize our internal app idea in a short time. The process was transparent and the results were satisfying.",
    rating: 5,
  },
  {
    id: "placeholder-2",
    clientName: "Sarah Chen",
    clientCompany: "TechStartup ID",
    clientRole: "Product Manager",
    quote: "MVP kami selesai dalam 6 minggu. Tim Rampung Space sangat responsif dan mengerti kebutuhan startup yang butuh kecepatan.",
    quoteEn: "Our MVP was completed in 6 weeks. The Rampung Space team was very responsive and understood the needs of a startup that requires speed.",
    rating: 5,
  },
  {
    id: "placeholder-3",
    clientName: "Budi Santoso",
    clientCompany: "Koperasi Digital",
    clientRole: "CTO",
    quote: "Kualitas kode yang dihasilkan sangat baik. Dokumentasi lengkap dan mudah di-maintain oleh tim internal kami setelah handover.",
    quoteEn: "The code quality was excellent. Complete documentation and easy to maintain by our internal team after handover.",
    rating: 4,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-grey/30"}
        />
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  const { locale, t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = placeholderTestimonials.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <motion.section
      className="py-20 md:py-28"
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
          {t.testimonials.heading}
        </motion.h2>

        {/* Desktop: show all 3 cards */}
        <motion.div variants={itemVariants} className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderTestimonials.map((item) => (
            <Card key={item.id} variant="elevated" padding="md">
              <Stars rating={item.rating} />
              <div className="relative mt-4">
                <span className="absolute -top-4 -left-1 text-4xl text-pistachio/30 font-serif leading-none">&ldquo;</span>
                <p className="text-white italic pl-4">
                  {locale === "en" ? item.quoteEn : item.quote}
                </p>
              </div>
              <div className="border-t border-slate-grey/10 mt-4 pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pistachio-deep flex items-center justify-center text-white font-[family-name:var(--font-sora)] font-bold text-sm">
                  {item.clientName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-[family-name:var(--font-sora)] text-sm font-semibold">
                    {item.clientName}
                  </p>
                  <p className="text-slate-grey text-xs">
                    {item.clientRole}, {item.clientCompany}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Mobile: carousel */}
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
              {placeholderTestimonials.map((item, i) =>
                i === current ? (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card variant="elevated" padding="md">
                      <Stars rating={item.rating} />
                      <div className="relative mt-4">
                        <span className="absolute -top-4 -left-1 text-4xl text-pistachio/30 font-serif leading-none">&ldquo;</span>
                        <p className="text-white italic pl-4">
                          {locale === "en" ? item.quoteEn : item.quote}
                        </p>
                      </div>
                      <div className="border-t border-slate-grey/10 mt-4 pt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pistachio-deep flex items-center justify-center text-white font-[family-name:var(--font-sora)] font-bold text-sm">
                          {item.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-[family-name:var(--font-sora)] text-sm font-semibold">
                            {item.clientName}
                          </p>
                          <p className="text-slate-grey text-xs">
                            {item.clientRole}, {item.clientCompany}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ) : null
              )}
            </AnimatePresence>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={prev}
              className="p-2 rounded-full text-slate-grey hover:text-pistachio hover:bg-pistachio/10 transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            {/* Dots */}
            <div className="flex gap-2">
              {placeholderTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    i === current ? "bg-pistachio" : "bg-slate-grey/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
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
