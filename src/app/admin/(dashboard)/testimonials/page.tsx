"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Trash2, Pencil } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { Testimonial } from "@/types/testimonial";

export default function TestimonialsListPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data ?? []) as Testimonial[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const togglePublish = async (id: string, value: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: value }),
      });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_published: value } : t))
      );
      toast("success", "Testimonial diperbarui");
    } catch {
      toast("error", "Gagal memperbarui");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((t) => t.id !== deleteId));
      toast("success", "Testimonial dihapus");
    } catch {
      toast("error", "Gagal menghapus");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="text" className="w-48 h-8" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">Testimonials</h2>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => router.push("/admin/testimonials/new")}
        >
          Tambah Testimonial
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-navy-light rounded-xl border border-white/10 p-12 text-center">
          <p className="text-slate-grey mb-4">Belum ada testimonials.</p>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => router.push("/admin/testimonials/new")}
          >
            Tambah Testimonial
          </Button>
        </div>
      ) : (
        <div className="bg-navy-light rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy text-slate-grey text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Avatar</th>
                  <th className="px-4 py-3 text-left font-medium">Nama</th>
                  <th className="px-4 py-3 text-left font-medium">Perusahaan</th>
                  <th className="px-4 py-3 text-left font-medium">Quote</th>
                  <th className="px-4 py-3 text-left font-medium">Rating</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 text-sm text-white">
                    <td className="px-4 py-3">
                      {item.avatar_url ? (
                        <img src={item.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-pistachio/20 text-pistachio flex items-center justify-center text-xs font-bold">
                          {item.client_name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/testimonials/${item.id}/edit`)}
                        className="text-white hover:text-pistachio transition-colors font-medium text-left"
                      >
                        {item.client_name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-grey">
                      {item.client_company ?? "-"}
                      {item.client_position && (
                        <span className="block text-xs">{item.client_position}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-grey max-w-[200px]">
                      <p className="truncate">{item.quote}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-grey/30"}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => togglePublish(item.id, !item.is_published)}
                        className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                          item.is_published
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/10 text-slate-grey"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/testimonials/${item.id}/edit`)}
                          className="p-1.5 rounded-lg text-slate-grey hover:text-white hover:bg-white/5"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="p-1.5 rounded-lg text-slate-grey hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Testimonial"
        size="sm"
      >
        <p className="text-slate-grey text-sm mb-6">
          Yakin ingin menghapus testimonial ini?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDelete}
            loading={deleting}
            className="!bg-red-500 !text-white hover:!bg-red-600 !shadow-none"
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
