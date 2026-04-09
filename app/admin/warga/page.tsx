"use client";

import { useState, useEffect } from "react";
import {
  getHouseholds,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} from "@/app/actions/household";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Household {
  id: string;
  kepalaKeluargaNama: string;
  nomorRumah?: string;
  noTelepon?: string;
  totalLakiLaki: number;
  totalPerempuan: number;
  totalKendaraan: number;
  createdAt: string;
}

export default function WargaPage() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    kepalaKeluargaNama: "",
    nomorRumah: "",
    noTelepon: "",
    totalLakiLaki: 0,
    totalPerempuan: 0,
    totalKendaraan: 0,
  });

  useEffect(() => {
    loadHouseholds();
  }, []);

  async function loadHouseholds() {
    try {
      setLoading(true);
      const result = await getHouseholds();
      if (result.success && result.data) {
        setHouseholds(result.data);
      }
    } catch (err) {
      setError("Gagal memuat data warga");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        const result = await updateHousehold(editingId, {
          kepalaKeluargaNama: formData.kepalaKeluargaNama,
          nomorRumah: formData.nomorRumah || undefined,
          noTelepon: formData.noTelepon || undefined,
          totalLakiLaki: formData.totalLakiLaki,
          totalPerempuan: formData.totalPerempuan,
          totalKendaraan: formData.totalKendaraan,
        });

        if (result.success) {
          setSuccess("Data warga berhasil diupdate");
          setEditingId(null);
          resetForm();
          await loadHouseholds();
        } else {
          setError(result.error || "Gagal mengupdate data");
        }
      } else {
        const result = await createHousehold({
          kepalaKeluargaNama: formData.kepalaKeluargaNama,
          nomorRumah: formData.nomorRumah || undefined,
          noTelepon: formData.noTelepon || undefined,
          totalLakiLaki: formData.totalLakiLaki,
          totalPerempuan: formData.totalPerempuan,
          totalKendaraan: formData.totalKendaraan,
        });

        if (result.success) {
          setSuccess("Data warga berhasil ditambahkan");
          resetForm();
          await loadHouseholds();
        } else {
          setError(result.error || "Gagal membuat data");
        }
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan data");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  function resetForm() {
    setFormData({
      kepalaKeluargaNama: "",
      nomorRumah: "",
      noTelepon: "",
      totalLakiLaki: 0,
      totalPerempuan: 0,
      totalKendaraan: 0,
    });
  }

  function handleEdit(household: Household) {
    setEditingId(household.id);
    setFormData({
      kepalaKeluargaNama: household.kepalaKeluargaNama,
      nomorRumah: household.nomorRumah || "",
      noTelepon: household.noTelepon || "",
      totalLakiLaki: household.totalLakiLaki,
      totalPerempuan: household.totalPerempuan,
      totalKendaraan: household.totalKendaraan,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus data warga ini?")) return;

    try {
      const result = await deleteHousehold(id);
      if (result.success) {
        setSuccess("Data warga berhasil dihapus");
        await loadHouseholds();
      } else {
        setError(result.error || "Gagal menghapus data");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghapus data");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/admin">
          <Button variant="outline" className="mb-4">
            ← Kembali
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">Data Warga</h1>
        <p className="text-muted-foreground mt-2">
          Kelola data kepala keluarga dan statistik warga
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Data Warga" : "Tambah Data Warga"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Kepala Keluarga *
                </label>
                <Input
                  type="text"
                  value={formData.kepalaKeluargaNama}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kepalaKeluargaNama: e.target.value,
                    })
                  }
                  placeholder="Nama lengkap"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Rumah
                </label>
                <Input
                  type="text"
                  value={formData.nomorRumah}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nomorRumah: e.target.value,
                    })
                  }
                  placeholder="Nomor rumah atau alamat"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nomor Telepon
                </label>
                <Input
                  type="tel"
                  value={formData.noTelepon}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noTelepon: e.target.value,
                    })
                  }
                  placeholder="Nomor telepon"
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-1">
                  Total Laki-laki
                </label>
                <Input
                  type="number"
                  value={formData.totalLakiLaki}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalLakiLaki: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Perempuan
                </label>
                <Input
                  type="number"
                  value={formData.totalPerempuan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalPerempuan: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Kendaraan
                </label>
                <Input
                  type="number"
                  value={formData.totalKendaraan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalKendaraan: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSaving || !formData.kepalaKeluargaNama}
                  className="flex-1"
                >
                  {isSaving ? "Menyimpan..." : editingId ? "Update" : "Tambah"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      resetForm();
                    }}
                  >
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                Daftar Warga ({households.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center text-muted-foreground">
                Memuat data...
              </div>
            ) : households.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                Belum ada data warga
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">
                        Nama KK
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Nomor Rumah
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        Laki
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        Perempuan
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        Kendaraan
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {households.map((household) => (
                      <tr
                        key={household.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {household.kepalaKeluargaNama}
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {household.nomorRumah || "-"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {household.totalLakiLaki}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {household.totalPerempuan}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {household.totalKendaraan}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(household)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(household.id)}
                            >
                              Hapus
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
