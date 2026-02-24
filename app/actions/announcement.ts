"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const announcementSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  content: z.string().min(1, "Konten wajib diisi"),
  attachment: z.string().optional(),
});

export async function getAnnouncements(limit?: number) {
  try {
    const announcements = await prisma.announcement.findMany({
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
    return { success: true, data: announcements };
  } catch (error) {
    console.error("[v0] Error getting announcements:", error);
    return { success: false, error: "Gagal mengambil data pengumuman" };
  }
}

export async function getAnnouncementById(id: string) {
  try {
    const announcement = await prisma.announcement.findUnique({
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
    return { success: true, data: announcement };
  } catch (error) {
    console.error("[v0] Error getting announcement:", error);
    return { success: false, error: "Gagal mengambil detail pengumuman" };
  }
}

export async function createAnnouncement(
  data: z.infer<typeof announcementSchema>
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = announcementSchema.parse(data);

    const announcement = await prisma.announcement.create({
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

    revalidatePath("/pengumuman");
    revalidatePath("/admin/pengumuman");

    return { success: true, data: announcement };
  } catch (error) {
    console.error("[v0] Error creating announcement:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal membuat pengumuman baru" };
  }
}

export async function updateAnnouncement(
  id: string,
  data: z.infer<typeof announcementSchema>
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const validated = announcementSchema.parse(data);

    const announcement = await prisma.announcement.update({
      where: { id },
      data: validated,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    revalidatePath("/pengumuman");
    revalidatePath("/admin/pengumuman");

    return { success: true, data: announcement };
  } catch (error) {
    console.error("[v0] Error updating announcement:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Gagal mengupdate pengumuman" };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const announcement = await prisma.announcement.delete({
      where: { id },
    });

    revalidatePath("/pengumuman");
    revalidatePath("/admin/pengumuman");

    return { success: true, data: announcement };
  } catch (error) {
    console.error("[v0] Error deleting announcement:", error);
    return { success: false, error: "Gagal menghapus pengumuman" };
  }
}
