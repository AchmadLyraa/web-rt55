import { getHomepage } from "@/app/actions/homepage";
import Image from "next/image";
import Link from "next/link";
import { Maps } from "@/components/maps";
import {
  Users,
  Home,
  UserCheck,
  Heart,
  ChevronDown,
  MapPin,
  ArrowRight,
} from "lucide-react";

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
    <div className="bg-white overflow-x-hidden">
      {/* ───── HERO ───── */}
      <div className="relative w-full h-screen overflow-hidden">
        {homepage?.heroImageUrl ? (
          <Image
            src={homepage.heroImageUrl}
            alt={homepage.rtName}
            fill
            className="object-cover scale-105"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <div className="text-center text-white max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 text-white/90">
              <MapPin className="w-3.5 h-3.5" />
              Website Resmi Warga
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-none">
              {homepage?.rtName || "RT 55"}
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
              Platform komunikasi dan transparansi warga — satu tempat untuk
              semua informasi lingkungan.
            </p>

            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/galeri">
                <button className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold rounded-full hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Lihat Galeri
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/pengumuman">
                <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all">
                  Baca Pengumuman
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {homepage && (
        <>
          {/* ───── SAMBUTAN ───── */}
          <section className="py-24 md:py-32 bg-white">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-blue-600" />
                <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
                  Sambutan
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Ketua RT
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="md:order-1">
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {homepage.sambutan}
                  </p>
                  {homepage.ketuaRtName && (
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {homepage.ketuaRtName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {homepage.ketuaRtName}
                        </p>
                        <p className="text-sm text-gray-500">Ketua RT</p>
                      </div>
                    </div>
                  )}
                </div>

                {homepage.ketuaRtName && (
                  <div className="order-1 md:order-2 flex justify-center md:justify-end">
                    <div className="relative">
                      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 -z-10" />
                      <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl">
                        {homepage.ketuaRtPhotoUrl ? (
                          <Image
                            src={homepage.ketuaRtPhotoUrl}
                            alt={homepage.ketuaRtName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                            <UserCheck className="w-24 h-24 text-blue-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ───── VISI MISI ───── */}
          <section className="py-24 md:py-32 bg-gray-50">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-blue-600" />
                <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
                  Arah Kami
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12">
                Visi & Misi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="text-5xl font-black text-white/40 mb-4">
                    01
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Visi</h3>
                  <p className="text-white/85 leading-relaxed">
                    {homepage.visi}
                  </p>
                </div>

                <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 p-8 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="text-5xl font-black text-gray-400 mb-4">
                    02
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Misi
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {homepage.misi}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ───── STATISTIK ───── */}
          <section className="py-20 bg-gray-950 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="container mx-auto px-4 max-w-5xl relative">
              <div className="text-center mb-14">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-8 bg-blue-400" />
                  <span className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
                    Data
                  </span>
                  <div className="h-px w-8 bg-blue-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-black">
                  Statistik Warga
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    value: wargaStats.totalKepalaKeluarga,
                    label: "Kepala Keluarga",
                    icon: Home,
                    color: "text-blue-400",
                  },
                  {
                    value: wargaStats.totalLakiLaki,
                    label: "Laki-laki",
                    icon: Users,
                    color: "text-green-400",
                  },
                  {
                    value: wargaStats.totalPerempuan,
                    label: "Perempuan",
                    icon: Heart,
                    color: "text-pink-400",
                  },
                  {
                    value: wargaStats.totalRumah,
                    label: "Rumah",
                    icon: Home,
                    color: "text-orange-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <stat.icon
                      className={`w-6 h-6 ${stat.color} mx-auto mb-3 opacity-80`}
                    />
                    <div
                      className={`text-4xl md:text-5xl font-black mb-1 ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <p className="text-white/60 text-sm font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ───── GALERI ───── */}
          <section className="py-24 md:py-32 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
                      Foto
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900">
                    Galeri Terbaru
                  </h2>
                </div>
                <Link
                  href="/galeri"
                  className="hidden md:inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
                >
                  Lihat semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {galleryPreview.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {galleryPreview.map((gallery, i) => (
                      <div
                        key={gallery.id}
                        className={`group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                          i === 0 ? "md:col-span-2 md:row-span-2" : ""
                        }`}
                      >
                        <div
                          className={`relative bg-gray-200 ${i === 0 ? "h-72 md:h-full" : "h-44"}`}
                        >
                          {gallery.imageUrl && (
                            <Image
                              src={gallery.imageUrl}
                              alt={gallery.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                            <p className="p-4 text-white font-semibold text-sm">
                              {gallery.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-10 md:hidden">
                    <Link href="/galeri">
                      <button className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all">
                        Lihat Selengkapnya <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">Belum ada galeri</p>
                </div>
              )}
            </div>
          </section>

          {/* ───── MAPS ───── */}
          <section className="py-24 md:py-32 bg-white">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-blue-600" />
                <span className="text-blue-600 text-sm font-semibold tracking-widest uppercase">
                  Lokasi
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12">
                Temukan Kami
              </h2>
              <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <Maps />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
