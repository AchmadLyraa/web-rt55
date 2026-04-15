import { getAnnouncements } from "@/app/actions/announcement";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default async function AnnouncementsPage() {
  const result = await getAnnouncements();
  const announcements = result.success ? result.data : [];

  // Split: top 4 as cards, rest as list
  const topAnnouncements = announcements.slice(0, 4);
  const restAnnouncements = announcements.slice(4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean Typography */}
      <div className="bg-white pt-20 pb-16 border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
            Pengumuman
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Informasi penting untuk semua warga RT
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {announcements.length === 0 ? (
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
                d="M11 5.882V19.24a1.961 1.961 0 01-2.968.806l-7.036-4.743A2 2 0 01.075 13.85V10.15a2 2 0 011.921-1.997l7.036-4.743a1.961 1.961 0 012.968.806zM15.75 5.75a4 4 0 018 0v8.5a4 4 0 01-8 0V5.75z"
              />
            </svg>
            <p className="text-gray-500 text-lg">Belum ada pengumuman</p>
          </div>
        ) : (
          <>
            {/* Top 4 Announcements - Card Grid */}
            {topAnnouncements.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  Pengumuman Terbaru
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topAnnouncements.map((announcement) => (
                    <Link
                      key={announcement.id}
                      href={`/pengumuman/${announcement.id}`}
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex-grow">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {announcement.content}
                        </p>
                        <div className="pt-4 border-t border-gray-100 space-y-2">
                          <p className="text-xs text-gray-500">
                            {format(
                              new Date(announcement.createdAt),
                              "d MMMM yyyy",
                              { locale: idLocale },
                            )}
                          </p>
                          <p className="text-xs text-gray-600">
                            Oleh: {announcement.createdBy.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Rest of Announcements - List */}
            {restAnnouncements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Pengumuman Lainnya
                </h2>
                <div className="space-y-3 max-w-3xl">
                  {restAnnouncements.map((announcement) => (
                    <Link
                      key={announcement.id}
                      href={`/pengumuman/${announcement.id}`}
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center mt-0.5">
                            <svg
                              className="w-5 h-5 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2v-5.5a2 2 0 012-2h2.5a2 2 0 012 2v5.5a2 2 0 01-2 2h-2.5z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {announcement.title}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {format(
                                new Date(announcement.createdAt),
                                "d MMMM yyyy",
                                { locale: idLocale },
                              )}{" "}
                              • {announcement.createdBy.name}
                            </p>
                          </div>
                          {announcement.attachment && (
                            <svg
                              className="w-5 h-5 text-blue-600 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
