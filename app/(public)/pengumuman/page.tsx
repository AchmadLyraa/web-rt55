import { getAnnouncements } from '@/app/actions/announcement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default async function AnnouncementsPage() {
  const result = await getAnnouncements();
  const announcements = result.success ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pengumuman</h1>
        <p className="text-muted-foreground">
          Pengumuman penting untuk semua warga RT 55
        </p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Belum ada pengumuman
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Link key={announcement.id} href={`/pengumuman/${announcement.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(announcement.createdAt), 'd MMMM yyyy HH:mm', { locale: id })} • {announcement.createdBy.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                  {announcement.attachment && (
                    <p className="text-xs text-primary mt-2">📎 Ada file terlampir</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
