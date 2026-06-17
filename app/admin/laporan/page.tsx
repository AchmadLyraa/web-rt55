"use client";

import { useState, useEffect } from "react";
import {
  getTransactionsPaginated,
  getTransactionSummary,
  createTransaction,
  deleteTransaction,
} from "@/app/actions/transaction";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export default function AdminLaporanPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    type: "PEMASUKAN" as "PEMASUKAN" | "PENGELUARAN",
    title: "",
    description: "",
    amount: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    loadSummary();
  }, []);
  useEffect(() => {
    loadTransactions(page);
  }, [page]);

  async function loadSummary() {
    const r = await getTransactionSummary();
    if (r.success) setSummary(r.data as any);
  }

  async function loadTransactions(p: number) {
    setIsLoading(true);
    const r = await getTransactionsPaginated(p);
    if (r.success) {
      setTransactions(r.data);
      setTotalPages(r.pagination.totalPages);
    }
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await createTransaction({
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      amount: formData.amount,
      date: formData.date,
    });
    if (result.success) {
      await loadTransactions(1);
      await loadSummary();
      setPage(1);
      setFormData({
        type: "PEMASUKAN",
        title: "",
        description: "",
        amount: "",
        date: format(new Date(), "yyyy-MM-dd"),
      });
      setShowForm(false);
    } else setError(result.error || "Gagal menyimpan");
    setIsSubmitting(false);
  }

  async function handleDelete(transId: string) {
    if (!confirm("Yakin hapus?")) return;
    const result = await deleteTransaction(transId);
    if (result.success) {
      await loadTransactions(page);
      await loadSummary();
    } else setError(result.error || "Gagal menghapus");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Laporan Keuangan
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola transaksi kas RT
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-xs"
        >
          {showForm ? "Batal" : "+ Input Transaksi"}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Pemasukan",
            value: summary.totalPemasukan,
            color: "text-green-600 border-green-200 bg-green-50",
          },
          {
            label: "Pengeluaran",
            value: summary.totalPengeluaran,
            color: "text-red-600 border-red-200 bg-red-50",
          },
          {
            label: "Saldo",
            value: summary.balance,
            color: `${summary.balance >= 0 ? "text-blue-600 border-blue-200 bg-blue-50" : "text-orange-600 border-orange-200 bg-orange-50"}`,
          },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg border p-4 ${s.color}`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-base font-bold ${s.color.split(" ")[0]}`}>
              {fmt(s.value)}
            </p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            Input Transaksi Baru
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Tipe</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900 text-sm"
                disabled={isSubmitting}
              >
                <option value="PEMASUKAN">Pemasukan</option>
                <option value="PENGELUARAN">Pengeluaran</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Tanggal
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="bg-white border-gray-300 text-gray-900 text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Judul</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Iuran Warga"
                required
                className="bg-white border-gray-300 text-gray-900 text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">
                Jumlah (Rp)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="0"
                required
                className="bg-white border-gray-300 text-gray-900 text-sm"
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-600 mb-1 block">
                Keterangan
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
                className="bg-white border-gray-300 text-gray-900 text-sm resize-none"
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-xs"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-sm text-center py-10">Memuat...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          Belum ada transaksi
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">
                    Tanggal
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">
                    Jenis
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">
                    Keterangan
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-medium text-gray-500">
                    Jumlah
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(t.date), "d MMM yyyy", { locale: id })}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${t.type === "PEMASUKAN" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                      >
                        {t.type === "PEMASUKAN" ? "↑ Masuk" : "↓ Keluar"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900">{t.title}</p>
                      {t.description && (
                        <p className="text-xs text-gray-400">{t.description}</p>
                      )}
                    </td>
                    <td
                      className={`py-3 px-4 text-right text-sm font-semibold ${t.type === "PEMASUKAN" ? "text-green-600" : "text-red-600"}`}
                    >
                      {t.type === "PEMASUKAN" ? "+" : "-"}
                      {fmt(t.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                      >
                        Hapus
                      </button>
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
