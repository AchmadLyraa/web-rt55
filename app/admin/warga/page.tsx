"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  getHouseholdsPaginated,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} from "@/app/actions/household";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<string, string> = {
  WARGA_ASLI: "Warga Asli",
  PENDATANG_KK_RT55: "KK RT 55",
  PENDATANG_KK_LUAR: "KK Luar",
};

const STATUS_COLOR: Record<string, string> = {
  WARGA_ASLI: "bg-green-100 text-green-700",
  PENDATANG_KK_RT55: "bg-blue-100 text-blue-700",
  PENDATANG_KK_LUAR: "bg-orange-100 text-orange-700",
};

interface Household {
  id: string;
  nomorRumah?: string | null;
  namaPemilikRumah?: string | null;
  kepalaKeluarga: string;
  jumlahKK: number;
  statusWarga: "WARGA_ASLI" | "PENDATANG_KK_RT55" | "PENDATANG_KK_LUAR";
  noTelepon?: string | null;
  fotoRumah?: string | null;
  koordinat?: string | null;
  blok?: string | null;
}

const defaultForm = {
  nomorRumah: "",
  namaPemilikRumah: "",
  kepalaKeluarga: "",
  jumlahKK: 1,
  statusWarga: "WARGA_ASLI" as const,
  noTelepon: "",
  fotoRumah: "",
  koordinat: "",
  blok: "",
};

export default function WargaPage() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHouseholds(page);
  }, [page]);

  async function loadHouseholds(p: number, keyword: string = "") {
    setLoading(true);

    const result = await getHouseholdsPaginated(p, 15, keyword);

    if (result.success) {
      setHouseholds(result.data as any);
      setTotalPages(result.pagination.totalPages);
      setTotal(result.pagination.total);
    }

    setLoading(false);
  }

  async function handleUploadFoto(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "household");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setError("Upload gagal");
      return;
    }
    const data = await res.json();
    setFormData((prev) => ({ ...prev, fotoRumah: data.fileUrl }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const payload = {
      nomorRumah: formData.nomorRumah || undefined,
      namaPemilikRumah: formData.namaPemilikRumah || undefined,
      kepalaKeluarga: formData.kepalaKeluarga,
      jumlahKK: formData.jumlahKK,
      statusWarga: formData.statusWarga,
      noTelepon: formData.noTelepon || undefined,
      fotoRumah: formData.fotoRumah || undefined,
      koordinat: formData.koordinat || undefined,
      blok: formData.blok || undefined,
    };
    const result = editingId
      ? await updateHousehold(editingId, payload)
      : await createHousehold(payload);
    if (result.success) {
      setEditingId(null);
      setShowForm(false);
      setFormData(defaultForm);
      if (!editingId) setPage(1);
      await loadHouseholds(editingId ? page : 1);
    } else setError(result.error || "Gagal menyimpan");
    setIsSaving(false);
  }

  function handleEdit(h: Household) {
    setEditingId(h.id);
    setFormData({
      nomorRumah: h.nomorRumah || "",
      namaPemilikRumah: h.namaPemilikRumah || "",
      kepalaKeluarga: h.kepalaKeluarga,
      jumlahKK: h.jumlahKK,
      statusWarga: h.statusWarga,
      noTelepon: h.noTelepon || "",
      fotoRumah: h.fotoRumah || "",
      koordinat: h.koordinat || "",
      blok: h.blok || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus?")) return;
    const result = await deleteHousehold(id);
    if (result.success) await loadHouseholds(page);
    else setError(result.error || "Gagal menghapus");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Data Warga</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {total} rumah terdaftar
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData(defaultForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-xs"
        >
          {showForm ? "Batal" : "+ Tambah Data"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            {editingId ? "Edit Data Warga" : "Tambah Data Warga"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {[
              { label: "No. Rumah", key: "nomorRumah", placeholder: "No. 1" },
              { label: "Blok", key: "blok", placeholder: "A" },
              {
                label: "Nama Pemilik Rumah",
                key: "namaPemilikRumah",
                placeholder: "Nama pemilik",
              },
              {
                label: "Kepala Keluarga *",
                key: "kepalaKeluarga",
                placeholder: "Nama KK",
                required: true,
              },
              { label: "Nomor Telepon", key: "noTelepon", placeholder: "08xx" },
              {
                label: "Koordinat",
                key: "koordinat",
                placeholder: "-0.5020, 117.1536",
              },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 mb-1 block">
                  {f.label}
                </label>
                <Input
                  value={(formData as any)[f.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [f.key]: e.target.value })
                  }
                  placeholder={f.placeholder}
                  required={f.required}
                  className="bg-white border-gray-300 text-gray-900 text-sm"
                  disabled={isSaving}
                />
              </div>
            ))}

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Jumlah KK
              </label>
              <Input
                type="number"
                min={1}
                value={formData.jumlahKK}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jumlahKK: parseInt(e.target.value) || 1,
                  })
                }
                className="bg-white border-gray-300 text-gray-900 text-sm"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Status Warga
              </label>
              <select
                value={formData.statusWarga}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    statusWarga: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900 text-sm"
                disabled={isSaving}
              >
                <option value="WARGA_ASLI">Warga Asli</option>
                <option value="PENDATANG_KK_RT55">Pendatang KK RT 55</option>
                <option value="PENDATANG_KK_LUAR">Pendatang KK Luar</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Foto Rumah
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadFoto(f);
                }}
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700"
                disabled={isSaving}
              />
              {formData.fotoRumah && (
                <p className="text-xs text-green-600 mt-1">✓ Foto siap</p>
              )}
            </div>

            <div className="md:col-span-3 flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-xs"
              >
                {isSaving ? "Menyimpan..." : editingId ? "Update" : "Tambah"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setShowForm(false);
                    setFormData(defaultForm);
                  }}
                  className="text-xs border-gray-300 text-gray-600"
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <Input
          placeholder="Cari kepala keluarga, pemilik, nomor rumah..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm text-center py-10">Memuat...</p>
      ) : households.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          Belum ada data warga
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-zinc-400">
                    Foto
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-zinc-400">
                    No/Blok
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-zinc-400">
                    Kepala Keluarga
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-zinc-400 hidden md:table-cell">
                    Pemilik
                  </th>
                  <th className="text-center py-2.5 px-4 text-xs font-medium text-zinc-400 hidden md:table-cell">
                    KK
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-zinc-400">
                    Status
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-zinc-400 hidden lg:table-cell">
                    Telepon
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-zinc-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {households.map((h) => (
                  <tr
                    key={h.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {h.fotoRumah ? (
                        <div className="relative w-8 h-8 rounded overflow-hidden border border-zinc-700">
                          <Image
                            src={h.fotoRumah}
                            alt={h.kepalaKeluarga}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <span className="text-zinc-600 text-xs">-</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-900">
                      {h.nomorRumah || "-"}
                      {h.blok ? ` / ${h.blok}` : ""}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-zinc-900">
                      {h.kepalaKeluarga}
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-900 hidden md:table-cell">
                      {h.namaPemilikRumah || "-"}
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-zinc-900 hidden md:table-cell">
                      {h.jumlahKK}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLOR[h.statusWarga]}`}
                      >
                        {STATUS_LABEL[h.statusWarga]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-900 hidden lg:table-cell">
                      {h.noTelepon || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleEdit(h)}
                          className="text-xs px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
                          className="text-xs px-2 py-1 rounded bg-red-950/90 hover:bg-red-900 text-zinc-200 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          className={`px-2 py-1 rounded text-xs transition-colors ${
            p === page
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
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
