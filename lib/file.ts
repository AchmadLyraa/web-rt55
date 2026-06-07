import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function deletePublicFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;

  let normalizedUrl = fileUrl;
  if (fileUrl.startsWith("/api/files/")) {
    normalizedUrl = fileUrl.replace("/api/files/", "/files/");
  }

  if (!normalizedUrl.startsWith("/files/")) return;

  try {
    const filePath = join(process.cwd(), "public", normalizedUrl);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error("[file] Gagal hapus file:", fileUrl, error);
  }
}
