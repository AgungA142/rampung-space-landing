"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import TestimonialForm from "@/components/admin/TestimonialForm";
import type { Testimonial } from "@/types/testimonial";

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonial() {
      const res = await fetch(`/api/admin/testimonials/${id}`);
      if (res.ok) {
        const { data } = await res.json();
        setTestimonial(data as Testimonial | null);
      } else {
        setTestimonial(null);
      }
      setLoading(false);
    }
    if (id) loadTestimonial();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="h-96 w-full max-w-3xl" />
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-grey">Testimonial tidak ditemukan.</p>
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/testimonials")} className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

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
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
