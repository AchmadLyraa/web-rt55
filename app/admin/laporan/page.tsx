'use client';

import { useState, useEffect } from 'react';
import {
  getTransactions,
  getTransactionSummary,
  createTransaction,
  deleteTransaction,
} from '@/app/actions/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

  const [formData, setFormData] = useState({
    type: 'PEMASUKAN' as 'PEMASUKAN' | 'PENGELUARAN',
    title: '',
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [transResult, sumResult] = await Promise.all([
        getTransactions(),
        getTransactionSummary(),
      ]);

      if (transResult.success) {
        setTransactions(transResult.data);
      }

      if (sumResult.success) {
        setSummary(sumResult.data);
      }
    } catch (err) {
      console.error('[v0] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createTransaction({
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
        amount: formData.amount,
        date: formData.date,
      });

      if (result.success) {
        setTransactions([result.data, ...transactions]);
        setFormData({
          type: 'PEMASUKAN',
          title: '',
          description: '',
          amount: '',
          date: format(new Date(), 'yyyy-MM-dd'),
        });
        setShowForm(false);
        
        // Reload summary
        const sumResult = await getTransactionSummary();
        if (sumResult.success) {
          setSummary(sumResult.data);
        }
      } else {
        setError(result.error || 'Gagal menyimpan');
      }
    } catch (err) {
      console.error('[v0] Error:', err);
      setError('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;

    try {
      const result = await deleteTransaction(id);
      if (result.success) {
        setTransactions(transactions.filter((t) => t.id !== id));
        
        // Reload summary
        const sumResult = await getTransactionSummary();
        if (sumResult.success) {
          setSummary(sumResult.data);
        }
      } else {
        setError(result.error || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('[v0] Error deleting:', err);
      setError('Terjadi kesalahan');
    }
  }

  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Kelola Laporan Keuangan</h1>
          <p className="text-muted-foreground">Input dan kelola transaksi kas RT</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Input Transaksi'}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-green-950/20 border-green-900/30">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(summary.totalPemasukan)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-950/20 border-red-900/30">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">
              {formatCurrency(summary.totalPengeluaran)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-950/20 border-blue-900/30">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-bold ${
                summary.balance >= 0 ? 'text-blue-400' : 'text-orange-400'
              }`}
            >
              {formatCurrency(summary.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Input Transaksi Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'PEMASUKAN' | 'PENGELUARAN',
                      })
                    }
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground text-sm"
                  >
                    <option value="PEMASUKAN">Pemasukan</option>
                    <option value="PENGELUARAN">Pengeluaran</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tanggal</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Judul</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Misal: Iuran Warga"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Keterangan</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Keterangan transaksi..."
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Jumlah (Rp)</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Belum ada transaksi. Mulai dengan input transaksi baru.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-2">Tanggal</th>
                    <th className="text-left py-3 px-2">Jenis</th>
                    <th className="text-left py-3 px-2">Keterangan</th>
                    <th className="text-left py-3 px-2">Jumlah</th>
                    <th className="text-left py-3 px-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trans) => (
                    <tr
                      key={trans.id}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-2 text-xs">
                        {format(new Date(trans.date), 'd MMM yyyy', {
                          locale: id,
                        })}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            trans.type === 'PEMASUKAN'
                              ? 'bg-green-950/30 text-green-400'
                              : 'bg-red-950/30 text-red-400'
                          }`}
                        >
                          {trans.type === 'PEMASUKAN' ? '↑ Masuk' : '↓ Keluar'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{trans.title}</p>
                          {trans.description && (
                            <p className="text-xs text-muted-foreground">
                              {trans.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td
                        className={`py-3 px-2 font-semibold ${
                          trans.type === 'PEMASUKAN'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {trans.type === 'PEMASUKAN' ? '+' : '-'}
                        {formatCurrency(trans.amount)}
                      </td>
                      <td className="py-3 px-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(trans.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
