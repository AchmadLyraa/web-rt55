"use client";

import { useState, useEffect } from "react";
import { getHomepage, updateHomepage } from "@/app/actions/homepage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function AdminHomepagePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    rtName: "",
    sambutan: "",
    visi: "",
    misi: "",
    bannerUrl: "",
    heroImageUrl: "",
    ketuaRtName: "",
    ketuaRtPhotoUrl: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getHomepage();
        if (result.success && result.data) {
          setFormData({
            rtName: result.data.rtName,
            sambutan: result.data.sambutan,
            visi: result.data.visi,
            misi: result.data.misi,
            bannerUrl: result.data.bannerUrl || "",
            heroImageUrl: result.data.heroImageUrl || "",
            ketuaRtName: result.data.ketuaRtName || "",
            ketuaRtPhotoUrl: result.data.ketuaRtPhotoUrl || "",
          });
        }
      } catch (err) {
        console.error("[v0] Error loading homepage:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleUploadFile(
    file: File,
    fieldName: "bannerUrl" | "heroImageUrl" | "ketuaRtPhotoUrl",
  ) {
    try {
      setUploadProgress(0);
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("category", "homepage");

      console.log("[v0] Uploading file:", file.name, "for field:", fieldName);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      console.log("[v0] Upload successful:", data.fileUrl);
      setFormData({ ...formData, [fieldName]: data.fileUrl });
      setUploadProgress(100);
    } catch (err) {
      console.error("[v0] Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload gagal");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("[v0] Saving homepage");
      const result = await updateHomepage(formData);

      if (result.success) {
        setSuccess(true);
        console.log("[v0] Homepage saved successfully");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Gagal menyimpan");
      }
    } catch (err) {
      console.error("[v0] Error saving:", err);
      setError("Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Kelola Beranda</h1>
        <p className="text-muted-foreground">Edit konten beranda website RT</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Informasi Beranda</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-950/20 text-green-400 px-3 py-2 rounded-md text-sm">
                Berhasil disimpan!
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Nama RT</label>
              <Input
                value={formData.rtName}
                onChange={(e) =>
                  setFormData({ ...formData, rtName: e.target.value })
                }
                placeholder="Contoh: RT 55"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sambutan</label>
              <Textarea
                value={formData.sambutan}
                onChange={(e) =>
                  setFormData({ ...formData, sambutan: e.target.value })
                }
                placeholder="Sambutan untuk warga..."
                rows={4}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Visi</label>
              <Textarea
                value={formData.visi}
                onChange={(e) =>
                  setFormData({ ...formData, visi: e.target.value })
                }
                placeholder="Visi RT..."
                rows={4}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Misi</label>
              <Textarea
                value={formData.misi}
                onChange={(e) =>
                  setFormData({ ...formData, misi: e.target.value })
                }
                placeholder="Misi RT..."
                rows={4}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Hero Image (Halaman Utama)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      handleUploadFile(file, "heroImageUrl");
                    }
                  }}
                  disabled={isSaving}
                  className="block w-full text-sm"
                />
                {formData.heroImageUrl && (
                  <div className="text-sm text-muted-foreground">
                    ✓ Hero image sudah diupload: {formData.heroImageUrl}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Ketua RT</label>
              <Input
                value={formData.ketuaRtName}
                onChange={(e) =>
                  setFormData({ ...formData, ketuaRtName: e.target.value })
                }
                placeholder="Nama ketua RT..."
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Foto Ketua RT</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      handleUploadFile(file, "ketuaRtPhotoUrl");
                    }
                  }}
                  disabled={isSaving}
                  className="block w-full text-sm"
                />
                {formData.ketuaRtPhotoUrl && (
                  <div className="text-sm text-muted-foreground">
                    ✓ Foto ketua RT sudah diupload: {formData.ketuaRtPhotoUrl}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
