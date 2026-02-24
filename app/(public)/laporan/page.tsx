'use client';

import { useState, useEffect } from 'react';
import { getTransactions, getTransactionSummary } from '@/app/actions/transaction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface Transaction {
  id: string;
  type: 'PEMASUKAN' | 'PENGELUARAN';
  title: string;
  description?: string;
  amount: number;
  date: Date;
  createdBy: {
    id: string;
    name: string;
  };
}

export default function LaporanPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('[v0] Loading transactions and summary');
        const [transResult, sumResult] = await Promise.all([
          getTransactions(),
          getTransactionSummary(),
        ]);

        if (transResult.success) {
          setTransactions(transResult.data as any);
        }

        if (sumResult.success) {
          setSummary(sumResult.data as any);
        }
      } catch (error) {
        console.error('[v0] Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Laporan Keuangan</h1>
        <p className="text-muted-foreground">
          Transparansi keuangan RT 55 untuk semua warga
        </p>
      </div>

      {/* Summary Cards */}
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
            <p className={`text-2xl font-bold ${
              summary.balance >= 0 ? 'text-blue-400' : 'text-orange-400'
            }`}>
              {formatCurrency(summary.balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : transactions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Belum ada transaksi
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-2">Tanggal</th>
                    <th className="text-left py-3 px-2">Jenis</th>
                    <th className="text-left py-3 px-2">Keterangan</th>
                    <th className="text-left py-3 px-2">Jumlah</th>
                    <th className="text-left py-3 px-2">Oleh</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trans) => (
                    <tr
                      key={trans.id}
                      className="border-b border-border hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3 px-2 text-xs">
                        {format(new Date(trans.date), 'd MMM yyyy', { locale: id })}
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
                      <td className={`py-3 px-2 font-semibold ${
                        trans.type === 'PEMASUKAN'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {trans.type === 'PEMASUKAN' ? '+' : '-'}
                        {formatCurrency(trans.amount)}
                      </td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">
                        {trans.createdBy.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
