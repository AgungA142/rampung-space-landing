"use client";

import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Home } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Braco } from "@/components/braco/Braco";
import { Button } from "@/components/ui/Button";

interface ThankYouScreenProps {
  phone: string;
}

export default function ThankYouScreen({ phone }: ThankYouScreenProps) {
  const { locale } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Braco mood="celebrate" size={140} showParticles />
      </motion.div>

      <motion.div
        className="mt-4"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <CheckCircle size={48} className="text-pistachio mx-auto" />
      </motion.div>

      <motion.h3
        className="font-[family-name:var(--font-sora)] text-2xl md:text-3xl font-bold text-white mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {locale === "id" ? "Terima Kasih!" : "Thank You!"}
      </motion.h3>

      <motion.p
        className="text-slate-grey text-base leading-relaxed mt-4 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {locale === "id"
          ? <>Permintaan Anda telah kami terima dan sedang diproses. Tim kami akan segera menghubungi Anda maksimal <strong className="text-pistachio">1x24 jam</strong> untuk mendiskusikan proyek Anda lebih lanjut.</>
          : <>Your request has been received and is being processed. Our team will contact you within <strong className="text-pistachio">24 hours</strong> to discuss your project further.</>}
      </motion.p>

      <motion.div
        className="bg-midnight/50 rounded-xl p-4 mt-4 flex items-start gap-3 max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <MessageCircle size={18} className="text-pistachio flex-shrink-0 mt-0.5" />
        <p className="text-slate-grey text-sm text-left">
          {locale === "id"
            ? <>Pastikan nomor WhatsApp <span className="font-[family-name:var(--font-space-mono)] text-pistachio">{phone}</span> aktif agar tim kami bisa menghubungi Anda.</>
            : <>Make sure your WhatsApp number <span className="font-[family-name:var(--font-space-mono)] text-pistachio">{phone}</span> is active so our team can reach you.</>}
        </p>
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="secondary" size="md" icon={<Home size={18} />} onClick={scrollToTop}>
          {locale === "id" ? "Kembali ke Beranda" : "Back to Home"}
        </Button>
      </motion.div>
    </div>
  );
}
