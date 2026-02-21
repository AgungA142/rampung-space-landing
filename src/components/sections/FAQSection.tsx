"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Accordion } from "@/components/ui/Accordion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const faqs = [
  {
    questionId: "Berapa lama proses development MVP?",
    questionEn: "How long does MVP development take?",
    answerId: "Tergantung kompleksitas, umumnya 4-12 minggu. Kami akan memberikan estimasi yang realistis setelah fase diagnosa.",
    answerEn: "Depending on complexity, typically 4-12 weeks. We'll provide a realistic estimate after the diagnosis phase.",
  },
  {
    questionId: "Apakah saya perlu paham teknis?",
    questionEn: "Do I need technical knowledge?",
    answerId: "Tidak perlu sama sekali. Tim kami akan menjelaskan semuanya dengan bahasa yang mudah dipahami. Anda fokus pada ide bisnis, kami yang handle teknisnya.",
    answerEn: "Not at all. Our team will explain everything in easy-to-understand language. You focus on the business idea, we handle the technical side.",
  },
  {
    questionId: "Bagaimana proses pembayarannya?",
    questionEn: "How does the payment process work?",
    answerId: "Kami menggunakan sistem milestone-based payment. Bayar sesuai tahapan yang sudah disepakati, bukan sekaligus di awal.",
    answerEn: "We use a milestone-based payment system. Pay according to agreed stages, not all upfront.",
  },
  {
    questionId: "Apakah ada maintenance setelah launch?",
    questionEn: "Is there maintenance after launch?",
    answerId: "Ya, kami menyediakan paket maintenance opsional. Termasuk bug fixing, minor updates, dan monitoring performa.",
    answerEn: "Yes, we offer optional maintenance packages. Including bug fixing, minor updates, and performance monitoring.",
  },
  {
    questionId: "Teknologi apa yang digunakan?",
    questionEn: "What technologies do you use?",
    answerId: "Kami menggunakan tech stack modern: React/Next.js untuk frontend, Node.js/Python untuk backend, PostgreSQL untuk database, dan cloud services (AWS/Vercel) untuk deployment.",
    answerEn: "We use modern tech stack: React/Next.js for frontend, Node.js/Python for backend, PostgreSQL for database, and cloud services (AWS/Vercel) for deployment.",
  },
  {
    questionId: "Bagaimana kalau saya baru punya ide kasar?",
    questionEn: "What if I only have a rough idea?",
    answerId: "Sempurna! Justru itu yang kami suka. Gunakan tool Diagnosa Proyek kami untuk mulai, lalu kami bantu bentuk ide Anda menjadi konsep produk yang jelas.",
    answerEn: "Perfect! That's exactly what we love. Use our Project Diagnosis tool to start, then we'll help shape your idea into a clear product concept.",
  },
  {
    questionId: "Apakah kode sumbernya milik saya?",
    questionEn: "Do I own the source code?",
    answerId: "Ya, 100%. Setelah proyek selesai dan pembayaran lunas, seluruh kode sumber, dokumentasi, dan aset menjadi milik Anda sepenuhnya.",
    answerEn: "Yes, 100%. After the project is completed and payment is settled, all source code, documentation, and assets become fully yours.",
  },
];

export default function FAQSection() {
  const { locale, t } = useLanguage();

  const accordionItems = faqs.map((faq, i) => ({
    id: `faq-${i}`,
    title: locale === "en" ? faq.questionEn : faq.questionId,
    content: (
      <p>{locale === "en" ? faq.answerEn : faq.answerId}</p>
    ),
  }));

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: locale === "en" ? faq.questionEn : faq.questionId,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "en" ? faq.answerEn : faq.answerId,
      },
    })),
  };

  return (
    <motion.section
      className="py-20 md:py-28"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.h2
          variants={itemVariants}
          className="font-[family-name:var(--font-sora)] text-3xl md:text-4xl font-bold text-white text-center mb-12 md:mb-16"
        >
          {t.faq.heading}
        </motion.h2>

        <motion.div variants={itemVariants}>
          <Accordion items={accordionItems} />
        </motion.div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </motion.section>
  );
}
