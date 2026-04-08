import { getGalleries } from "@/app/actions/gallery";
import Image from "next/image";

export default async function GalleryPage() {
  const result = await getGalleries();
  const galleries = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Galeri Foto</h1>
          <p className="text-xl text-blue-100">
            Dokumentasi kegiatan dan momen berharga komunitas RT
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {galleries.length === 0 ? (
          <div className="text-center py-20">
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
            <p className="text-gray-500 text-lg">Belum ada foto di galeri</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((gallery) => (
              <div key={gallery.id} className="group cursor-pointer">
                <div className="relative h-72 bg-gray-200 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
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
                      <h3 className="text-white font-bold text-lg">
                        {gallery.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-gray-900 mb-2">
                    {gallery.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {gallery.description || "Tidak ada deskripsi"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Oleh: {gallery.createdBy.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
