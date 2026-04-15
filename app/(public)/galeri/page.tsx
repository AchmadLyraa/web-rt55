"use client";

import { getGalleries } from "@/app/actions/gallery";
import { GalleryModal } from "@/components/gallery-modal";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      const result = await getGalleries();
      if (result.success) {
        setGalleries(result.data || []);
      }
      setLoading(false);
    };

    fetchGalleries();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean Typography */}
      <div className="bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
            Galeri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dokumentasi kegiatan dan momen berharga komunitas RT
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-20">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-500">Memuat galeri...</p>
          </div>
        ) : galleries.length === 0 ? (
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
          <GalleryModal galleries={galleries} />
        )}
      </div>
    </div>
  );
}
