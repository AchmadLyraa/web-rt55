import { getAnnouncements } from "@/app/actions/announcement";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function AnnouncementsPage() {
  const result = await getAnnouncements();
  const announcements = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Pengumuman</h1>
          <p className="text-xl text-green-100">
            Informasi penting untuk semua warga RT
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl">
          {announcements.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
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
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Link
                  key={announcement.id}
                  href={`/pengumuman/${announcement.id}`}
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-green-600"
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
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-3">
                          {announcement.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {format(
                              new Date(announcement.createdAt),
                              "d MMMM yyyy HH:mm",
                              { locale: id },
                            )}{" "}
                            • {announcement.createdBy.name}
                          </p>
                          {announcement.attachment && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              File
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
