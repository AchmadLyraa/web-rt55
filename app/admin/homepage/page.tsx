"use client";

import { useState, useEffect } from "react";
import { getHomepage, updateHomepage } from "@/app/actions/homepage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AdminHomepagePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
      const result = await getHomepage();
      if (result.success && result.data) {
        const hp = result.data.homepage;
        setFormData({
          rtName: hp?.rtName ?? "",
          sambutan: hp?.sambutan ?? "",
          visi: hp?.visi ?? "",
          misi: hp?.misi ?? "",
          bannerUrl: hp?.bannerUrl ?? "",
          heroImageUrl: hp?.heroImageUrl ?? "",
          ketuaRtName: hp?.ketuaRtName ?? "",
          ketuaRtPhotoUrl: hp?.ketuaRtPhotoUrl ?? "",
        });
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  async function handleUploadFile(
    file: File,
    fieldName: "bannerUrl" | "heroImageUrl" | "ketuaRtPhotoUrl",
  ) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "homepage");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload gagal");
      const data = await res.json();
      setFormData((prev) => ({ ...prev, [fieldName]: data.fileUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const result = await updateHomepage(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || "Gagal menyimpan");
    }
    setIsSaving(false);
  }

  if (isLoading)
    return (
      <div className="text-gray-400 text-sm py-10 text-center">Memuat...</div>
    );

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Kelola Beranda</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Edit konten yang tampil di halaman utama
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-3 py-2 rounded bg-green-50 border border-green-200 text-green-600 text-xs">
          Berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nama RT">
          <Input
            value={formData.rtName}
            onChange={(e) =>
              setFormData({ ...formData, rtName: e.target.value })
            }
            placeholder="RT 55"
            className="bg-white border-gray-300 text-gray-900"
            disabled={isSaving}
          />
        </Field>

        <Field label="Sambutan">
          <Textarea
            value={formData.sambutan}
            onChange={(e) =>
              setFormData({ ...formData, sambutan: e.target.value })
            }
            rows={3}
            className="bg-white border-gray-300 text-gray-900 resize-none"
            disabled={isSaving}
          />
        </Field>

        <Field label="Visi">
          <Textarea
            value={formData.visi}
            onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
            rows={3}
            className="bg-white border-gray-300 text-gray-900 resize-none"
            disabled={isSaving}
          />
        </Field>

        <Field label="Misi">
          <Textarea
            value={formData.misi}
            onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
            rows={3}
            className="bg-white border-gray-300 text-gray-900 resize-none"
            disabled={isSaving}
          />
        </Field>

        <div className="border-t border-gray-200 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Hero Image">
            <UploadField
              currentUrl={formData.heroImageUrl}
              onChange={(file) => handleUploadFile(file, "heroImageUrl")}
              disabled={isSaving}
            />
          </Field>

          <Field label="Nama Ketua RT">
            <Input
              value={formData.ketuaRtName}
              onChange={(e) =>
                setFormData({ ...formData, ketuaRtName: e.target.value })
              }
              placeholder="Nama ketua RT"
              className="bg-white border-gray-300 text-gray-900"
              disabled={isSaving}
            />
          </Field>

          <Field label="Foto Ketua RT">
            <UploadField
              currentUrl={formData.ketuaRtPhotoUrl}
              onChange={(file) => handleUploadFile(file, "ketuaRtPhotoUrl")}
              disabled={isSaving}
            />
          </Field>
        </div>

        <Button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function UploadField({
  currentUrl,
  onChange,
  disabled,
}: {
  currentUrl: string;
  onChange: (f: File) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-2">
      {currentUrl && (
        <div className="relative w-full h-24 rounded overflow-hidden border border-gray-200">
          <Image src={currentUrl} alt="preview" fill className="object-cover" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.currentTarget.files?.[0];
          if (f) onChange(f);
        }}
        disabled={disabled}
        className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />
    </div>
  );
}
