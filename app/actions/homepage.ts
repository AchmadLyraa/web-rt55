"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deletePublicFile } from "@/lib/file";

const homepageSchema = z.object({
  rtName: z.string().min(1, "Nama RT wajib diisi"),
  sambutan: z.string().min(1, "Sambutan wajib diisi"),
  visi: z.string().min(1, "Visi wajib diisi"),
  misi: z.string().min(1, "Misi wajib diisi"),
  bannerUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  ketuaRtName: z.string().optional(),
  ketuaRtPhotoUrl: z.string().optional(),
});

export async function getHomepage() {
  try {
    const homepage = await prisma.homepage.findUnique({
      where: { id: "default" },
    });

    const galleryPreview = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    const households = await prisma.household.findMany({
      select: { statusWarga: true },
    });

    const wargaStats = {
      totalRumah: households.length,
      totalWargaAsli: households.filter((h) => h.statusWarga === "WARGA_ASLI")
        .length,
      totalPendatangRT55: households.filter(
        (h) => h.statusWarga === "PENDATANG_KK_RT55",
      ).length,
      totalPendatangLuar: households.filter(
        (h) => h.statusWarga === "PENDATANG_KK_LUAR",
      ).length,
    };

    return {
      success: true,
      data: {
        homepage,
        galleryPreview,
        wargaStats,
      },
    };
  } catch (error) {
    console.error("Error getting homepage:", error);
    return { success: false, error: "Gagal mengambil data homepage" };
  }
}

export async function updateHomepage(data: z.infer<typeof homepageSchema>) {
  try {
    await requireAdmin();
    const validated = homepageSchema.parse(data);

    const existing = await prisma.homepage.findUnique({
      where: { id: "default" },
    });

    if (existing) {
      if (
        existing.heroImageUrl &&
        existing.heroImageUrl !== validated.heroImageUrl
      ) {
        await deletePublicFile(existing.heroImageUrl);
      }
      if (
        existing.ketuaRtPhotoUrl &&
        existing.ketuaRtPhotoUrl !== validated.ketuaRtPhotoUrl
      ) {
        await deletePublicFile(existing.ketuaRtPhotoUrl);
      }
      if (existing.bannerUrl && existing.bannerUrl !== validated.bannerUrl) {
        await deletePublicFile(existing.bannerUrl);
      }
    }

    const homepage = await prisma.homepage.upsert({
      where: { id: "default" },
      update: validated,
      create: {
        id: "default",
        ...validated,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return { success: true, data: homepage };
  } catch (error) {
    console.error("Error updating homepage:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal mengupdate homepage" };
  }
}
