"use client";

import { useState, useEffect } from "react";
import {
  getGalleriesPaginated,
  createGallery,
  deleteGallery,
  updateGallery,
} from "@/app/actions/gallery";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadGalleries(page);
  }, [page]);

  async function loadGalleries(p: number) {
    setIsLoading(true);
    const result = await getGalleriesPaginated(p);
    if (result.success) {
      setGalleries(result.data);
      setTotalPages(result.pagination.totalPages);
    }
    setIsLoading(false);
  }

  async function handleUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "gallery");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setError("Upload gagal");
      return;
    }
    const data = await res.json();
    setFormData((prev) => ({ ...prev, imageUrl: data.fileUrl }));
  }

  function resetForm() {
    setFormData({ title: "", description: "", imageUrl: "" });
    setEditingGallery(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingGallery) {
        const result = await updateGallery({
          id: editingGallery.id,
          title: formData.title,
          description: formData.description,
        });
        if (result.success) {
          setGalleries((prev) =>
            prev.map((g) => (g.id === editingGallery.id ? result.data : g)),
          );
          resetForm();
        } else setError(result.error);
      } else {
        if (!formData.imageUrl) throw new Error("Foto wajib diupload");
        const result = await createGallery(formData);
        if (result.success) {
          await loadGalleries(1);
          setPage(1);
          resetForm();
        } else setError(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus?")) return;
    const result = await deleteGallery(id);
    if (result.success) await loadGalleries(page);
    else setError(result.error);
  }

  function handleEdit(g: any) {
    setEditingGallery(g);
    setFormData({
      title: g.title,
      description: g.description || "",
      imageUrl: g.imageUrl,
    });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Kelola Galeri</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {galleries.length} foto
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm((p) => !p);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-xs"
        >
          {showForm ? "Batal" : "+ Tambah"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            {editingGallery ? "Edit Galeri" : "Tambah Galeri"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Judul"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-white border-gray-300 text-gray-900 text-sm"
            />
            <Textarea
              placeholder="Deskripsi (opsional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="bg-white border-gray-300 text-gray-900 text-sm resize-none"
            />
            {!editingGallery && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                  }}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {formData.imageUrl && (
                  <p className="text-xs text-green-600 mt-1">✓ Foto siap</p>
                )}
              </div>
            )}
            {editingGallery && (
              <p className="text-xs text-gray-400">Foto tidak bisa diubah</p>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-xs"
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingGallery
                  ? "Update"
                  : "Simpan"}
            </Button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-sm text-center py-10">Memuat...</p>
      ) : galleries.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          Belum ada foto
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {galleries.map((g) => (
              <div
                key={g.id}
                className="group relative rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm"
              >
                <div className="relative h-32">
                  <Image
                    src={g.imageUrl}
                    alt={g.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 truncate">
                    {g.title}
                  </p>
                  {g.description && (
                    <p className="text-xs text-gray-400 truncate">
                      {g.description}
                    </p>
                  )}
                  <div className="flex gap-1 mt-2">
                    <button
                      onClick={() => handleEdit(g)}
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2 py-1 rounded text-xs transition-colors ${p === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200"
      >
        →
      </button>
    </div>
  );
}
