import { getGalleries } from '@/app/actions/gallery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default async function GalleryPage() {
  const result = await getGalleries();
  const galleries = result.success ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Galeri</h1>
        <p className="text-muted-foreground">
          Koleksi foto kegiatan dan momen-momen berharga RT 55
        </p>
      </div>

      {galleries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Belum ada foto di galeri
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="overflow-hidden hover:border-primary transition-colors">
              <div className="relative h-64 bg-secondary">
                {gallery.imageUrl && (
                  <Image
                    src={gallery.imageUrl}
                    alt={gallery.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{gallery.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {gallery.description || 'Tidak ada deskripsi'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Oleh: {gallery.createdBy.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
