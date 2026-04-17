import { getAnnouncementById } from "@/app/actions/announcement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAnnouncementById(id);
  const announcement = result.success ? result.data : null;

  if (!announcement) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Pengumuman tidak ditemukan
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-12 pt-24">
      <Link href="/pengumuman">
        <Button variant="outline" className="mb-4">
          ← Kembali ke Pengumuman
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{announcement.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {format(new Date(announcement.createdAt), "d MMMM yyyy HH:mm", {
              locale: idLocale,
            })}{" "}
            • {announcement.createdBy.name}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-muted-foreground">
              {announcement.content}
            </p>
          </div>

          {announcement.attachment && (
            <div className="border-t pt-4">
              <p className="font-semibold text-sm mb-2">File Terlampir</p>
              <a
                href={announcement.attachment}
                download
                className="text-primary hover:underline text-sm"
              >
                📎 Download file
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
