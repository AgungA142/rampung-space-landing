"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        icon={<ArrowLeft size={16} />}
        onClick={() => router.push("/admin/testimonials")}
      >
        Kembali ke Testimonials
      </Button>
      <TestimonialForm />
    </div>
  );
}
