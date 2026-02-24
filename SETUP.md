# Setup Guide - RT 55 Website

## Prerequisites
- Node.js 18+
- PostgreSQL running locally or remote connection string

## Environment Setup

1. **Copy .env.local file** (already created, update with your database):
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/rt_website"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

2. **Update NEXTAUTH_SECRET** dengan random string yang panjang untuk production:
```bash
openssl rand -base64 32
```

## Installation & Database Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Setup database schema**:
```bash
pnpm exec prisma migrate dev --name init
```

3. **Seed default data** (create admin account):
```bash
pnpm exec prisma db seed
```

Ini akan membuat:
- **Admin Account**: 
  - Email: `admin@rt.local`
  - Password: `admin123`
- **Default Homepage** dengan data sampel

## Running the Application

```bash
pnpm dev
```

Application akan berjalan di http://localhost:3000

## Features

### Public Pages (tanpa login)
- **Home** (`/`) - Halaman beranda dengan info RT
- **Gallery** (`/galeri`) - Lihat koleksi foto
- **Announcements** (`/pengumuman`) - Baca pengumuman warga
- **Cash Reports** (`/laporan`) - Lihat laporan keuangan RT

### Admin Dashboard (perlu login dengan role ADMIN)
- **Manage Homepage** (`/admin/homepage`) - Edit sambutan, visi, misi, banner
- **Manage Gallery** (`/admin/galeri`) - Upload dan kelola foto
- **Manage Announcements** (`/admin/pengumuman`) - CRUD pengumuman
- **Manage Cash Reports** (`/admin/laporan`) - Input transaksi keuangan

## Authentication

Website menggunakan **NextAuth.js v5** dengan Credentials Provider:

- Login/Logout di navbar
- Role-based access control (ADMIN vs WARGA)
- Protected routes dengan middleware
- Session management dengan JWT

## File Upload

File upload menggunakan API route `/api/upload`:
- Simpan ke folder `public/files/[category]/`
- Support: JPEG, PNG, GIF, WebP, PDF
- Max size: 5MB per file
- Categories: `homepage`, `gallery`, `announcements`

## Database Schema

### Models:
- **User** - Admin dan Warga accounts
- **Homepage** - Info beranda (Sambutan, Visi, Misi, Banner)
- **Gallery** - Koleksi foto dengan deskripsi
- **Announcement** - Pengumuman untuk warga
- **CashTransaction** - Transaksi keuangan (PEMASUKAN/PENGELUARAN)

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL running
- Check DATABASE_URL di .env.local
- Verify username dan password

### Upload File Error
- Pastikan folder `public/files/` sudah ada
- Check permission read/write di folder tersebut
- File size tidak melebihi 5MB

### Auth Error
- Clear browser cookies/cache
- Verify NEXTAUTH_SECRET di .env.local
- Check database apakah admin user sudah ter-seed

## Development Notes

- Semua data mutations menggunakan Server Actions
- File upload menggunakan API route untuk fleksibilitas
- Dark theme color scheme (professional blue & gray)
- Responsive design mobile-first approach
- Validasi menggunakan Zod schema
