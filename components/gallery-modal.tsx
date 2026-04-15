"use client";

import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
}

interface GalleryModalProps {
  galleries: GalleryItem[];
}

export function GalleryModal({ galleries }: GalleryModalProps) {
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(
    null,
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (gallery: GalleryItem, index: number) => {
    setSelectedGallery(gallery);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedGallery(null);
  };

  const goToPrevious = () => {
    const newIndex =
      currentIndex === 0 ? galleries.length - 1 : currentIndex - 1;
    setSelectedGallery(galleries[newIndex]);
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex =
      currentIndex === galleries.length - 1 ? 0 : currentIndex + 1;
    setSelectedGallery(galleries[newIndex]);
    setCurrentIndex(newIndex);
  };

  return (
    <>
      {/* Gallery Grid - Instagram style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries.map((gallery, index) => (
          <div
            key={gallery.id}
            onClick={() => openModal(gallery, index)}
            className="group cursor-pointer"
          >
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
          </div>
        ))}
      </div>

      {/* Modal - Instagram style popup */}
      {selectedGallery && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Side */}
            <div className="relative w-full md:w-2/3 h-96 md:h-auto md:min-h-[500px] bg-gray-900">
              {selectedGallery.imageUrl && (
                <Image
                  src={selectedGallery.imageUrl}
                  alt={selectedGallery.title}
                  fill
                  className="object-contain"
                />
              )}

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-colors z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                {currentIndex + 1} / {galleries.length}
              </div>
            </div>

            {/* Details Side */}
            <div className="w-full md:w-1/3 p-6 flex flex-col">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 md:relative md:top-0 md:right-0 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Content */}
              <div className="mt-4 flex-1 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedGallery.title}
                </h2>

                <div className="mb-6 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      {format(
                        new Date(selectedGallery.createdAt),
                        "d MMMM yyyy",
                        {
                          locale: idLocale,
                        },
                      )}
                    </span>
                    {" • "}
                    <span>{selectedGallery.createdBy.name}</span>
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedGallery.description || "Tidak ada deskripsi"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
