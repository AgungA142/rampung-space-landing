"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Star, Trash2, Pencil } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import type { Portfolio } from "@/types/portfolio";

export default function PortfolioListPage() {
  const supabase = useSupabase();
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    const { data } = await supabase
      .from("portfolios")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data ?? []) as Portfolio[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleField = async (id: string, field: "is_published" | "is_featured", value: boolean) => {
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
      toast("success", "Portfolio diperbarui");
    } catch {
      toast("error", "Gagal memperbarui");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/portfolio/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast("success", "Portfolio dihapus");
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
        <h2 className="text-white font-semibold">Portfolio</h2>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => router.push("/admin/portfolio/new")}
        >
          Tambah Portfolio
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="bg-navy-light rounded-xl border border-white/10 p-12 text-center">
          <p className="text-slate-grey mb-4">Belum ada portfolio. Tambahkan portfolio pertama Anda.</p>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => router.push("/admin/portfolio/new")}
          >
            Tambah Portfolio
          </Button>
        </div>
      ) : (
        <div className="bg-navy-light rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-navy text-slate-grey text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-medium">Thumbnail</th>
                  <th className="px-4 py-3 text-left font-medium">Judul</th>
                  <th className="px-4 py-3 text-left font-medium">Tags</th>
                  <th className="px-4 py-3 text-left font-medium">Featured</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 text-sm text-white">
                    <td className="px-4 py-3">
                      {item.thumbnail_url ? (
                        <img
                          src={item.thumbnail_url}
                          alt={item.title}
                          className="w-16 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded bg-gradient-to-br from-pistachio/20 to-navy" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/portfolio/${item.id}/edit`)}
                        className="text-white hover:text-pistachio transition-colors font-medium text-left"
                      >
                        {item.title}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge key={tag} size="sm">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleField(item.id, "is_featured", !item.is_featured)}
                        className="transition-colors"
                      >
                        <Star
                          size={18}
                          className={item.is_featured ? "text-yellow-400 fill-yellow-400" : "text-slate-grey/30"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleField(item.id, "is_published", !item.is_published)}
                        className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                          item.is_published
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/10 text-slate-grey"
                        }`}
                      >
                        {item.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-grey">{item.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/portfolio/${item.id}/edit`)}
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
        title="Hapus Portfolio"
        size="sm"
      >
        <p className="text-slate-grey text-sm mb-6">
          Yakin ingin menghapus portfolio ini? Gambar yang terupload juga akan dihapus.
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
