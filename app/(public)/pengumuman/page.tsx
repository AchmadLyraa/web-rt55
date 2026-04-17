import { getAnnouncements } from "@/app/actions/announcement";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { FileText, Paperclip } from "lucide-react";

export default async function AnnouncementsPage() {
  const result = await getAnnouncements();
  const announcements = result.success ? result.data : [];

  // Split: top 4 as cards, rest as list
  const topAnnouncements = announcements.slice(0, 4);
  const restAnnouncements = announcements.slice(4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean Typography */}
      <div className="pt-28 bg-white relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-0.5 w-8 bg-blue-600" />
            <span className="text-blue-600 text-lg font-bold tracking-widest uppercase">
              Pengumuman untuk warga
            </span>
            <div className="h-0.5 w-8 bg-blue-600" />
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Informasi terbaru dan penting untuk seluruh warga RT.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        {announcements.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-5 h-5 text-blue-600" />
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
                          <FileText className="w-5 h-5 text-blue-600" />
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
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-600">
                              Oleh: {announcement.createdBy.name}
                            </p>
                            {announcement.attachment && (
                              <Paperclip className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
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
                            <FileText className="w-5 h-5 text-blue-600" />
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
                            <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
