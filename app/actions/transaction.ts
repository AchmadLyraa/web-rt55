"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const transactionSchema = z.object({
  type: z.enum(["PEMASUKAN", "PENGELUARAN"]),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  amount: z.string().transform((val) => parseFloat(val)),
  date: z.string().transform((val) => new Date(val)),
});

const ITEMS_PER_PAGE = 20;

export async function getTransactions(filters?: {
  type?: "PEMASUKAN" | "PENGELUARAN";
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const whereCondition: any = {};

    if (filters?.type) {
      whereCondition.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      whereCondition.date = {};
      if (filters.startDate) whereCondition.date.gte = filters.startDate;
      if (filters.endDate) whereCondition.date.lte = filters.endDate;
    }

    const transactions = await prisma.cashTransaction.findMany({
      where: whereCondition,
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return {
      success: true,
      data: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
    };
  } catch (error) {
    console.error("[v0] Error getting transactions:", error);
    return { success: false, error: "Gagal mengambil data transaksi" };
  }
}

export async function getTransactionsPaginated(
  page: number = 1,
  filters?: {
    type?: "PEMASUKAN" | "PENGELUARAN";
    startDate?: Date;
    endDate?: Date;
  },
) {
  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const whereCondition: any = {};

    if (filters?.type) {
      whereCondition.type = filters.type;
    }

    if (filters?.startDate || filters?.endDate) {
      whereCondition.date = {};
      if (filters.startDate) whereCondition.date.gte = filters.startDate;
      if (filters.endDate) whereCondition.date.lte = filters.endDate;
    }

    const [transactions, total] = await Promise.all([
      prisma.cashTransaction.findMany({
        where: whereCondition,
        include: {
          createdBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: { date: "desc" },
        skip,
        take: ITEMS_PER_PAGE,
      }),
      prisma.cashTransaction.count({ where: whereCondition }),
    ]);

    return {
      success: true,
      data: transactions.map((t) => ({ ...t, amount: Number(t.amount) })),
      pagination: {
        page,
        totalItems: total,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        hasNext: page < Math.ceil(total / ITEMS_PER_PAGE),
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("[v0] Error getting transactions paginated:", error);
    return { success: false, error: "Gagal mengambil data transaksi" };
  }
}

export async function getTransactionSummary(startDate?: Date, endDate?: Date) {
  try {
    const whereCondition: any = {};

    if (startDate || endDate) {
      whereCondition.date = {};
      if (startDate) whereCondition.date.gte = startDate;
      if (endDate) whereCondition.date.lte = endDate;
    }

    const [pemasukan, pengeluaran] = await Promise.all([
      prisma.cashTransaction.aggregate({
        where: { ...whereCondition, type: "PEMASUKAN" },
        _sum: { amount: true },
      }),
      prisma.cashTransaction.aggregate({
        where: { ...whereCondition, type: "PENGELUARAN" },
        _sum: { amount: true },
      }),
    ]);

    const totalPemasukan = Number(pemasukan._sum.amount || 0);
    const totalPengeluaran = Number(pengeluaran._sum.amount || 0);

    return {
      success: true,
      data: {
        totalPemasukan,
        totalPengeluaran,
        balance: totalPemasukan - totalPengeluaran,
      },
    };
  } catch (error) {
    console.error("[v0] Error getting transaction summary:", error);
    return { success: false, error: "Gagal mengambil ringkasan transaksi" };
  }
}

export async function createTransaction(
  data: z.infer<typeof transactionSchema>,
) {
  try {
    const session = await requireAdmin();
    const validated = transactionSchema.parse(data);

    const transaction = await prisma.cashTransaction.create({
      data: {
        ...validated,
        createdById: session.user.id!,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    revalidatePath("/laporan");
    revalidatePath("/admin/laporan");

    return {
      success: true,
      data: { ...transaction, amount: Number(transaction.amount) },
    };
  } catch (error) {
    console.error("[v0] Error creating transaction:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal membuat transaksi baru" };
  }
}

export async function deleteTransaction(id: string) {
  try {
    await requireAdmin();

    const transaction = await prisma.cashTransaction.delete({ where: { id } });

    revalidatePath("/laporan");
    revalidatePath("/admin/laporan");

    return {
      success: true,
      data: { ...transaction, amount: Number(transaction.amount) },
    };
  } catch (error) {
    console.error("[v0] Error deleting transaction:", error);
    return { success: false, error: "Gagal menghapus transaksi" };
  }
}
