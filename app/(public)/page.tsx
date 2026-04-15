import { getHomepage } from "@/app/actions/homepage";
import Image from "next/image";
import Link from "next/link";
import { Maps } from "@/components/maps";

export default async function HomePage() {
  const result = await getHomepage();
  const { homepage, galleryPreview, wargaStats } =
    result.success && result.data
      ? result.data
      : {
          homepage: null,
          galleryPreview: [],
          wargaStats: {
            totalKepalaKeluarga: 0,
            totalLakiLaki: 0,
            totalPerempuan: 0,
            totalRumah: 0,
          },
        };

  return (
    <div className="bg-white">
      {/* Hero Section dengan Full Viewport Height */}
      <div className="relative w-full h-screen bg-gray-800 overflow-hidden">
        {homepage?.heroImageUrl ? (
          <Image
            src={homepage.heroImageUrl}
            alt={homepage.rtName}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-700"></div>
        )}

        {/* Overlay untuk text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content pada hero */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {homepage?.rtName || "RT 55"}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Platform Komunikasi dan Transparansi Warga
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/galeri">
                <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition-colors">
                  Lihat Galeri
                </button>
              </Link>
              <Link href="/pengumuman">
                <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors">
                  Baca Pengumuman
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen bg-white">
        {/* Sambutan Section */}
        {homepage && (
          <>
            <section className="py-16 md:py-24 border-b border-gray-200">
              <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                    Sambutan
                  </h2>
                  <div className="h-1 w-16 bg-blue-600 mx-auto mb-8"></div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {homepage.sambutan}
                  </p>
                </div>
              </div>
            </section>

            {/* Sambutan & Ketua RT Section */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                  Sambutan Ketua RT
                </h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto mb-12"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
                  {/* Sambutan Text - Left on Desktop, Top on Mobile */}
                  <div className="order-2 md:order-1">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {homepage.sambutan}
                    </p>
                    {homepage.ketuaRtName && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">
                            {homepage.ketuaRtName}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">Ketua RT</p>
                      </div>
                    )}
                  </div>

                  {/* Ketua RT Photo - Right on Desktop, Bottom on Mobile */}
                  {homepage.ketuaRtName && (
                    <div className="order-1 md:order-2 flex justify-center">
                      <div className="w-64 h-80">
                        {homepage.ketuaRtPhotoUrl ? (
                          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                              src={homepage.ketuaRtPhotoUrl}
                              alt={homepage.ketuaRtName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-lg bg-gray-300 flex items-center justify-center">
                            <svg
                              className="w-32 h-32 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Visi & Misi Section */}
            <section className="py-16 md:py-24 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                  Visi & Misi
                </h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto mb-12"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                  {/* Visi */}
                  <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Visi
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {homepage.visi}
                    </p>
                  </div>

                  {/* Misi */}
                  <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Misi
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {homepage.misi}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Statistik Warga Section */}
            <section className="py-16 md:py-24 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                  Statistik Warga
                </h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto mb-12"></div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                  {/* Total Kepala Keluarga */}
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                      {wargaStats.totalKepalaKeluarga}
                    </div>
                    <p className="text-gray-600 font-semibold">
                      Kepala Keluarga
                    </p>
                  </div>

                  {/* Total Laki-laki */}
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                      {wargaStats.totalLakiLaki}
                    </div>
                    <p className="text-gray-600 font-semibold">Laki-laki</p>
                  </div>

                  {/* Total Perempuan */}
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-pink-600 mb-2">
                      {wargaStats.totalPerempuan}
                    </div>
                    <p className="text-gray-600 font-semibold">Perempuan</p>
                  </div>

                  {/* Total Rumah */}
                  <div className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">
                      {wargaStats.totalRumah}
                    </div>
                    <p className="text-gray-600 font-semibold">Rumah</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Galeri Preview Section */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                  Galeri Terbaru
                </h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto mb-12"></div>

                {galleryPreview.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {galleryPreview.map((gallery) => (
                        <div key={gallery.id} className="group cursor-pointer">
                          <div className="relative h-56 bg-gray-200 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                            {gallery.imageUrl && (
                              <Image
                                src={gallery.imageUrl}
                                alt={gallery.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                              <div className="p-4 w-full">
                                <h3 className="text-white font-bold text-sm">
                                  {gallery.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <Link href="/galeri">
                        <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors">
                          Lihat Selengkapnya
                        </button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500">Belum ada galeri</p>
                  </div>
                )}
              </div>
            </section>

            {/* Maps Section */}
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                  Lokasi RT
                </h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto mb-12"></div>

                <div className="max-w-4xl mx-auto">
                  <Maps />
                </div>
              </div>
            </section>

            {/* Features/Menu Section */}
            <section className="py-16 md:py-24 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                  Menu Utama
                </h2>
                <div className="h-1 w-16 bg-blue-600 mx-auto mb-12"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Galeri */}
                  <Link href="/galeri" className="group">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 group-hover:border-blue-600 group-hover:shadow-lg transition-all h-full">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                        <svg
                          className="w-6 h-6 text-blue-600 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Galeri
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Koleksi foto kegiatan dan dokumentasi RT
                      </p>
                    </div>
                  </Link>

                  {/* Pengumuman */}
                  <Link href="/pengumuman" className="group">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 group-hover:border-blue-600 group-hover:shadow-lg transition-all h-full">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                        <svg
                          className="w-6 h-6 text-green-600 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Pengumuman
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Informasi dan berita terbaru untuk warga
                      </p>
                    </div>
                  </Link>

                  {/* Laporan Kas */}
                  <Link href="/laporan" className="group">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 group-hover:border-blue-600 group-hover:shadow-lg transition-all h-full">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                        <svg
                          className="w-6 h-6 text-purple-600 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Laporan Kas
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Transparansi keuangan dan laporan RT
                      </p>
                    </div>
                  </Link>

                  {/* Admin */}
                  <Link href="/login" className="group">
                    <div className="bg-white rounded-lg p-6 border border-gray-200 group-hover:border-blue-600 group-hover:shadow-lg transition-all h-full">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
                        <svg
                          className="w-6 h-6 text-orange-600 group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Admin Panel
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Kelola konten dan data RT
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
