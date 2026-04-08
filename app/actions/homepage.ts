"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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
    return { success: true, data: homepage };
  } catch (error) {
    console.error("[v0] Error getting homepage:", error);
    return { success: false, error: "Gagal mengambil data homepage" };
  }
}

export async function updateHomepage(data: z.infer<typeof homepageSchema>) {
  try {
    await requireAdmin();
    const validated = homepageSchema.parse(data);

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
    console.error("[v0] Error updating homepage:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal mengupdate homepage" };
  }
}
