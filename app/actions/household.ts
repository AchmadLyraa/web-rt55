"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deletePublicFile } from "@/lib/file";

const householdSchema = z.object({
  nomorRumah: z.string().optional(),
  namaPemilikRumah: z.string().optional(),
  kepalaKeluarga: z.string().min(1, "Nama kepala keluarga wajib diisi"),
  jumlahKK: z.number().int().min(1, "Jumlah KK minimal 1"),
  statusWarga: z.enum(["WARGA_ASLI", "PENDATANG_KK_RT55", "PENDATANG_KK_LUAR"]),
  noTelepon: z.string().optional(),
  fotoRumah: z.string().optional(),
  koordinat: z.string().optional(),
  blok: z.string().optional(),
});

export async function getWargaStatistics() {
  try {
    const [totalRumah, totalWargaAsli, totalPendatangRT55, totalPendatangLuar] =
      await Promise.all([
        prisma.household.count(),
        prisma.household.count({ where: { statusWarga: "WARGA_ASLI" } }),
        prisma.household.count({ where: { statusWarga: "PENDATANG_KK_RT55" } }),
        prisma.household.count({ where: { statusWarga: "PENDATANG_KK_LUAR" } }),
      ]);

    return {
      success: true,
      data: {
        totalRumah,
        totalWargaAsli,
        totalPendatangRT55,
        totalPendatangLuar,
      },
    };
  } catch (error) {
    console.error("[v0] Error fetching warga stats:", error);
    return {
      success: false,
      error: "Gagal mengambil statistik warga",
      data: {
        totalRumah: 0,
        totalWargaAsli: 0,
        totalPendatangRT55: 0,
        totalPendatangLuar: 0,
      },
    };
  }
}

export async function createHousehold(data: z.infer<typeof householdSchema>) {
  try {
    await requireAdmin();
    const validated = householdSchema.parse(data);
    const household = await prisma.household.create({ data: validated });
    revalidatePath("/admin/warga");
    revalidatePath("/");
    return { success: true, data: household };
  } catch (error) {
    console.error("[v0] Error creating household:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal membuat data warga baru" };
  }
}

export async function updateHousehold(
  id: string,
  data: z.infer<typeof householdSchema>,
) {
  try {
    await requireAdmin();
    const validated = householdSchema.parse(data);

    const existing = await prisma.household.findUnique({ where: { id } });
    if (existing?.fotoRumah && existing.fotoRumah !== validated.fotoRumah) {
      await deletePublicFile(existing.fotoRumah);
    }

    const household = await prisma.household.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/admin/warga");
    revalidatePath("/");
    return { success: true, data: household };
  } catch (error) {
    console.error("[v0] Error updating household:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal mengupdate data warga" };
  }
}

export async function deleteHousehold(id: string) {
  try {
    await requireAdmin();
    const existing = await prisma.household.findUnique({ where: { id } });
    await deletePublicFile(existing?.fotoRumah);

    const household = await prisma.household.delete({ where: { id } });
    revalidatePath("/admin/warga");
    revalidatePath("/");
    return { success: true, data: household };
  } catch (error) {
    console.error("[v0] Error deleting household:", error);
    return { success: false, error: "Gagal menghapus data warga" };
  }
}

export async function getHouseholdsPaginated(
  page: number = 1,
  limit: number = 15,
  search: string = "",
) {
  try {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              kepalaKeluarga: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              namaPemilikRumah: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              nomorRumah: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              noTelepon: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const [households, total] = await Promise.all([
      prisma.household.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.household.count({ where }),
    ]);

    return {
      success: true,
      data: households,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        total,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Gagal mengambil data warga",
    };
  }
}
