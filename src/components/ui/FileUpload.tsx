"use client";

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";

interface FileUploadProps {
  bucket: string;
  path?: string;
  accept?: string;
  maxSize?: number;
  onUpload?: (url: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

function FileUpload({
  bucket,
  path = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024,
  onUpload,
  onError,
  className = "",
}: FileUploadProps) {
  const supabase = useSupabase();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.size > maxSize) {
        onError?.(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        return;
      }

      setUploading(true);

      // Preview
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      const fileName = `${path ? path + "/" : ""}${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        onError?.(error.message);
        setPreview(null);
      } else {
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        onUpload?.(data.publicUrl);
      }

      setUploading(false);
    },
    [bucket, path, maxSize, supabase, onUpload, onError]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearPreview = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8
          flex flex-col items-center justify-center gap-3
          transition-colors duration-200 cursor-pointer
          ${
            isDragging
              ? "border-pistachio bg-pistachio/5"
              : "border-white/10 hover:border-white/20"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 rounded-lg object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-pistachio border-t-transparent" />
            ) : (
              <>
                <FileImage size={32} className="text-slate-grey" />
                <div className="text-center">
                  <p className="text-sm text-white">
                    <Upload size={14} className="inline mr-1" />
                    Click or drag to upload
                  </p>
                  <p className="text-xs text-slate-grey mt-1">
                    Max {Math.round(maxSize / 1024 / 1024)}MB
                  </p>
                </div>
              </>
            )}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export { FileUpload, type FileUploadProps };
