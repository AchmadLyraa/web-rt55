import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar (maksimal 5MB)" },
        { status: 400 }
      );
    }

    // Create directory structure
    const uploadDir = join(process.cwd(), "public", "files", category);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate filename with timestamp
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const filename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

    // Write file
    const filepath = join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(buffer));

    // Return the relative URL path
    const fileUrl = `/files/${category}/${filename}`;

    console.log("[v0] File uploaded successfully:", fileUrl);

    return NextResponse.json({
      success: true,
      fileUrl,
      filename,
    });
  } catch (error) {
    console.error("[v0] Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
