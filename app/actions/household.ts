"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const householdSchema = z.object({
  kepalaKeluargaNama: z.string().min(1, "Nama kepala keluarga wajib diisi"),
  nomorRumah: z.string().optional(),
  noTelepon: z.string().optional(),
  totalLakiLaki: z.number().int().min(0, "Total laki-laki minimal 0"),
  totalPerempuan: z.number().int().min(0, "Total perempuan minimal 0"),
  totalKendaraan: z.number().int().min(0, "Total kendaraan minimal 0"),
});

// Get all households (admin only)
export async function getHouseholds() {
  try {
    const households = await prisma.household.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: households };
  } catch (error) {
    console.error("[v0] Error fetching households:", error);
    return { success: false, error: "Gagal mengambil data warga" };
  }
}

// Get warga statistics for homepage
export async function getWargaStatistics() {
  try {
    const households = await prisma.household.findMany();

    const stats = {
      totalKepalaKeluarga: households.length,
      totalLakiLaki: households.reduce((sum, h) => sum + h.totalLakiLaki, 0),
      totalPerempuan: households.reduce((sum, h) => sum + h.totalPerempuan, 0),
      totalKendaraan: households.reduce((sum, h) => sum + h.totalKendaraan, 0),
      totalRumah: households.length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("[v0] Error fetching warga stats:", error);
    return {
      success: false,
      error: "Gagal mengambil statistik warga",
      data: {
        totalKepalaKeluarga: 0,
        totalLakiLaki: 0,
        totalPerempuan: 0,
        totalKendaraan: 0,
        totalRumah: 0,
      },
    };
  }
}

// Create household (admin only)
export async function createHousehold(data: z.infer<typeof householdSchema>) {
  try {
    await requireAdmin();
    const validated = householdSchema.parse(data);

    const household = await prisma.household.create({
      data: validated,
    });

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

// Update household (admin only)
export async function updateHousehold(
  id: string,
  data: z.infer<typeof householdSchema>,
) {
  try {
    await requireAdmin();
    const validated = householdSchema.parse(data);

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

// Delete household (admin only)
export async function deleteHousehold(id: string) {
  try {
    await requireAdmin();

    const household = await prisma.household.delete({
      where: { id },
    });

    revalidatePath("/admin/warga");
    revalidatePath("/");

    return { success: true, data: household };
  } catch (error) {
    console.error("[v0] Error deleting household:", error);
    return { success: false, error: "Gagal menghapus data warga" };
  }
}
