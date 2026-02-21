"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { slugify } from "@/lib/helpers";
import type { Portfolio } from "@/types/portfolio";

interface PortfolioFormProps {
  portfolio?: Portfolio;
}

const TAG_OPTIONS = ["MVP", "Web App", "Mobile App", "API", "UI/UX"];

export default function PortfolioForm({ portfolio }: PortfolioFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!portfolio;

  const [title, setTitle] = useState(portfolio?.title ?? "");
  const [slug, setSlug] = useState(portfolio?.slug ?? "");
  const [challenge, setChallenge] = useState(portfolio?.challenge ?? "");
  const [solution, setSolution] = useState(portfolio?.solution ?? "");
  const [techStack, setTechStack] = useState<string[]>(portfolio?.tech_stack ?? []);
  const [techInput, setTechInput] = useState("");
  const [tags, setTags] = useState<string[]>(portfolio?.tags ?? []);
  const [thumbnailUrl, setThumbnailUrl] = useState(portfolio?.thumbnail_url ?? "");
  const [images, setImages] = useState<string[]>(portfolio?.images ?? []);
  const [isFeatured, setIsFeatured] = useState(portfolio?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(portfolio?.is_published ?? false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(slugify(value));
  };

  const addTech = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack((prev) => [...prev, trimmed]);
    }
    setTechInput("");
  };

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech(techInput);
    }
  };

  const removeTech = (tech: string) => {
    setTechStack((prev) => prev.filter((t) => t !== tech));
  };

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((u) => u !== url));
  };

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Judul wajib diisi";
    if (!challenge.trim()) errs.challenge = "Challenge wajib diisi";
    if (!solution.trim()) errs.solution = "Solution wajib diisi";
    if (techStack.length === 0) errs.tech_stack = "Minimal 1 teknologi";
    if (tags.length === 0) errs.tags = "Minimal 1 tag";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [title, challenge, solution, techStack, tags]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const body = {
      title,
      slug,
      challenge,
      solution,
      tech_stack: techStack,
      tags,
      thumbnail_url: thumbnailUrl || null,
      images,
      is_featured: isFeatured,
      is_published: isPublished,
      sort_order: portfolio?.sort_order ?? 0,
    };

    try {
      const url = isEdit
        ? `/api/admin/portfolio/${portfolio.id}`
        : "/api/admin/portfolio";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      toast("success", isEdit ? "Portfolio berhasil diperbarui" : "Portfolio berhasil disimpan");
      router.push("/admin/portfolio");
    } catch {
      toast("error", "Gagal menyimpan portfolio");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-navy-light rounded-xl border border-white/10 p-6 max-w-3xl space-y-6">
      {/* Title */}
      <div>
        <Input
          label="Judul Proyek *"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          error={errors.title}
          placeholder="e.g. KopiOps: Supply Chain Dashboard"
        />
        {slug && (
          <p className="text-xs text-slate-grey mt-1 font-[family-name:var(--font-space-mono)]">
            Slug: {slug}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-slate-grey mb-1.5">Thumbnail</label>
        {thumbnailUrl ? (
          <div className="relative inline-block">
            <img src={thumbnailUrl} alt="Thumbnail" className="h-32 rounded-lg object-cover" />
            <button
              type="button"
              onClick={() => setThumbnailUrl("")}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <FileUpload
            bucket="media"
            path="portfolios"
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            onUpload={(url) => setThumbnailUrl(url)}
            onError={(err) => toast("error", err)}
          />
        )}
      </div>

      {/* Challenge */}
      <Textarea
        label="The Challenge *"
        rows={3}
        maxLength={500}
        showCount
        value={challenge}
        onChange={(e) => setChallenge(e.target.value)}
        error={errors.challenge}
        placeholder="Describe the problem..."
      />

      {/* Solution */}
      <Textarea
        label="The Solution *"
        rows={3}
        maxLength={500}
        showCount
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        error={errors.solution}
        placeholder="Describe the solution..."
      />

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-slate-grey mb-1.5">Tech Stack *</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="bg-navy text-slate-grey text-sm px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              {tech}
              <button type="button" onClick={() => removeTech(tech)} className="hover:text-white">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <Input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={handleTechKeyDown}
          placeholder="Ketik lalu tekan Enter"
          error={errors.tech_stack}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-grey mb-1.5">Tags *</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                tags.includes(tag)
                  ? "border-pistachio bg-pistachio/10 text-pistachio"
                  : "border-white/10 text-slate-grey hover:border-white/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {errors.tags && <p className="text-sm text-red-400 mt-1">{errors.tags}</p>}
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-slate-grey mb-1.5">Additional Images</label>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`Image ${i + 1}`} className="h-20 w-20 rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        {images.length < 5 && (
          <FileUpload
            bucket="media"
            path="portfolios"
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            onUpload={(url) => setImages((prev) => [...prev, url])}
            onError={(err) => toast("error", err)}
          />
        )}
        <p className="text-xs text-slate-grey mt-1">{images.length}/5 images</p>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 accent-pistachio"
          />
          <span className="text-sm text-white">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 accent-pistachio"
          />
          <span className="text-sm text-white">Published</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <Button variant="ghost" size="md" onClick={() => router.push("/admin/portfolio")}>
          Batal
        </Button>
        <Button variant="primary" size="md" loading={saving} onClick={handleSubmit}>
          {isEdit ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </div>
  );
}
