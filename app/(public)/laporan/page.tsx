"use client";

import { useState, useEffect } from "react";
import {
  getTransactions,
  getTransactionSummary,
} from "@/app/actions/transaction";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Transaction {
  id: string;
  type: "PEMASUKAN" | "PENGELUARAN";
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
        console.log("[v0] Loading transactions and summary");
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
        console.error("[v0] Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const formatCurrency = (amount: number | bigint) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Laporan Keuangan</h1>
          <p className="text-xl text-purple-100">
            Transparansi penuh atas keuangan RT untuk kepercayaan warga
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Pemasukan */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Pemasukan</h3>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(summary.totalPemasukan)}
            </p>
          </div>

          {/* Pengeluaran */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Pengeluaran</h3>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(summary.totalPengeluaran)}
            </p>
          </div>

          {/* Saldo */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Saldo</h3>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  summary.balance >= 0 ? "bg-blue-100" : "bg-orange-100"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    summary.balance >= 0 ? "text-blue-600" : "text-orange-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p
              className={`text-3xl font-bold ${
                summary.balance >= 0 ? "text-blue-600" : "text-orange-600"
              }`}
            >
              {formatCurrency(summary.balance)}
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Rincian Transaksi
            </h2>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-gray-500">Memuat data...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500">Belum ada transaksi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Tanggal
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Jenis
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Keterangan
                      </th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        Jumlah
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Oleh
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trans) => (
                      <tr
                        key={trans.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {format(new Date(trans.date), "d MMM yyyy", {
                            locale: id,
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              trans.type === "PEMASUKAN"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {trans.type === "PEMASUKAN"
                              ? "↑ Masuk"
                              : "↓ Keluar"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {trans.title}
                            </p>
                            {trans.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {trans.description}
                              </p>
                            )}
                          </div>
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-semibold ${
                            trans.type === "PEMASUKAN"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {trans.type === "PEMASUKAN" ? "+" : "-"}
                          {formatCurrency(trans.amount)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600">
                          {trans.createdBy.name}
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
