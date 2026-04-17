"use client";

import { useState, useEffect } from "react";
import {
  getGalleries,
  createGallery,
  deleteGallery,
  updateGallery,
} from "@/app/actions/gallery";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadGalleries();
  }, []);

  async function loadGalleries() {
    try {
      const result = await getGalleries();
      if (result.success) setGalleries(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUploadImage(file: File) {
    try {
      setUploadProgress(0);

      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("category", "gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Upload gagal");

      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        imageUrl: data.fileUrl,
      }));

      setUploadProgress(100);
    } catch (err: any) {
      setError(err.message);
    }
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
        // UPDATE
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
        } else {
          setError(result.error);
        }
      } else {
        // CREATE
        if (!formData.imageUrl) throw new Error("Foto wajib diupload");

        const result = await createGallery(formData);

        if (result.success) {
          setGalleries((prev) => [result.data, ...prev]);
          resetForm();
        } else {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus?")) return;

    const result = await deleteGallery(id);

    if (result.success) {
      setGalleries((prev) => prev.filter((g) => g.id !== id));
    } else {
      setError(result.error);
    }
  }

  function handleEdit(gallery: any) {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description || "",
      imageUrl: gallery.imageUrl,
    });
    setShowForm(true);
  }

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Kelola Galeri</h1>
        <Button
          onClick={() => {
            resetForm();
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? "Batal" : "+ Tambah"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">{error}</div>
      )}

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingGallery ? "Edit Galeri" : "Tambah Galeri"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Judul"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <Textarea
                placeholder="Deskripsi"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              {!editingGallery && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadImage(file);
                  }}
                />
              )}

              {editingGallery && (
                <p className="text-xs text-gray-500">Foto tidak bisa diubah</p>
              )}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Processing..."
                  : editingGallery
                    ? "Update"
                    : "Create"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {galleries.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada data</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {galleries.map((g) => (
            <Card key={g.id}>
              <div className="relative h-48">
                <Image
                  src={g.imageUrl}
                  alt={g.title}
                  fill
                  className="object-cover"
                />
              </div>

              <CardContent className="pt-4 space-y-2">
                <h3 className="font-bold">{g.title}</h3>
                <p className="text-sm text-gray-500">{g.description || "-"}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(g)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(g.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
