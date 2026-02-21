"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { slugify } from "@/lib/helpers";
import type { Testimonial } from "@/types/testimonial";

interface TestimonialFormProps {
  testimonial?: Testimonial;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="cursor-pointer transition-colors"
        >
          <Star
            size={24}
            className={
              star <= (hover || value)
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-grey/30"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!testimonial;

  const [clientName, setClientName] = useState(testimonial?.client_name ?? "");
  const [clientCompany, setClientCompany] = useState(testimonial?.client_company ?? "");
  const [clientPosition, setClientPosition] = useState(testimonial?.client_position ?? "");
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatar_url ?? "");
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [isPublished, setIsPublished] = useState(testimonial?.is_published ?? false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!clientName.trim()) errs.client_name = "Nama klien wajib diisi";
    if (!quote.trim()) errs.quote = "Testimoni wajib diisi";
    if (!rating) errs.rating = "Rating wajib diisi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [clientName, quote, rating]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const body = {
      client_name: clientName,
      client_company: clientCompany || null,
      client_position: clientPosition || null,
      avatar_url: avatarUrl || null,
      quote,
      rating,
      is_published: isPublished,
      sort_order: testimonial?.sort_order ?? 0,
    };

    try {
      const url = isEdit
        ? `/api/admin/testimonials/${testimonial.id}`
        : "/api/admin/testimonials";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      toast("success", isEdit ? "Testimonial berhasil diperbarui" : "Testimonial berhasil disimpan");
      router.push("/admin/testimonials");
    } catch {
      toast("error", "Gagal menyimpan testimonial");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-navy-light rounded-xl border border-white/10 p-6 max-w-3xl space-y-6">
      <Input
        label="Nama Klien *"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        error={errors.client_name}
        placeholder="e.g. Ahmad Rizky"
      />

      <Input
        label="Perusahaan"
        value={clientCompany}
        onChange={(e) => setClientCompany(e.target.value)}
        placeholder="e.g. PT Maju Bersama"
      />

      <Input
        label="Jabatan"
        value={clientPosition}
        onChange={(e) => setClientPosition(e.target.value)}
        placeholder="CEO, CTO, Product Manager..."
      />

      {/* Avatar */}
      <div>
        <label className="block text-sm font-medium text-slate-grey mb-1.5">Avatar</label>
        {avatarUrl ? (
          <div className="relative inline-block">
            <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            <button
              type="button"
              onClick={() => setAvatarUrl("")}
              className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <FileUpload
            bucket="media"
            path={`testimonials/${slugify(clientName || "avatar")}`}
            accept="image/*"
            maxSize={2 * 1024 * 1024}
            onUpload={(url) => setAvatarUrl(url)}
            onError={(err) => toast("error", err)}
          />
        )}
      </div>

      <Textarea
        label="Testimoni *"
        rows={4}
        maxLength={500}
        showCount
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        error={errors.quote}
        placeholder="What did the client say?"
      />

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-slate-grey mb-1.5">Rating *</label>
        <StarRating value={rating} onChange={setRating} />
        {errors.rating && <p className="text-sm text-red-400 mt-1">{errors.rating}</p>}
      </div>

      {/* Published */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="w-4 h-4 accent-pistachio"
        />
        <span className="text-sm text-white">Published</span>
      </label>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button variant="ghost" size="md" onClick={() => router.push("/admin/testimonials")}>
          Batal
        </Button>
        <Button variant="primary" size="md" loading={saving} onClick={handleSubmit}>
          {isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
