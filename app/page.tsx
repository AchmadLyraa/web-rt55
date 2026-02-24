import { getHomepage } from '@/app/actions/homepage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function HomePage() {
  const result = await getHomepage();
  const homepage = result.success ? result.data : null;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {homepage?.bannerUrl && (
        <div className="relative h-96 bg-cover bg-center" 
          style={{ backgroundImage: `url(${homepage.bannerUrl})` }}>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {homepage.rtName}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        {homepage && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Sambutan</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {homepage.sambutan}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visi</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {homepage.visi}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Misi</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {homepage.misi}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link href="/galeri">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">📸 Galeri</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lihat koleksi foto kegiatan RT
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/pengumuman">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">📢 Pengumuman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Baca pengumuman terbaru
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/laporan">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">💰 Laporan Kas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lihat laporan keuangan RT
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/login">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">🔐 Admin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Akses panel admin
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
