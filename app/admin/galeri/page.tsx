'use client';

import { useState, useEffect } from 'react';
import { getGalleries, createGallery, deleteGallery } from '@/app/actions/gallery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export default function AdminGalleryPage() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    loadGalleries();
  }, []);

  async function loadGalleries() {
    try {
      const result = await getGalleries();
      if (result.success) {
        setGalleries(result.data);
      }
    } catch (err) {
      console.error('[v0] Error loading galleries:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUploadImage(file: File) {
    try {
      setUploadProgress(0);
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('category', 'gallery');

      console.log('[v0] Uploading gallery image:', file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('[v0] Upload successful:', data.fileUrl);
      setFormData({ ...formData, imageUrl: data.fileUrl });
      setUploadProgress(100);
    } catch (err) {
      console.error('[v0] Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload gagal');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      if (!formData.imageUrl) {
        throw new Error('Foto harus diupload');
      }

      console.log('[v0] Creating gallery');
      const result = await createGallery(formData);

      if (result.success) {
        setGalleries([result.data, ...galleries]);
        setFormData({ title: '', description: '', imageUrl: '' });
        setShowForm(false);
        console.log('[v0] Gallery created successfully');
      } else {
        setError(result.error || 'Gagal membuat galeri');
      }
    } catch (err) {
      console.error('[v0] Error creating gallery:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus galeri ini?')) return;

    try {
      console.log('[v0] Deleting gallery:', id);
      const result = await deleteGallery(id);

      if (result.success) {
        setGalleries(galleries.filter((g) => g.id !== id));
        console.log('[v0] Gallery deleted successfully');
      } else {
        setError(result.error || 'Gagal menghapus');
      }
    } catch (err) {
      console.error('[v0] Error deleting gallery:', err);
      setError('Terjadi kesalahan');
    }
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
          <h1 className="text-4xl font-bold mb-2">Kelola Galeri</h1>
          <p className="text-muted-foreground">Kelola koleksi foto RT</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : '+ Tambah Foto'}
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
            <CardTitle>Tambah Foto Baru</CardTitle>
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
                  placeholder="Judul foto..."
                  disabled={isCreating}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi foto..."
                  rows={3}
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      handleUploadImage(file);
                    }
                  }}
                  disabled={isCreating}
                  className="block w-full text-sm"
                  required
                />
                {formData.imageUrl && (
                  <div className="text-sm text-muted-foreground">
                    ✓ Foto sudah diupload
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

              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? 'Membuat...' : 'Buat Galeri'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {galleries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Belum ada foto. Mulai dengan menambah foto baru.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="overflow-hidden">
              <div className="relative h-48 bg-secondary">
                {gallery.imageUrl && (
                  <Image
                    src={gallery.imageUrl}
                    alt={gallery.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-1">{gallery.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {gallery.description || 'Tidak ada deskripsi'}
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleDelete(gallery.id)}
                >
                  Hapus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
