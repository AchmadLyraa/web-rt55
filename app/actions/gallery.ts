"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const gallerySchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL wajib diisi"),
});

export async function getGalleries(limit?: number) {
  try {
    const galleries = await prisma.gallery.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return { success: true, data: galleries };
  } catch (error) {
    console.error("[v0] Error getting galleries:", error);
    return { success: false, error: "Gagal mengambil data galeri" };
  }
}

export async function getGalleryById(id: string) {
  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { success: true, data: gallery };
  } catch (error) {
    console.error("[v0] Error getting gallery:", error);
    return { success: false, error: "Gagal mengambil detail galeri" };
  }
}

export async function createGallery(data: z.infer<typeof gallerySchema>) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = gallerySchema.parse(data);

    const gallery = await prisma.gallery.create({
      data: {
        ...validated,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/galeri");
    revalidatePath("/admin/galeri");

    return { success: true, data: gallery };
  } catch (error) {
    console.error("[v0] Error creating gallery:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal membuat galeri baru" };
  }
}

export async function deleteGallery(id: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const gallery = await prisma.gallery.delete({
      where: { id },
    });

    revalidatePath("/galeri");
    revalidatePath("/admin/galeri");

    return { success: true, data: gallery };
  } catch (error) {
    console.error("[v0] Error deleting gallery:", error);
    return { success: false, error: "Gagal menghapus galeri" };
  }
}
