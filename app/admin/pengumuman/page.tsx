"use client";

import { useState, useEffect } from "react";
import {
  getAnnouncementsPaginated,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/app/actions/announcement";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Paperclip } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    attachment: "",
  });

  useEffect(() => {
    loadAnnouncements(page);
  }, [page]);

  async function loadAnnouncements(p: number) {
    setIsLoading(true);
    const result = await getAnnouncementsPaginated(p);
    if (result.success) {
      setAnnouncements(result.data);
      setTotalPages(result.pagination.totalPages);
    }
    setIsLoading(false);
  }

  async function handleUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "announcements");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setError("Upload gagal");
      return;
    }
    const data = await res.json();
    setFormData((prev) => ({ ...prev, attachment: data.fileUrl }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = editingId
      ? await updateAnnouncement(editingId, formData)
      : await createAnnouncement(formData);
    if (result.success) {
      if (editingId)
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingId ? result.data : a)),
        );
      else {
        await loadAnnouncements(1);
        setPage(1);
      }
      setEditingId(null);
      setFormData({ title: "", content: "", attachment: "" });
      setShowForm(false);
    } else setError(result.error || "Gagal menyimpan");
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus?")) return;
    const result = await deleteAnnouncement(id);
    if (result.success) await loadAnnouncements(page);
    else setError(result.error || "Gagal menghapus");
  }

  function handleEdit(a: any) {
    setFormData({
      title: a.title,
      content: a.content,
      attachment: a.attachment || "",
    });
    setEditingId(a.id);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Kelola Pengumuman
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Buat dan kelola pengumuman untuk warga
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: "", content: "", attachment: "" });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-xs"
        >
          {showForm ? "Batal" : "+ Buat Pengumuman"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded bg-red-50 border border-red-200 text-red-600 text-xs">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-gray-800 mb-4">
            {editingId ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Judul pengumuman"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-white border-gray-300 text-gray-900 text-sm"
              disabled={isSubmitting}
            />
            <Textarea
              placeholder="Konten pengumuman..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={5}
              required
              className="bg-white border-gray-300 text-gray-900 text-sm resize-none"
              disabled={isSubmitting}
            />
            <div>
              <p className="text-xs text-gray-500 mb-1">
                File lampiran (opsional)
              </p>
              <input
                type="file"
                onChange={(e) => {
                  const f = e.currentTarget.files?.[0];
                  if (f) handleUpload(f);
                }}
                disabled={isSubmitting}
                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700"
              />
              {formData.attachment && (
                <p className="text-xs text-green-600 mt-1">✓ File siap</p>
              )}
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-xs"
            >
              {isSubmitting ? "Menyimpan..." : editingId ? "Update" : "Buat"}
            </Button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-400 text-sm text-center py-10">Memuat...</p>
      ) : announcements.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-10">
          Belum ada pengumuman
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">
                    Judul
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500 hidden md:table-cell">
                    Tanggal
                  </th>
                  <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500 hidden md:table-cell">
                    Lampiran
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {announcements.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {a.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {a.content}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 hidden md:table-cell whitespace-nowrap">
                      {format(new Date(a.createdAt), "d MMM yyyy", {
                        locale: id,
                      })}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {a.attachment ? (
                        <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleEdit(a)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-2 py-1 rounded text-xs transition-colors ${p === page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200"
      >
        →
      </button>
    </div>
  );
}
