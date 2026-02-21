"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import StepContact from "./StepContact";
import StepBudget from "./StepBudget";
import StepPlatform from "./StepPlatform";
import StepTargetUser from "./StepTargetUser";
import StepFeatures from "./StepFeatures";
import StepTimeline from "./StepTimeline";
import ProcessingScreen from "./ProcessingScreen";
import ThankYouScreen from "./ThankYouScreen";
import type { DiagnosticFormData, Feature } from "@/types/diagnostic";

const TOTAL_STEPS = 6;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const initialFormData: DiagnosticFormData = {
  name: "",
  email: "",
  company: "",
  budget_idr: "",
  budget_usd: "",
  platform: "" as DiagnosticFormData["platform"],
  platform_other: "",
  target_user: "" as DiagnosticFormData["target_user"],
  features: [],
  timeline: "" as DiagnosticFormData["timeline"],
};

export default function DiagnosticWizard() {
  const { locale } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<DiagnosticFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<"wizard" | "processing" | "thankYou">("wizard");

  const updateField = useCallback((field: keyof DiagnosticFormData, value: string | Feature[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};

    switch (currentStep) {
      case 0: {
        if (!formData.name || formData.name.trim().length < 2) {
          errs.name = locale === "id" ? "Nama wajib diisi (min 2 karakter)" : "Name is required (min 2 chars)";
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errs.email = locale === "id" ? "Format email tidak valid" : "Invalid email format";
        }
        break;
      }
      case 2: {
        if (!formData.platform) {
          errs.platform = locale === "id" ? "Pilih platform" : "Select a platform";
        }
        if (formData.platform === "other" && !formData.platform_other?.trim()) {
          errs.platform_other = locale === "id" ? "Tulis platform yang diinginkan" : "Please specify your platform";
        }
        break;
      }
      case 3: {
        if (!formData.target_user) {
          errs.target_user = locale === "id" ? "Pilih target pengguna" : "Select target user";
        }
        break;
      }
      case 4: {
        if (!formData.features || formData.features.length === 0) {
          errs.features = locale === "id" ? "Pilih minimal 1 fitur" : "Select at least 1 feature";
        }
        break;
      }
      case 5: {
        if (!formData.timeline) {
          errs.timeline = locale === "id" ? "Pilih timeline" : "Select a timeline";
        }
        break;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [currentStep, formData, locale]);

  const goNext = useCallback(() => {
    if (!validate()) return;

    if (currentStep === TOTAL_STEPS - 1) {
      handleSubmit();
      return;
    }

    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, [currentStep, validate]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(0, s - 1));
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Submission failed");

      localStorage.setItem(
        "lastDiagnostic",
        JSON.stringify({ ...formData, submittedAt: new Date().toISOString() })
      );

      setPhase("processing");
    } catch {
      setErrors({
        submit: locale === "id"
          ? "Gagal mengirim data. Silakan coba lagi."
          : "Failed to submit. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onProcessingComplete = useCallback(() => {
    setPhase("thankYou");
  }, []);

  if (phase === "processing") {
    return (
      <div className="bg-navy-light rounded-2xl border border-white/5 p-6 md:p-8 max-w-[720px] mx-auto min-h-[400px] flex items-center justify-center">
        <ProcessingScreen onComplete={onProcessingComplete} />
      </div>
    );
  }

  if (phase === "thankYou") {
    return (
      <div className="bg-navy-light rounded-2xl border border-white/5 p-6 md:p-8 max-w-[720px] mx-auto">
        <ThankYouScreen email={formData.email} />
      </div>
    );
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const stepLabels = locale === "id"
    ? ["Info Kontak", "Budget", "Platform", "Target User", "Fitur", "Timeline"]
    : ["Contact Info", "Budget", "Platform", "Target User", "Features", "Timeline"];

  return (
    <div className="bg-navy-light rounded-2xl border border-white/5 p-6 md:p-8 max-w-[720px] mx-auto shadow-lg">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-grey font-[family-name:var(--font-space-mono)]">
          {locale === "id"
            ? `Langkah ${currentStep + 1} dari ${TOTAL_STEPS}`
            : `Step ${currentStep + 1} of ${TOTAL_STEPS}`}
        </span>
        <span className="text-xs text-slate-grey">{stepLabels[currentStep]}</span>
      </div>
      <ProgressBar
        value={((currentStep + 1) / TOTAL_STEPS) * 100}
        glow={false}
        className="mb-6"
      />

      {/* Step Content */}
      <div className="min-h-[350px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {currentStep === 0 && (
              <StepContact data={formData} errors={errors} onChange={updateField} />
            )}
            {currentStep === 1 && (
              <StepBudget data={formData} onChange={updateField} />
            )}
            {currentStep === 2 && (
              <StepPlatform data={formData} errors={errors} onChange={updateField} />
            )}
            {currentStep === 3 && (
              <StepTargetUser data={formData} errors={errors} onChange={updateField} />
            )}
            {currentStep === 4 && (
              <StepFeatures data={formData} errors={errors} onChange={updateField as (field: keyof DiagnosticFormData, value: Feature[]) => void} />
            )}
            {currentStep === 5 && (
              <StepTimeline data={formData} errors={errors} onChange={updateField} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit error */}
      {errors.submit && (
        <p className="text-sm text-red-400 text-center mt-2">{errors.submit}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        {currentStep > 0 ? (
          <Button
            variant="ghost"
            size="md"
            icon={<ArrowLeft size={18} />}
            onClick={goBack}
          >
            {locale === "id" ? "Kembali" : "Back"}
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="primary"
          size="md"
          iconRight={isLastStep ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
          onClick={goNext}
          loading={isSubmitting}
        >
          {isLastStep
            ? locale === "id"
              ? "Kirim Diagnosa"
              : "Submit Diagnosis"
            : locale === "id"
              ? "Selanjutnya"
              : "Next"}
        </Button>
      </div>
    </div>
  );
}
