'use client';

import { useState, useEffect } from 'react';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/app/actions/announcement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    attachment: '',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const result = await getAnnouncements();
      if (result.success) {
        setAnnouncements(result.data);
      }
    } catch (err) {
      console.error('[v0] Error loading announcements:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUploadAttachment(file: File) {
    try {
      setUploadProgress(0);
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('category', 'announcements');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setFormData({ ...formData, attachment: data.fileUrl });
      setUploadProgress(100);
    } catch (err) {
      console.error('[v0] Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload gagal');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = editingId
        ? await updateAnnouncement(editingId, formData)
        : await createAnnouncement(formData);

      if (result.success) {
        if (editingId) {
          setAnnouncements(
            announcements.map((a) => (a.id === editingId ? result.data : a))
          );
          setEditingId(null);
        } else {
          setAnnouncements([result.data, ...announcements]);
        }
        setFormData({ title: '', content: '', attachment: '' });
        setShowForm(false);
      } else {
        setError(result.error || 'Gagal menyimpan');
      }
    } catch (err) {
      console.error('[v0] Error:', err);
      setError('Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;

    try {
      const result = await deleteAnnouncement(id);
      if (result.success) {
        setAnnouncements(announcements.filter((a) => a.id !== id));
      } else {
        setError(result.error || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('[v0] Error deleting:', err);
      setError('Terjadi kesalahan');
    }
  }

  function handleEdit(announcement: any) {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      attachment: announcement.attachment || '',
    });
    setEditingId(announcement.id);
    setShowForm(true);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Kelola Pengumuman</h1>
          <p className="text-muted-foreground">Buat dan kelola pengumuman untuk warga</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', content: '', attachment: '' }); }}>
          {showForm ? 'Batal' : '+ Buat Pengumuman'}
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-3 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Judul</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Judul pengumuman..."
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Konten</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Konten pengumuman..."
                  rows={6}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">File Terlampir (Opsional)</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      handleUploadAttachment(file);
                    }
                  }}
                  disabled={isSubmitting}
                  className="block w-full text-sm"
                />
                {formData.attachment && (
                  <div className="text-sm text-muted-foreground">
                    ✓ File sudah diupload
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Update' : 'Buat Pengumuman'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Belum ada pengumuman. Mulai dengan membuat pengumuman baru.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(announcement.createdAt), 'd MMMM yyyy HH:mm', {
                    locale: id,
                  })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(announcement)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
